import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import { ArrowLeft, User, FileText, CheckCircle, Clock, Send, Check, X, Save } from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  subject: string;
  exam_date: string;
  total_marks: number;
}

interface AnswerGrade {
  question_id: string;
  status: 'correct' | 'wrong' | 'pending';
  marks_awarded: number;
}

interface StudentSubmission {
  student_id: string;
  student_name: string;
  student_email: string | null;
  status: string;
  submitted_at: string | null;
  answers: {
    question_id: string;
    question_number: number;
    question_text: string;
    answer_text: string | null;
    marks: number;
    answer_status: string;
    marks_awarded: number;
  }[];
  has_result: boolean;
  is_graded: boolean;
  marks_obtained?: number;
  grade?: string;
  feedback?: string;
}

interface ExamQuestion {
  id: string;
  question_number: number;
  question_text_ur: string;
  marks: number;
}

const ExamSubmissions: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { role } = useAuth();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Per-student grading state
  const [answerGrades, setAnswerGrades] = useState<Record<string, Record<string, AnswerGrade>>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const [savingStudent, setSavingStudent] = useState<string | null>(null);
  const [sendingStudent, setSendingStudent] = useState<string | null>(null);

  useEffect(() => {
    if (examId) {
      fetchExamData();
    }
  }, [examId]);

  const fetchExamData = async () => {
    try {
      // Fetch exam details
      const { data: examData, error: examError } = await supabase
        .from('exams')
        .select('*')
        .eq('id', examId)
        .single();

      if (examError) throw examError;
      setExam(examData);

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('exam_questions')
        .select('*')
        .eq('exam_id', examId)
        .order('question_number');

      if (questionsError) throw questionsError;
      setQuestions(questionsData || []);

      // Fetch assignments with completed status
      const { data: assignments, error: assignmentsError } = await supabase
        .from('exam_assignments')
        .select('student_id, status, end_time')
        .eq('exam_id', examId)
        .eq('status', 'completed');

      if (assignmentsError) throw assignmentsError;

      const studentIds = assignments?.map(a => a.student_id) || [];
      
      if (studentIds.length === 0) {
        setSubmissions([]);
        setLoading(false);
        return;
      }

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', studentIds);

      if (profilesError) throw profilesError;

      // Fetch all submissions with grading status
      const { data: allSubmissions, error: submissionsError } = await supabase
        .from('exam_submissions')
        .select('student_id, question_id, answer_text, submitted_at, answer_status, marks_awarded')
        .eq('exam_id', examId)
        .in('student_id', studentIds);

      if (submissionsError) throw submissionsError;

      // Fetch existing results
      const { data: existingResults, error: resultsError } = await supabase
        .from('exam_results')
        .select('student_id, marks_obtained, grade, feedback')
        .eq('exam_id', examId)
        .in('student_id', studentIds);

      if (resultsError) throw resultsError;

      // Build student submissions
      const studentSubmissions: StudentSubmission[] = assignments?.map(assignment => {
        const profile = profiles?.find(p => p.user_id === assignment.student_id);
        const studentAnswers = allSubmissions?.filter(s => s.student_id === assignment.student_id) || [];
        const existingResult = existingResults?.find(r => r.student_id === assignment.student_id);
        
        const answers = questionsData?.map(q => {
          const answer = studentAnswers.find(a => a.question_id === q.id);
          return {
            question_id: q.id,
            question_number: q.question_number,
            question_text: q.question_text_ur,
            answer_text: answer?.answer_text || null,
            marks: q.marks,
            answer_status: answer?.answer_status || 'pending',
            marks_awarded: answer?.marks_awarded || 0
          };
        }) || [];

        // Check if all answers are graded (not pending)
        const isGraded = answers.every(a => a.answer_status !== 'pending');

        return {
          student_id: assignment.student_id,
          student_name: profile?.full_name || 'Unknown Student',
          student_email: profile?.email || null,
          status: assignment.status,
          submitted_at: assignment.end_time,
          answers,
          has_result: !!existingResult,
          is_graded: isGraded,
          marks_obtained: existingResult?.marks_obtained,
          grade: existingResult?.grade || undefined,
          feedback: existingResult?.feedback || undefined
        };
      }) || [];

      setSubmissions(studentSubmissions);
      
      // Initialize answer grades from saved data
      const initialGrades: Record<string, Record<string, AnswerGrade>> = {};
      const initialFeedbacks: Record<string, string> = {};
      
      studentSubmissions.forEach(student => {
        initialGrades[student.student_id] = {};
        initialFeedbacks[student.student_id] = student.feedback || '';
        
        student.answers.forEach(answer => {
          initialGrades[student.student_id][answer.question_id] = {
            question_id: answer.question_id,
            status: answer.answer_status as 'correct' | 'wrong' | 'pending',
            marks_awarded: answer.marks_awarded
          };
        });
      });
      
      setAnswerGrades(initialGrades);
      setFeedbacks(initialFeedbacks);
      
    } catch (error: any) {
      console.error('Error fetching exam data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch submissions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = (marks: number, total: number): string => {
    const percentage = (marks / total) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const handleAnswerGrade = (studentId: string, questionId: string, status: 'correct' | 'wrong') => {
    const question = questions.find(q => q.id === questionId);
    const marksAwarded = status === 'correct' ? (question?.marks || 0) : 0;
    
    setAnswerGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [questionId]: {
          question_id: questionId,
          status,
          marks_awarded: marksAwarded
        }
      }
    }));
  };

  const getStudentTotalMarks = (studentId: string): number => {
    const studentGrades = answerGrades[studentId];
    if (!studentGrades) return 0;
    
    return Object.values(studentGrades).reduce((total, grade) => total + grade.marks_awarded, 0);
  };

  const isAllGraded = (studentId: string): boolean => {
    const studentGrades = answerGrades[studentId];
    if (!studentGrades) return false;
    
    return Object.values(studentGrades).every(grade => grade.status !== 'pending');
  };

  const handleSaveResult = async (student: StudentSubmission) => {
    if (!examId || !exam) return;
    
    if (!isAllGraded(student.student_id)) {
      toast({
        title: "Incomplete",
        description: "Please mark all answers as correct or wrong",
        variant: "destructive"
      });
      return;
    }

    setSavingStudent(student.student_id);
    try {
      const studentGrades = answerGrades[student.student_id];
      
      // Update each submission with grading status
      for (const [questionId, grade] of Object.entries(studentGrades)) {
        const { error: updateError } = await supabase
          .from('exam_submissions')
          .update({
            answer_status: grade.status,
            marks_awarded: grade.marks_awarded
          })
          .eq('exam_id', examId)
          .eq('student_id', student.student_id)
          .eq('question_id', questionId);

        if (updateError) {
          console.error('Error updating submission:', updateError);
        }
      }

      const totalMarks = getStudentTotalMarks(student.student_id);
      const grade = calculateGrade(totalMarks, exam.total_marks);
      const feedback = feedbacks[student.student_id] || '';
      
      // Save to exam_results
      const { error } = await supabase
        .from('exam_results')
        .upsert({
          exam_id: examId,
          student_id: student.student_id,
          marks_obtained: totalMarks,
          grade: grade,
          feedback: feedback.trim() || null
        }, {
          onConflict: 'exam_id,student_id'
        });

      if (error) throw error;

      toast({
        title: "Saved",
        description: "Grading saved successfully"
      });

      fetchExamData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save",
        variant: "destructive"
      });
    } finally {
      setSavingStudent(null);
    }
  };

  const handleSendResult = async (student: StudentSubmission) => {
    if (!examId || !exam) return;
    
    if (!student.has_result) {
      toast({
        title: "Not Saved",
        description: "Please save the grading first before sending",
        variant: "destructive"
      });
      return;
    }

    setSendingStudent(student.student_id);
    try {
      // Try to send email notification (optional - won't block if fails)
      if (student.student_email) {
        try {
          console.log('Sending result notification email...');
          const { data: notifyData, error: notifyError } = await supabase.functions.invoke('send-result-notification', {
            body: {
              student_id: student.student_id,
              student_email: student.student_email,
              student_name: student.student_name,
              exam_title: exam.title,
              subject: exam.subject,
              marks_obtained: student.marks_obtained || 0,
              total_marks: exam.total_marks,
              grade: student.grade || '',
              feedback: student.feedback || undefined
            }
          });

          if (notifyError) {
            console.error('Email notification error:', notifyError);
            toast({
              title: "Result Saved",
              description: "Email nahi gaya - Student apne portal pe result dekh sakta hai",
            });
          } else {
            console.log('Email notification sent:', notifyData);
            toast({
              title: "Success",
              description: "Result sent to student via email"
            });
          }
        } catch (emailError) {
          console.error('Email error:', emailError);
          toast({
            title: "Result Saved",
            description: "Email nahi gaya - Student apne portal pe result dekh sakta hai",
          });
        }
      } else {
        toast({
          title: "Result Saved",
          description: "Student ko email nahi hai - Portal pe dekh sakta hai"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send result",
        variant: "destructive"
      });
    } finally {
      setSendingStudent(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Submissions | {exam?.title || 'Loading'}</title>
        <meta name="description" content="View and grade student submissions" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        {/* Header */}
        <header className="bg-white border-b border-border/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/admin/exams')}
                  className="mr-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <img 
                  src={madrasaLogo} 
                  alt="Madrasa Logo" 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h1 className="font-display font-bold text-primary text-lg">
                    {exam?.title}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {exam?.subject} • Total: {exam?.total_marks} marks
                  </p>
                </div>
              </div>
              
              <Button 
                variant="outline"
                onClick={() => navigate(`/admin/exams/${examId}/results`)}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Results
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {submissions.length === 0 ? (
            <Card className="bg-white border-border/30">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Submissions Yet</h3>
                <p className="text-muted-foreground text-center">
                  No students have completed this exam yet
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {submissions.length} Student(s) Submitted
                </h2>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {submissions.filter(s => s.has_result).length} Graded
                  </Badge>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    {submissions.filter(s => !s.has_result).length} Pending
                  </Badge>
                </div>
              </div>

              {submissions.map((student) => (
                <Card key={student.student_id} className="bg-white border-border/30">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{student.student_name}</h3>
                          <p className="text-xs text-muted-foreground">{student.student_email || 'No email'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {student.has_result ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Saved: {student.marks_obtained}/{exam?.total_marks} ({student.grade})
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                            <Clock className="h-3 w-3 mr-1" />
                            Not Graded
                          </Badge>
                        )}
                        
                        {isAllGraded(student.student_id) && !student.has_result && (
                          <Badge className="bg-primary/10 text-primary">
                            Score: {getStudentTotalMarks(student.student_id)}/{exam?.total_marks}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {student.submitted_at && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Submitted: {format(new Date(student.submitted_at), 'PPP p')}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mt-2">
                      {student.answers.map((answer) => {
                        const gradeStatus = answerGrades[student.student_id]?.[answer.question_id]?.status || 'pending';
                        
                        return (
                          <div 
                            key={answer.question_id} 
                            className={`p-4 rounded-lg border ${
                              gradeStatus === 'correct' 
                                ? 'bg-green-50 border-green-200' 
                                : gradeStatus === 'wrong' 
                                  ? 'bg-red-50 border-red-200' 
                                  : 'bg-muted/30 border-border/50'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <span className="text-sm font-medium text-primary">
                                Q{answer.question_number} ({answer.marks} marks)
                              </span>
                              
                              {/* Correct/Wrong Dropdown */}
                              <Select
                                value={gradeStatus}
                                onValueChange={(value: 'correct' | 'wrong') => 
                                  handleAnswerGrade(student.student_id, answer.question_id, value)
                                }
                              >
                                <SelectTrigger className="w-32 h-8 bg-white">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className="bg-white z-50">
                                  <SelectItem value="correct" className="cursor-pointer">
                                    <span className="flex items-center gap-2 text-green-600">
                                      <Check className="h-4 w-4" /> Correct
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="wrong" className="cursor-pointer">
                                    <span className="flex items-center gap-2 text-red-600">
                                      <X className="h-4 w-4" /> Wrong
                                    </span>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <p className="text-sm text-foreground font-medium mb-2 text-right font-urdu" dir="rtl">
                              {answer.question_text}
                            </p>
                            <div className="bg-white p-3 rounded border border-border/50">
                              <p className="text-sm text-foreground whitespace-pre-wrap">
                                {answer.answer_text || <span className="text-muted-foreground italic">No answer provided</span>}
                              </p>
                            </div>
                            
                            {gradeStatus !== 'pending' && (
                              <div className="mt-2 text-xs font-medium">
                                {gradeStatus === 'correct' ? (
                                  <span className="text-green-600">+{answer.marks} marks</span>
                                ) : (
                                  <span className="text-red-600">0 marks</span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      
                      {/* Feedback Section */}
                      <div className="mt-4 space-y-2">
                        <Label htmlFor={`feedback-${student.student_id}`}>Feedback (Optional)</Label>
                        <Textarea
                          id={`feedback-${student.student_id}`}
                          value={feedbacks[student.student_id] || ''}
                          onChange={(e) => setFeedbacks(prev => ({
                            ...prev,
                            [student.student_id]: e.target.value
                          }))}
                          placeholder="Add feedback for student..."
                          rows={2}
                        />
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                        <div className="text-sm">
                          {isAllGraded(student.student_id) && (
                            <span className="font-semibold">
                              Total: {getStudentTotalMarks(student.student_id)}/{exam?.total_marks} 
                              ({calculateGrade(getStudentTotalMarks(student.student_id), exam?.total_marks || 100)})
                            </span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSaveResult(student)}
                            disabled={!isAllGraded(student.student_id) || savingStudent === student.student_id}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {savingStudent === student.student_id ? 'Saving...' : 'Save'}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSendResult(student)}
                            disabled={!student.has_result || sendingStudent === student.student_id}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            {sendingStudent === student.student_id ? 'Sending...' : 'Send Result'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ExamSubmissions;
