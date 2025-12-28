import React, { useState, useEffect } from 'react';
import { validatePositiveInteger } from '@/lib/validation';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Calendar as CalendarIcon, 
  Users, 
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import { notifyNewExam } from '@/hooks/useSendNotification';
import AdminMobileNav from '@/components/admin/AdminMobileNav';

interface Exam {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  exam_date: string;
  total_marks: number;
  created_at: string;
}

const ExamManagement: React.FC = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState<Date>();
  const [totalMarks, setTotalMarks] = useState('100');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('exam_date', { ascending: false });

      if (error) throw error;
      setExams(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch exams",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !subject.trim() || !examDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('exams')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          subject: subject.trim(),
          exam_date: format(examDate, 'yyyy-MM-dd'),
          total_marks: validatePositiveInteger(totalMarks, 100, 1000),
          created_by: user?.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Exam created successfully"
      });

      // Send push notification to all students
      notifyNewExam(title.trim(), subject.trim(), format(examDate, 'PPP'));

      // Reset form
      setTitle('');
      setDescription('');
      setSubject('');
      setExamDate(undefined);
      setTotalMarks('100');
      setIsCreateOpen(false);
      fetchExams();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create exam",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;

    try {
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', examId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Exam deleted successfully"
      });
      fetchExams();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete exam. You may not have permission.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Exam Management | Idarah Tarjumat-ul-Qur'an</title>
        <meta name="description" content="Create and manage exams for students" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border/50 sticky top-0 z-50">
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <AdminMobileNav />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate('/admin')}
                  className="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <img 
                  src={madrasaLogo} 
                  alt="Madrasa Logo" 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shrink-0"
                />
                <div className="min-w-0">
                  <h1 className="font-display font-bold text-primary text-sm sm:text-lg truncate">
                    Exams
                  </h1>
                  <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Create and manage exams</p>
                </div>
              </div>
              
              <Button 
                size="sm"
                className="bg-primary hover:bg-primary/90 text-xs sm:text-sm shrink-0"
                onClick={() => navigate('/admin/exams/create')}
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Create Exam</span>
              </Button>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Exam</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new exam
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateExam} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Exam Title *</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Quran Recitation Test"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g., Quran, Hadith, Fiqh"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Exam Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !examDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {examDate ? format(examDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={examDate}
                            onSelect={setExamDate}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="totalMarks">Total Marks</Label>
                      <Input
                        id="totalMarks"
                        type="number"
                        value={totalMarks}
                        onChange={(e) => setTotalMarks(e.target.value)}
                        placeholder="100"
                        min="1"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add exam instructions or details..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsCreateOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? 'Creating...' : 'Create Exam'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : exams.length === 0 ? (
            <Card className="bg-card border-border/30">
              <CardContent className="flex flex-col items-center justify-center py-12 px-4">
                <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 text-center">No Exams Yet</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Create your first exam to get started
                </p>
                <Button size="sm" onClick={() => setIsCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Exam
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {exams.map((exam) => (
                <Card key={exam.id} className="bg-card border-border/30 hover:shadow-md transition-shadow">
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] sm:text-xs font-medium rounded">
                            {exam.subject}
                          </span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground">
                            {format(new Date(exam.exam_date), 'PPP')}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-lg font-semibold text-foreground truncate">{exam.title}</h3>
                        {exam.description && (
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">{exam.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs sm:text-sm text-muted-foreground">
                          <span>Marks: {exam.total_marks}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs h-8"
                          onClick={() => navigate(`/admin/exams/${exam.id}/submissions`)}
                        >
                          <Eye className="h-3.5 w-3.5 sm:mr-1.5" />
                          <span className="hidden sm:inline">Submissions</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs h-8"
                          onClick={() => navigate(`/admin/exams/${exam.id}/results`)}
                        >
                          <Users className="h-3.5 w-3.5 sm:mr-1.5" />
                          <span className="hidden sm:inline">Results</span>
                        </Button>
                        {role === 'admin' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs h-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteExam(exam.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
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

export default ExamManagement;
