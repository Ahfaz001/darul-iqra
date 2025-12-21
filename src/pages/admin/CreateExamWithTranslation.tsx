import React, { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Languages,
  Loader2,
  Save,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface TranslatedQuestion {
  question_number: number;
  text_ur: string;
  text_en: string;
  text_roman: string;
  marks: number;
  type: string;
}

interface TranslationResult {
  questions: TranslatedQuestion[];
  exam_title_ur: string;
  exam_title_en: string;
  exam_title_roman: string;
  total_marks: number;
}

interface Student {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
}

const CreateExamWithTranslation: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Step state
  const [step, setStep] = useState<'input' | 'translate' | 'assign'>('input');
  
  // Form state
  const [examContent, setExamContent] = useState('');
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState<Date>();
  const [durationMinutes, setDurationMinutes] = useState('60');
  
  // Translation state
  const [translating, setTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [translationError, setTranslationError] = useState<string | null>(null);
  
  // Assignment state
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (step === 'assign') {
      fetchStudents();
    }
  }, [step]);

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      // Fetch all student profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, email');
      
      if (profilesError) throw profilesError;

      // Fetch student roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'student');
      
      if (rolesError) throw rolesError;
      
      const studentUserIds = new Set(roles?.map(r => r.user_id) || []);
      const studentProfiles = (profiles || []).filter(p => studentUserIds.has(p.user_id));
      
      setStudents(studentProfiles);
    } catch (error: any) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive"
      });
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleTranslate = async () => {
    if (!examContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Please paste the exam content first",
        variant: "destructive"
      });
      return;
    }

    setTranslating(true);
    setTranslationError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('translate-exam', {
        body: { 
          content: examContent,
          targetLanguages: ['en', 'ur', 'roman']
        }
      });

      if (error) throw error;
      
      if (data.error) {
        throw new Error(data.error);
      }

      setTranslationResult(data);
      setStep('translate');
      
      toast({
        title: "Translation Complete",
        description: `Successfully translated ${data.questions?.length || 0} questions`
      });
    } catch (error: any) {
      console.error('Translation error:', error);
      setTranslationError(error.message || 'Translation failed');
      toast({
        title: "Translation Failed",
        description: error.message || "Failed to translate exam content",
        variant: "destructive"
      });
    } finally {
      setTranslating(false);
    }
  };

  const handleSelectAllStudents = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.user_id));
    }
  };

  const toggleStudent = (userId: string) => {
    setSelectedStudents(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSaveExam = async () => {
    if (!translationResult || !examDate || !subject.trim()) {
      toast({
        title: "Validation Error",
        description: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }

    if (selectedStudents.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one student",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      // 1. Create the exam
      const { data: exam, error: examError } = await supabase
        .from('exams')
        .insert({
          title: translationResult.exam_title_ur || subject,
          description: `${translationResult.exam_title_en || ''} | ${translationResult.exam_title_roman || ''}`,
          subject: subject.trim(),
          exam_date: format(examDate, 'yyyy-MM-dd'),
          total_marks: translationResult.total_marks || 100,
          duration_minutes: parseInt(durationMinutes) || 60,
          original_content: examContent,
          is_translated: true,
          created_by: user?.id
        })
        .select()
        .single();

      if (examError) throw examError;

      // 2. Insert questions
      const questionsToInsert = translationResult.questions.map(q => ({
        exam_id: exam.id,
        question_number: q.question_number,
        question_text_ur: q.text_ur,
        question_text_en: q.text_en || '',
        question_text_roman: q.text_roman || '',
        marks: q.marks || 1,
        question_type: q.type || 'text'
      }));

      const { error: questionsError } = await supabase
        .from('exam_questions')
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;

      // 3. Assign to students
      const assignmentsToInsert = selectedStudents.map(studentId => ({
        exam_id: exam.id,
        student_id: studentId,
        status: 'pending'
      }));

      const { error: assignError } = await supabase
        .from('exam_assignments')
        .insert(assignmentsToInsert);

      if (assignError) throw assignError;

      // 4. Send email notifications (fire and forget)
      try {
        console.log('Sending exam notification to students:', selectedStudents);
        const { data: notifyData, error: notifyError } = await supabase.functions.invoke('send-exam-notification', {
          body: {
            student_ids: selectedStudents,
            exam_title: translationResult.exam_title_ur || subject,
            exam_subject: subject.trim(),
            exam_date: format(examDate, 'PPP'),
            duration_minutes: parseInt(durationMinutes) || 60
          }
        });
        
        if (notifyError) {
          console.error('Notification function error:', notifyError);
        } else {
          console.log('Email notifications response:', notifyData);
        }
      } catch (notifyError) {
        console.error('Failed to send notifications:', notifyError);
        // Don't fail the whole operation if notifications fail
      }

      toast({
        title: "Success!",
        description: `Exam created and assigned to ${selectedStudents.length} student(s). Email notifications sent.`
      });

      navigate('/admin/exams');
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save exam",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Exam with Translation | Dar-ul-Ulum</title>
        <meta name="description" content="Create multilingual exams with AI translation" />
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
                    Create Exam with Translation
                  </h1>
                  <p className="text-xs text-muted-foreground">AI-powered multilingual exam creation</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Progress Steps */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4 mb-8">
            {[
              { id: 'input', label: 'Paste Content', icon: Languages },
              { id: 'translate', label: 'Review Translation', icon: CheckCircle },
              { id: 'assign', label: 'Assign Students', icon: Users }
            ].map((s, idx) => (
              <React.Fragment key={s.id}>
                <div 
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                    step === s.id 
                      ? "bg-primary text-primary-foreground" 
                      : step === 'assign' && s.id !== 'assign'
                        ? "bg-green-100 text-green-700"
                        : step === 'translate' && s.id === 'input'
                          ? "bg-green-100 text-green-700"
                          : "bg-muted text-muted-foreground"
                  )}
                >
                  <s.icon className="h-4 w-4" />
                  <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
                </div>
                {idx < 2 && (
                  <div className={cn(
                    "w-8 h-0.5",
                    (step === 'translate' && idx === 0) || step === 'assign'
                      ? "bg-green-400"
                      : "bg-muted"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 pb-8">
          {/* Step 1: Input Content */}
          {step === 'input' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <Card className="bg-white border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-primary" />
                    Paste Exam Content (Urdu)
                  </CardTitle>
                  <CardDescription>
                    Paste your exam paper in Urdu. AI will translate it to English and Roman Urdu.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g., آسان توحید"
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
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="duration"
                        type="number"
                        value={durationMinutes}
                        onChange={(e) => setDurationMinutes(e.target.value)}
                        placeholder="60"
                        className="w-32"
                        min="5"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Exam Content (Urdu) *</Label>
                    <Textarea
                      id="content"
                      value={examContent}
                      onChange={(e) => setExamContent(e.target.value)}
                      placeholder="یہاں پورا امتحانی پرچہ پیسٹ کریں..."
                      className="min-h-[400px] font-urdu text-right"
                      dir="rtl"
                    />
                  </div>

                  {translationError && (
                    <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
                      <AlertCircle className="h-5 w-5" />
                      <p className="text-sm">{translationError}</p>
                    </div>
                  )}

                  <Button 
                    onClick={handleTranslate}
                    disabled={translating || !examContent.trim()}
                    className="w-full"
                    size="lg"
                  >
                    {translating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Translating with AI...
                      </>
                    ) : (
                      <>
                        <Languages className="h-4 w-4 mr-2" />
                        Translate to All Languages
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Review Translation */}
          {step === 'translate' && translationResult && (
            <div className="max-w-6xl mx-auto space-y-6">
              <Card className="bg-white border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Translation Complete
                  </CardTitle>
                  <CardDescription>
                    Review the translated questions below. {translationResult.questions.length} questions found.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Urdu:</span>
                        <p className="text-muted-foreground font-urdu" dir="rtl">{translationResult.exam_title_ur}</p>
                      </div>
                      <div>
                        <span className="font-medium">English:</span>
                        <p className="text-muted-foreground">{translationResult.exam_title_en}</p>
                      </div>
                      <div>
                        <span className="font-medium">Roman Urdu:</span>
                        <p className="text-muted-foreground">{translationResult.exam_title_roman}</p>
                      </div>
                    </div>
                    <p className="text-sm mt-2">
                      <span className="font-medium">Total Marks:</span> {translationResult.total_marks}
                    </p>
                  </div>

                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {translationResult.questions.map((q, idx) => (
                        <Card key={idx} className="border-border/50">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                                Q{q.question_number} • {q.marks} marks
                              </span>
                              <span className="text-xs text-muted-foreground capitalize">{q.type}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                              <div className="p-3 bg-muted/30 rounded-lg">
                                <p className="text-xs font-medium text-muted-foreground mb-1">اردو</p>
                                <p className="text-sm font-urdu" dir="rtl">{q.text_ur}</p>
                              </div>
                              <div className="p-3 bg-muted/30 rounded-lg">
                                <p className="text-xs font-medium text-muted-foreground mb-1">English</p>
                                <p className="text-sm">{q.text_en}</p>
                              </div>
                              <div className="p-3 bg-muted/30 rounded-lg">
                                <p className="text-xs font-medium text-muted-foreground mb-1">Roman Urdu</p>
                                <p className="text-sm">{q.text_roman}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setStep('input')}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Edit
                    </Button>
                    <Button onClick={() => setStep('assign')} className="flex-1">
                      Continue to Assign Students
                      <Users className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Assign Students */}
          {step === 'assign' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <Card className="bg-white border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Assign to Students
                  </CardTitle>
                  <CardDescription>
                    Select which students should receive this exam
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingStudents ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : students.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No students found</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="selectAll"
                            checked={selectedStudents.length === students.length}
                            onCheckedChange={handleSelectAllStudents}
                          />
                          <Label htmlFor="selectAll" className="font-medium cursor-pointer">
                            Select All ({students.length} students)
                          </Label>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {selectedStudents.length} selected
                        </span>
                      </div>

                      <ScrollArea className="h-[400px]">
                        <div className="space-y-2">
                          {students.map((student) => (
                            <div 
                              key={student.user_id}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer",
                                selectedStudents.includes(student.user_id)
                                  ? "bg-primary/10 border border-primary/20"
                                  : "bg-muted/30 hover:bg-muted/50"
                              )}
                              onClick={() => toggleStudent(student.user_id)}
                            >
                              <Checkbox
                                checked={selectedStudents.includes(student.user_id)}
                                onCheckedChange={() => toggleStudent(student.user_id)}
                              />
                              <div className="flex-1">
                                <p className="font-medium text-foreground">{student.full_name}</p>
                                <p className="text-sm text-muted-foreground">{student.email}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </>
                  )}

                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setStep('translate')}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleSaveExam} 
                      disabled={saving || selectedStudents.length === 0}
                      className="flex-1"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Create Exam & Assign
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default CreateExamWithTranslation;
