import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import StudentHeader from '@/components/StudentHeader';
import { 
  User, 
  Save, 
  Calendar, 
  FileText, 
  TrendingUp,
  Check,
  X,
  Clock,
  LogOut,
  Loader2
} from 'lucide-react';

interface Profile {
  full_name: string;
  email: string | null;
  language_preference: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface ExamResult {
  id: string;
  marks_obtained: number;
  grade: string | null;
  exam: {
    title: string;
    subject: string;
    total_marks: number;
    exam_date: string;
  };
}

interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
}

const StudentProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (profileError) throw profileError;
      
      if (profileData) {
        setProfile(profileData);
        setFullName(profileData.full_name);
        setLanguage(profileData.language_preference || 'en');
      }

      // Fetch exam results
      const { data: resultsData, error: resultsError } = await supabase
        .from('exam_results')
        .select(`
          id,
          marks_obtained,
          grade,
          exam:exams(title, subject, total_marks, exam_date)
        `)
        .eq('student_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!resultsError && resultsData) {
        setExamResults(resultsData as unknown as ExamResult[]);
      }

      // Fetch recent attendance
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('id, date, status')
        .eq('student_id', user?.id)
        .order('date', { ascending: false })
        .limit(30);

      if (!attendanceError && attendanceData) {
        setAttendance(attendanceData);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      toast({
        title: "Validation Error",
        description: "Name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          language_preference: language
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      
      fetchProfileData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Success",
        description: "Logged out successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive"
      });
    } finally {
      setLoggingOut(false);
    }
  };

  // Calculate attendance stats
  const attendanceStats = {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    late: attendance.filter(a => a.status === 'late').length,
    percentage: attendance.length > 0 
      ? Math.round((attendance.filter(a => a.status === 'present' || a.status === 'late').length / attendance.length) * 100)
      : 0
  };

  // Calculate exam stats
  const examStats = {
    total: examResults.length,
    avgScore: examResults.length > 0
      ? Math.round(examResults.reduce((sum, r) => sum + (r.marks_obtained / r.exam.total_marks) * 100, 0) / examResults.length)
      : 0
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
        <title>My Profile | Dar-ul-Ulum</title>
        <meta name="description" content="View and update your profile information" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-background dark:via-background dark:to-background">
        <StudentHeader 
          title="My Profile"
          titleKey="myProfile"
          subtitle="Manage your account settings"
          subtitleKey="manageAccount"
        />

        <main className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Form */}
            <div className="lg:col-span-1">
              <Card className="bg-white border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your profile details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="flex justify-center mb-4">
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-12 w-12 text-primary" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Language Preference</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ur">اردو (Urdu)</SelectItem>
                          <SelectItem value="ar">العربية (Arabic)</SelectItem>
                          <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Member Since</Label>
                      <p className="text-sm text-muted-foreground">
                        {profile?.created_at 
                          ? format(new Date(profile.created_at), 'MMMM d, yyyy')
                          : '-'
                        }
                      </p>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Progress Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Overview */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="bg-white border-border/30">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Attendance Rate</p>
                        <p className="text-3xl font-bold text-foreground mt-1">{attendanceStats.percentage}%</p>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <span className="flex items-center gap-1 text-green-600">
                            <Check className="h-3 w-3" /> {attendanceStats.present} present
                          </span>
                          <span className="flex items-center gap-1 text-red-600">
                            <X className="h-3 w-3" /> {attendanceStats.absent} absent
                          </span>
                        </div>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-border/30">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Average Score</p>
                        <p className="text-3xl font-bold text-foreground mt-1">{examStats.avgScore}%</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Based on {examStats.total} exam(s)
                        </p>
                      </div>
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Exam Results */}
              <Card className="bg-white border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Exam Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {examResults.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No exam results yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {examResults.map((result) => (
                        <div 
                          key={result.id} 
                          className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{result.exam.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {result.exam.subject} • {format(new Date(result.exam.exam_date), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              {result.marks_obtained}/{result.exam.total_marks}
                            </p>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              result.grade === 'A+' || result.grade === 'A' 
                                ? 'bg-green-100 text-green-700'
                                : result.grade === 'B' 
                                  ? 'bg-blue-100 text-blue-700'
                                  : result.grade === 'C' || result.grade === 'D'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                            }`}>
                              Grade: {result.grade || '-'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Attendance */}
              <Card className="bg-white border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Attendance (Last 30 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {attendance.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No attendance records yet
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {attendance.slice(0, 30).map((record) => (
                        <div
                          key={record.id}
                          className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium ${
                            record.status === 'present' 
                              ? 'bg-green-100 text-green-700'
                              : record.status === 'absent'
                                ? 'bg-red-100 text-red-700'
                                : record.status === 'late'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-blue-100 text-blue-700'
                          }`}
                          title={`${format(new Date(record.date), 'MMM d')}: ${record.status}`}
                        >
                          {record.status === 'present' && <Check className="h-4 w-4" />}
                          {record.status === 'absent' && <X className="h-4 w-4" />}
                          {record.status === 'late' && <Clock className="h-4 w-4" />}
                          {record.status === 'excused' && 'E'}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-4 text-xs">
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-100 rounded"></div> Present
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-100 rounded"></div> Absent
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-100 rounded"></div> Late
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-100 rounded"></div> Excused
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Logout Section */}
              <Card className="bg-white border-destructive/30 dark:bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <LogOut className="h-5 w-5" />
                    Logout
                  </CardTitle>
                  <CardDescription>
                    Sign out of your student account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    This will sign you out of your account. You will need to login again to access the student portal.
                  </p>
                  <Button 
                    variant="destructive"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4 mr-2" />
                    )}
                    {loggingOut ? 'Logging out...' : 'Logout'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default StudentProfile;
