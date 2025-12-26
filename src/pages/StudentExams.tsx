import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import StudentHeader from '@/components/StudentHeader';
import { 
  FileText, 
  Clock,
  CheckCircle,
  AlertCircle,
  Play
} from 'lucide-react';

interface ExamAssignment {
  id: string;
  exam_id: string;
  status: string;
  start_time: string | null;
  end_time: string | null;
  exam: {
    id: string;
    title: string;
    subject: string;
    exam_date: string;
    total_marks: number;
    duration_minutes: number;
    description: string | null;
  };
}

const StudentExams: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<ExamAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, [user]);

  const fetchAssignments = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('exam_assignments')
        .select(`
          id,
          exam_id,
          status,
          start_time,
          end_time,
          exam:exams (
            id,
            title,
            subject,
            exam_date,
            total_marks,
            duration_minutes,
            description
          )
        `)
        .eq('student_id', user.id)
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to handle the nested exam object
      const typedData = (data || []).map(item => ({
        ...item,
        exam: Array.isArray(item.exam) ? item.exam[0] : item.exam
      })) as ExamAssignment[];
      
      setAssignments(typedData);
    } catch (error: any) {
      console.error('Error fetching assignments:', error);
      toast({
        title: "Error",
        description: "Failed to load exams",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">Completed</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const startExam = (assignment: ExamAssignment) => {
    navigate(`/exams/${assignment.exam_id}/take`);
  };

  return (
    <>
      <Helmet>
        <title>My Exams | Idarah Tarjumat-ul-Qur'an Wa Sunnah</title>
        <meta name="description" content="View and take your assigned exams" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-cream via-white to-emerald-50 dark:from-background dark:via-background dark:to-background">
        <StudentHeader 
          title="My Exams"
          titleKey="myExams"
          subtitle="View and take assigned exams"
          subtitleKey="viewTakeExams"
        />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : assignments.length === 0 ? (
            <Card className="bg-card border-border/30">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {language === 'ur' ? 'کوئی امتحان نہیں' : 
                   language === 'roman' ? 'Koi Imtehan Nahi' : 
                   'No Exams Assigned'}
                </h3>
                <p className="text-muted-foreground text-center">
                  {language === 'ur' ? 'آپ کو ابھی تک کوئی امتحان تفویض نہیں کیا گیا' : 
                   language === 'roman' ? 'Aapko abhi tak koi imtehan tafweez nahi kiya gaya' : 
                   'You have no exams assigned yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {assignments.map((assignment) => (
                <Card 
                  key={assignment.id} 
                  className="bg-card border-border/30 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                            {assignment.exam?.subject}
                          </span>
                          {getStatusBadge(assignment.status)}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {assignment.exam?.title}
                        </h3>
                        {assignment.exam?.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {assignment.exam.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {assignment.exam?.total_marks} marks
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {assignment.exam?.duration_minutes} min
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {assignment.status === 'pending' && (
                          <Button onClick={() => startExam(assignment)}>
                            <Play className="h-4 w-4 mr-2" />
                            {language === 'ur' ? 'امتحان شروع کریں' : 
                             language === 'roman' ? 'Imtehan Shuru Karein' : 
                             'Start Exam'}
                          </Button>
                        )}
                        {assignment.status === 'in_progress' && (
                          <Button onClick={() => startExam(assignment)} variant="secondary">
                            <Play className="h-4 w-4 mr-2" />
                            {language === 'ur' ? 'جاری رکھیں' : 
                             language === 'roman' ? 'Jari Rakhein' : 
                             'Continue'}
                          </Button>
                        )}
                        {assignment.status === 'completed' && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">
                              {language === 'ur' ? 'مکمل' : 
                               language === 'roman' ? 'Mukammal' : 
                               'Completed'}
                            </span>
                          </div>
                        )}
                        {assignment.status === 'expired' && (
                          <div className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            <span className="font-medium">
                              {language === 'ur' ? 'ختم ہو گیا' : 
                               language === 'roman' ? 'Khatam Ho Gaya' : 
                               'Expired'}
                            </span>
                          </div>
                        )}
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

export default StudentExams;
