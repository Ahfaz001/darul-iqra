import React, { useState, useEffect } from 'react';
import { safeParseInt } from '@/lib/validation';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import { ArrowLeft, Plus, Save, User } from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  subject: string;
  exam_date: string;
  total_marks: number;
}

interface ExamResult {
  id: string;
  exam_id: string;
  student_id: string;
  marks_obtained: number;
  grade: string | null;
  feedback: string | null;
  student_profile?: {
    full_name: string;
    email: string | null;
  };
}

interface Student {
  user_id: string;
  full_name: string;
  email: string | null;
}

const ExamResults: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { role } = useAuth();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [selectedStudent, setSelectedStudent] = useState('');
  const [marksObtained, setMarksObtained] = useState('');
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (examId) {
      fetchExamAndResults();
      fetchStudents();
    }
  }, [examId]);

  const fetchExamAndResults = async () => {
    try {
      // Fetch exam details
      const { data: examData, error: examError } = await supabase
        .from('exams')
        .select('*')
        .eq('id', examId)
        .maybeSingle();

      if (examError) throw examError;
      if (!examData) {
        toast({
          title: "Error",
          description: "Exam not found",
          variant: "destructive"
        });
        navigate('/admin/exams');
        return;
      }
      setExam(examData);

      // Fetch results
      const { data: resultsData, error: resultsError } = await supabase
        .from('exam_results')
        .select('*')
        .eq('exam_id', examId);

      if (resultsError) throw resultsError;
      setResults(resultsData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch exam data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      // Get all users with student role
      const { data: studentRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'student');

      if (rolesError) throw rolesError;

      const studentIds = studentRoles?.map(r => r.user_id) || [];
      
      if (studentIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, full_name, email')
          .in('user_id', studentIds);

        if (profilesError) throw profilesError;
        setStudents(profiles || []);
      }
    } catch (error: any) {
      console.error('Error fetching students:', error);
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

  const handleAddResult = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !marksObtained) {
      toast({
        title: "Validation Error",
        description: "Please select a student and enter marks",
        variant: "destructive"
      });
      return;
    }

    const marks = safeParseInt(marksObtained, -1);
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
          student_id: selectedStudent,
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

      // Reset form
      setSelectedStudent('');
      setMarksObtained('');
      setGrade('');
      setFeedback('');
      setIsAddOpen(false);
      fetchExamAndResults();
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

  // Filter out students who already have results
  const availableStudents = students.filter(
    s => !results.some(r => r.student_id === s.user_id)
  );

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
        <title>Exam Results | {exam?.title || 'Loading'}</title>
        <meta name="description" content="View and manage exam results" />
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
                    {exam?.subject} • {exam && format(new Date(exam.exam_date), 'PPP')}
                  </p>
                </div>
              </div>
              
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Result
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add Student Result</DialogTitle>
                    <DialogDescription>
                      Enter marks for a student (Total: {exam?.total_marks})
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddResult} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Select Student *</Label>
                      <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a student" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableStudents.length === 0 ? (
                            <SelectItem value="none" disabled>No students available</SelectItem>
                          ) : (
                            availableStudents.map((student) => (
                              <SelectItem key={student.user_id} value={student.user_id}>
                                {student.full_name} {student.email && `(${student.email})`}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
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
                          value={grade || (marksObtained && exam ? calculateGrade(safeParseInt(marksObtained, 0), exam.total_marks) : '')}
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
                        onClick={() => setIsAddOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={submitting || availableStudents.length === 0}>
                        <Save className="h-4 w-4 mr-2" />
                        {submitting ? 'Saving...' : 'Save Result'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Card className="bg-white border-border/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Results ({results.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No results added yet</p>
                  <Button onClick={() => setIsAddOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Result
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-center">Marks</TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                        <TableHead>Feedback</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((result) => {
                        const studentProfile = result.student_profile || 
                          students.find(s => s.user_id === result.student_id);
                        
                        return (
                          <TableRow key={result.id}>
                            <TableCell className="font-medium">
                              {studentProfile?.full_name || 'Unknown Student'}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {studentProfile?.email || '-'}
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="font-semibold">{result.marks_obtained}</span>
                              <span className="text-muted-foreground">/{exam?.total_marks}</span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                result.grade === 'A+' || result.grade === 'A' 
                                  ? 'bg-green-100 text-green-700'
                                  : result.grade === 'B' 
                                    ? 'bg-blue-100 text-blue-700'
                                    : result.grade === 'C' || result.grade === 'D'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-red-100 text-red-700'
                              }`}>
                                {result.grade || '-'}
                              </span>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {result.feedback || '-'}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default ExamResults;
