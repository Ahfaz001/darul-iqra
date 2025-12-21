import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import { ArrowLeft, User, FileText, CheckCircle, Clock, Save, Eye } from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  subject: string;
  exam_date: string;
  total_marks: number;
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
  }[];
  has_result: boolean;
  marks_obtained?: number;
  grade?: string;
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
  
  // Grading dialog state
  const [gradingStudent, setGradingStudent] = useState<StudentSubmission | null>(null);
  const [isGradingOpen, setIsGradingOpen] = useState(false);
  const [marksObtained, setMarksObtained] = useState('');
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

      // Fetch profiles for these students
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

      // Fetch all submissions
      const { data: allSubmissions, error: submissionsError } = await supabase
        .from('exam_submissions')
        .select('student_id, question_id, answer_text, submitted_at')
        .eq('exam_id', examId)
        .in('student_id', studentIds);

      if (submissionsError) throw submissionsError;

      // Fetch existing results
      const { data: existingResults, error: resultsError } = await supabase
        .from('exam_results')
        .select('student_id, marks_obtained, grade')
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
            marks: q.marks
          };
        }) || [];

        return {
          student_id: assignment.student_id,
          student_name: profile?.full_name || 'Unknown Student',
          student_email: profile?.email || null,
          status: assignment.status,
          submitted_at: assignment.end_time,
          answers,
          has_result: !!existingResult,
          marks_obtained: existingResult?.marks_obtained,
          grade: existingResult?.grade || undefined
        };
      }) || [];

      setSubmissions(studentSubmissions);
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

  const openGradingDialog = (student: StudentSubmission) => {
    setGradingStudent(student);
    setMarksObtained(student.marks_obtained?.toString() || '');
    setGrade(student.grade || '');
    setFeedback('');
    setIsGradingOpen(true);
  };

  const handleSaveResult = async () => {
    if (!gradingStudent || !marksObtained || !examId) {
      toast({
        title: "Validation Error",
        description: "Please enter marks",
        variant: "destructive"
      });
      return;
    }

    const marks = parseInt(marksObtained);
    if (isNaN(marks) || marks < 0 || (exam && marks > exam.total_marks)) {
      toast({
        title: "Validation Error",
        description: `Marks must be between 0 and ${exam?.total_marks}`,
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const calculatedGrade = grade || (exam ? calculateGrade(marks, exam.total_marks) : '');
      
      const { error } = await supabase
        .from('exam_results')
        .upsert({
          exam_id: examId,
          student_id: gradingStudent.student_id,
          marks_obtained: marks,
          grade: calculatedGrade,
          feedback: feedback.trim() || null
        }, {
          onConflict: 'exam_id,student_id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Result saved successfully"
      });

      setIsGradingOpen(false);
      setGradingStudent(null);
      fetchExamData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save result",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
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
                    {exam?.subject} • Student Submissions
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
            <div className="space-y-4">
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
                            Graded: {student.marks_obtained}/{exam?.total_marks} ({student.grade})
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                            <Clock className="h-3 w-3 mr-1" />
                            Needs Grading
                          </Badge>
                        )}
                        <Button 
                          size="sm"
                          onClick={() => openGradingDialog(student)}
                        >
                          {student.has_result ? 'Edit Grade' : 'Grade Now'}
                        </Button>
                      </div>
                    </div>
                    {student.submitted_at && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Submitted: {format(new Date(student.submitted_at), 'PPP p')}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mt-2">
                      {student.answers.map((answer) => (
                        <div 
                          key={answer.question_id} 
                          className="p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-medium text-primary">
                              Q{answer.question_number} ({answer.marks} marks)
                            </span>
                          </div>
                          <p className="text-sm text-foreground font-medium mb-2 text-right font-urdu" dir="rtl">
                            {answer.question_text}
                          </p>
                          <div className="bg-white p-2 rounded border border-border/50">
                            <p className="text-sm text-foreground whitespace-pre-wrap">
                              {answer.answer_text || <span className="text-muted-foreground italic">No answer provided</span>}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>

        {/* Grading Dialog */}
        <Dialog open={isGradingOpen} onOpenChange={setIsGradingOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Grade Submission</DialogTitle>
              <DialogDescription>
                {gradingStudent?.student_name} - Total Marks: {exam?.total_marks}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marks">Marks Obtained *</Label>
                  <Input
                    id="marks"
                    type="number"
                    value={marksObtained}
                    onChange={(e) => setMarksObtained(e.target.value)}
                    placeholder={`0 - ${exam?.total_marks}`}
                    min="0"
                    max={exam?.total_marks}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade (Auto-calculated)</Label>
                  <Input
                    id="grade"
                    value={grade || (marksObtained && exam ? calculateGrade(parseInt(marksObtained) || 0, exam.total_marks) : '')}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="A, B, C..."
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback (Optional)</Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Add comments or feedback..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsGradingOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveResult} disabled={submitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {submitting ? 'Saving...' : 'Save Result'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ExamSubmissions;
