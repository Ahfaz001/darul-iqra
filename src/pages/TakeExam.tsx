import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import { 
  Clock,
  Save,
  Send,
  AlertTriangle,
  CheckCircle,
  Languages,
  Loader2,
  ArrowLeft
} from 'lucide-react';

interface ExamQuestion {
  id: string;
  question_number: number;
  question_text_ur: string;
  question_text_en: string | null;
  question_text_roman: string | null;
  marks: number;
  question_type: string;
}

interface Exam {
  id: string;
  title: string;
  subject: string;
  total_marks: number;
  duration_minutes: number;
  description: string | null;
}

interface Answer {
  question_id: string;
  answer_text: string;
}

const TakeExam: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const { user } = useAuth();
  const { language: appLanguage } = useLanguage();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [examLanguage, setExamLanguage] = useState<'ur' | 'en' | 'roman'>('ur');
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (examId && user) {
      initializeExam();
    }
  }, [examId, user]);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  const initializeExam = async () => {
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
        .order('question_number', { ascending: true });

      if (questionsError) throw questionsError;
      setQuestions(questionsData || []);

      // Fetch or create assignment
      const { data: assignment, error: assignmentError } = await supabase
        .from('exam_assignments')
        .select('*')
        .eq('exam_id', examId)
        .eq('student_id', user?.id)
        .single();

      if (assignmentError) {
        toast({
          title: "Error",
          description: "You are not assigned to this exam",
          variant: "destructive"
        });
        navigate('/exams');
        return;
      }

      // Check if already completed
      if (assignment.status === 'completed') {
        toast({
          title: "Exam Completed",
          description: "You have already completed this exam",
        });
        navigate('/exams');
        return;
      }

      // Load existing answers
      const { data: existingAnswers } = await supabase
        .from('exam_submissions')
        .select('question_id, answer_text')
        .eq('exam_id', examId)
        .eq('student_id', user?.id);

      if (existingAnswers) {
        const answersMap: Record<string, string> = {};
        existingAnswers.forEach(a => {
          answersMap[a.question_id] = a.answer_text || '';
        });
        setAnswers(answersMap);
      }

      // Start or continue timer
      if (assignment.start_time) {
        const start = new Date(assignment.start_time);
        const elapsed = Math.floor((Date.now() - start.getTime()) / 1000);
        const duration = (examData.duration_minutes || 60) * 60;
        const remaining = Math.max(0, duration - elapsed);
        
        if (remaining <= 0) {
          handleAutoSubmit();
          return;
        }
        
        setStartTime(start);
        setTimeRemaining(remaining);
        setTimerActive(true);
      } else {
        // Start exam now
        const now = new Date();
        await supabase
          .from('exam_assignments')
          .update({ 
            start_time: now.toISOString(),
            status: 'in_progress'
          })
          .eq('id', assignment.id);

        setStartTime(now);
        setTimeRemaining((examData.duration_minutes || 60) * 60);
        setTimerActive(true);
      }

    } catch (error: any) {
      console.error('Error initializing exam:', error);
      toast({
        title: "Error",
        description: "Failed to load exam",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const saveAnswer = async (questionId: string) => {
    if (!user || !examId) return;

    try {
      await supabase
        .from('exam_submissions')
        .upsert({
          exam_id: examId,
          student_id: user.id,
          question_id: questionId,
          answer_text: answers[questionId] || ''
        }, {
          onConflict: 'exam_id,student_id,question_id'
        });
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };

  const handleAutoSubmit = useCallback(async () => {
    toast({
      title: "Time's Up!",
      description: "Your exam is being submitted automatically",
    });
    await submitExam(true);
  }, [answers]);

  const submitExam = async (isAuto: boolean = false) => {
    if (!user || !examId) return;

    setSubmitting(true);
    try {
      // Save all answers
      const submissions = questions.map(q => ({
        exam_id: examId,
        student_id: user.id,
        question_id: q.id,
        answer_text: answers[q.id] || ''
      }));

      await supabase
        .from('exam_submissions')
        .upsert(submissions, {
          onConflict: 'exam_id,student_id,question_id'
        });

      // Update assignment status
      await supabase
        .from('exam_assignments')
        .update({ 
          status: 'completed',
          end_time: new Date().toISOString()
        })
        .eq('exam_id', examId)
        .eq('student_id', user.id);

      setTimerActive(false);

      toast({
        title: "Exam Submitted!",
        description: isAuto ? "Your exam was auto-submitted due to time limit" : "Your answers have been submitted successfully",
      });

      navigate('/exams');
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: "Failed to submit exam. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionText = (q: ExamQuestion) => {
    switch (examLanguage) {
      case 'en':
        return q.question_text_en || q.question_text_ur;
      case 'roman':
        return q.question_text_roman || q.question_text_ur;
      default:
        return q.question_text_ur;
    }
  };

  const answeredCount = Object.values(answers).filter(a => a.trim()).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{exam?.title || 'Exam'} | Idarah Tarjumat-ul-Qur'an Wa Sunnah</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Fixed Header */}
        <header className="bg-card border-b border-border/50 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    const state = window.history.state as any;
                    const idx = typeof state?.idx === 'number' ? state.idx : 0;
                    if (idx > 0) {
                      navigate(-1);
                    } else {
                      navigate('/exams', { replace: true });
                    }
                  }}
                  className="mr-1 text-foreground"
                  aria-label="Back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <img 
                  src={madrasaLogo} 
                  alt="Logo" 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h1 className="font-display font-bold text-primary text-sm sm:text-base line-clamp-1">
                    {exam?.title}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {exam?.subject} • {exam?.total_marks} marks
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Language Selector */}
                <Select value={examLanguage} onValueChange={(v) => setExamLanguage(v as 'ur' | 'en' | 'roman')}>
                  <SelectTrigger className="w-[120px] h-9">
                    <Languages className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ur">اردو</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="roman">Roman</SelectItem>
                  </SelectContent>
                </Select>

                {/* Timer */}
                <div className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-sm font-bold",
                  timeRemaining < 300 
                    ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400 animate-pulse" 
                    : timeRemaining < 600
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400"
                      : "bg-primary/10 text-primary"
                )}>
                  <Clock className="h-4 w-4" />
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>{answeredCount} of {questions.length} answered</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </header>

        {/* Questions */}
        <main className="container mx-auto px-4 py-6 pb-32">
          <ScrollArea className="h-full">
            <div className="max-w-3xl mx-auto space-y-6">
              {questions.map((q, idx) => (
                <Card 
                  key={q.id} 
                  className={cn(
                    "bg-card border-border/30 transition-all",
                    answers[q.id]?.trim() && "border-l-4 border-l-green-500"
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                          answers[q.id]?.trim() 
                            ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400"
                            : "bg-primary/10 text-primary"
                        )}>
                          {q.question_number}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {q.marks} {q.marks > 1 ? 'marks' : 'mark'}
                        </span>
                      </div>
                      {answers[q.id]?.trim() && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={cn(
                      "p-4 bg-muted/30 rounded-lg",
                      examLanguage === 'ur' && "text-right font-urdu"
                    )} dir={examLanguage === 'ur' ? 'rtl' : 'ltr'}>
                      <p className="text-foreground whitespace-pre-wrap">
                        {getQuestionText(q)}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`answer-${q.id}`} className="text-sm">
                        {examLanguage === 'ur' ? 'جواب:' : 
                         examLanguage === 'roman' ? 'Jawab:' : 
                         'Your Answer:'}
                      </Label>
                      <Textarea
                        id={`answer-${q.id}`}
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        onBlur={() => saveAnswer(q.id)}
                        placeholder={
                          examLanguage === 'ur' ? 'یہاں اپنا جواب لکھیں...' : 
                          examLanguage === 'roman' ? 'Yahan apna jawab likhein...' : 
                          'Write your answer here...'
                        }
                        className={cn(
                          "min-h-[120px] resize-y",
                          examLanguage === 'ur' && "text-right font-urdu"
                        )}
                        dir={examLanguage === 'ur' ? 'rtl' : 'ltr'}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </main>

        {/* Fixed Submit Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 shadow-lg z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <div className="text-sm">
                {timeRemaining < 300 && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">
                      {examLanguage === 'ur' ? 'وقت ختم ہونے والا ہے!' : 
                       examLanguage === 'roman' ? 'Waqt khatam hone wala hai!' : 
                       'Time is running out!'}
                    </span>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={() => submitExam(false)}
                disabled={submitting}
                size="lg"
                className="min-w-[150px]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {examLanguage === 'ur' ? 'جمع ہو رہا ہے...' : 
                     examLanguage === 'roman' ? 'Jama ho raha hai...' : 
                     'Submitting...'}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {examLanguage === 'ur' ? 'جمع کرائیں' : 
                     examLanguage === 'roman' ? 'Jama Karayein' : 
                     'Submit Exam'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TakeExam;
