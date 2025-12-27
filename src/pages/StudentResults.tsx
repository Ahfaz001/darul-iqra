import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import StudentLayout from '@/components/StudentLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  Trophy, 
  FileText,
  Award,
  Eye,
  Check,
  X
} from 'lucide-react';

interface ExamResult {
  id: string;
  exam_id: string;
  marks_obtained: number;
  grade: string | null;
  feedback: string | null;
  created_at: string;
  exam: {
    id: string;
    title: string;
    subject: string;
    exam_date: string;
    total_marks: number;
  };
}

interface DetailedAnswer {
  question_id: string;
  question_number: number;
  question_text: string;
  answer_text: string | null;
  marks: number;
  answer_status: string;
  marks_awarded: number;
}

const StudentResults: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Detail view state
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const [detailedAnswers, setDetailedAnswers] = useState<DetailedAnswer[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchResults();
    }
  }, [user]);

  const fetchResults = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select(`
          id,
          exam_id,
          marks_obtained,
          grade,
          feedback,
          created_at,
          exam:exams (
            id,
            title,
            subject,
            exam_date,
            total_marks
          )
        `)
        .eq('student_id', user.id)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedData = (data || []).map(item => ({
        ...item,
        exam: Array.isArray(item.exam) ? item.exam[0] : item.exam
      })) as ExamResult[];
      
      setResults(typedData);
    } catch (error: any) {
      console.error('Error fetching results:', error);
      toast({
        title: "Error",
        description: "Failed to load results",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedResults = async (result: ExamResult) => {
    if (!user) return;
    
    setLoadingDetails(true);
    setSelectedResult(result);
    setIsDetailOpen(true);
    
    try {
      // Fetch questions
      const { data: questions, error: questionsError } = await supabase
        .from('exam_questions')
        .select('id, question_number, question_text_ur, marks')
        .eq('exam_id', result.exam_id)
        .order('question_number');

      if (questionsError) throw questionsError;

      // Fetch submissions with grading
      const { data: submissions, error: submissionsError } = await supabase
        .from('exam_submissions')
        .select('question_id, answer_text, answer_status, marks_awarded')
        .eq('exam_id', result.exam_id)
        .eq('student_id', user.id);

      if (submissionsError) throw submissionsError;

      // Build detailed answers
      const detailed: DetailedAnswer[] = (questions || []).map(q => {
        const submission = submissions?.find(s => s.question_id === q.id);
        return {
          question_id: q.id,
          question_number: q.question_number,
          question_text: q.question_text_ur,
          answer_text: submission?.answer_text || null,
          marks: q.marks,
          answer_status: submission?.answer_status || 'pending',
          marks_awarded: submission?.marks_awarded || 0
        };
      });

      setDetailedAnswers(detailed);
    } catch (error: any) {
      console.error('Error fetching details:', error);
      toast({
        title: "Error",
        description: "Failed to load details",
        variant: "destructive"
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const getGradeColor = (grade: string | null) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'B':
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'C':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'D':
        return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800';
      case 'F':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
    }
  };

  const getPercentage = (marks: number, total: number) => {
    return Math.round((marks / total) * 100);
  };

  return (
    <StudentLayout>
      <Helmet>
        <title>My Results | Idarah Tarjumat-ul-Qur'an Wa Sunnah</title>
        <meta name="description" content="View your exam results and grades" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-accent py-6 px-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-1 text-primary-foreground">🏆 My Results</h1>
            <p className="text-primary-foreground/80">View your exam results and grades</p>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : results.length === 0 ? (
            <Card className="bg-card border-border/30">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {language === 'ur' ? 'ابھی تک کوئی نتیجہ نہیں' : 
                   language === 'roman' ? 'Abhi Tak Koi Natija Nahi' : 
                   'No Results Yet'}
                </h3>
                <p className="text-muted-foreground text-center">
                  {language === 'ur' ? 'جب آپ کے امتحانات کی جانچ ہو جائے گی تو نتائج یہاں نظر آئیں گے' : 
                   language === 'roman' ? 'Jab aapke imtehanaat ki jaanch ho jayegi to nataij yahan nazar aayenge' : 
                   'Results will appear here once your exams are checked'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Summary Card */}
              <Card className="bg-gradient-to-r from-primary/5 to-emerald-500/10 dark:from-primary/10 dark:to-emerald-500/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Award className="h-5 w-5 text-primary" />
                    {language === 'ur' ? 'نتائج کا خلاصہ' : 
                     language === 'roman' ? 'Nataij ka Khulasa' : 
                     'Results Summary'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-card rounded-lg">
                      <p className="text-2xl font-bold text-primary">{results.length}</p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'ur' ? 'کل امتحانات' : 'Total Exams'}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-card rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {results.filter(r => r.grade === 'A+' || r.grade === 'A').length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'ur' ? 'A گریڈز' : 'A Grades'}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-card rounded-lg">
                      <p className="text-2xl font-bold text-gold">
                        {results.length > 0 
                          ? Math.round(results.reduce((acc, r) => acc + getPercentage(r.marks_obtained, r.exam?.total_marks || 100), 0) / results.length)
                          : 0}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'ur' ? 'اوسط' : 'Average'}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-card rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {results.length > 0 
                          ? Math.max(...results.map(r => getPercentage(r.marks_obtained, r.exam?.total_marks || 100)))
                          : 0}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'ur' ? 'بہترین' : 'Best Score'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results List */}
              {results.map((result) => (
                <Card 
                  key={result.id} 
                  className="bg-card border-border/30 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                            {result.exam?.subject}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {result.exam?.exam_date && format(new Date(result.exam.exam_date), 'PPP')}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {result.exam?.title}
                        </h3>
                        {result.feedback && (
                          <p className="text-sm text-muted-foreground mt-2 italic">
                            "{result.feedback}"
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">
                            {result.marks_obtained}
                            <span className="text-sm text-muted-foreground font-normal">
                              /{result.exam?.total_marks}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getPercentage(result.marks_obtained, result.exam?.total_marks || 100)}%
                          </p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-lg px-4 py-2 font-bold ${getGradeColor(result.grade)}`}
                        >
                          {result.grade || '-'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchDetailedResults(result)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {language === 'ur' ? 'تفصیل' : 'Details'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>

        {/* Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {selectedResult?.exam?.title}
              </DialogTitle>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {selectedResult?.exam?.subject}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={getGradeColor(selectedResult?.grade || null)}
                >
                  Grade: {selectedResult?.grade}
                </Badge>
                <span className="text-sm font-semibold">
                  {selectedResult?.marks_obtained}/{selectedResult?.exam?.total_marks} marks
                </span>
              </div>
            </DialogHeader>

            {loadingDetails ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                {detailedAnswers.map((answer) => (
                  <div 
                    key={answer.question_id}
                    className={`p-4 rounded-lg border ${
                      answer.answer_status === 'correct' 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                        : answer.answer_status === 'wrong' 
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                          : 'bg-muted/30 border-border/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-primary">
                        Q{answer.question_number} ({answer.marks} marks)
                      </span>
                      <div className="flex items-center gap-2">
                        {answer.answer_status === 'correct' ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <Check className="h-3 w-3 mr-1" />
                            Correct (+{answer.marks_awarded})
                          </Badge>
                        ) : answer.answer_status === 'wrong' ? (
                          <Badge className="bg-red-100 text-red-700 border-red-200">
                            <X className="h-3 w-3 mr-1" />
                            Wrong (0)
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-foreground font-medium mb-2 text-right font-urdu" dir="rtl">
                      {answer.question_text}
                    </p>
                    
                    <div className="bg-card p-3 rounded border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">
                        {language === 'ur' ? 'آپ کا جواب:' : 'Your Answer:'}
                      </p>
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {answer.answer_text || <span className="text-muted-foreground italic">No answer provided</span>}
                      </p>
                    </div>
                  </div>
                ))}

                {selectedResult?.feedback && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg dark:bg-amber-900/20 dark:border-amber-900/30">
                    <p className="text-sm font-medium text-amber-800 mb-1">
                      {language === 'ur' ? 'استاد کی رائے:' : "Teacher's Feedback:"}
                    </p>
                    <p className="text-sm text-amber-700">{selectedResult.feedback}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </StudentLayout>
  );
};

export default StudentResults;
