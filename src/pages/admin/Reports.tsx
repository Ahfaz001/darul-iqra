import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import { ArrowLeft, BarChart3, TrendingUp, Users, Calendar, FileText, Download } from 'lucide-react';

interface ReportStats {
  avgAttendance: number;
  avgExamScore: number;
  activeStudents: number;
  examsConducted: number;
  attendanceChange: number;
  scoreChange: number;
  newStudents: number;
}

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<ReportStats>({
    avgAttendance: 0,
    avgExamScore: 0,
    activeStudents: 0,
    examsConducted: 0,
    attendanceChange: 0,
    scoreChange: 0,
    newStudents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportStats();
  }, []);

  const fetchReportStats = async () => {
    try {
      // Get current month boundaries
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Fetch student count
      const { data: students } = await supabase
        .from('user_roles')
        .select('id, created_at')
        .eq('role', 'student');

      const activeStudents = students?.length || 0;
      const newStudents = students?.filter(s => 
        new Date(s.created_at) >= thisMonthStart
      ).length || 0;

      // Fetch this month's attendance
      const { data: thisMonthAttendance } = await supabase
        .from('attendance')
        .select('status')
        .gte('date', thisMonthStart.toISOString().split('T')[0]);

      const thisMonthTotal = thisMonthAttendance?.length || 0;
      const thisMonthPresent = thisMonthAttendance?.filter(a => 
        a.status === 'present' || a.status === 'late'
      ).length || 0;
      const avgAttendance = thisMonthTotal > 0 
        ? Math.round((thisMonthPresent / thisMonthTotal) * 100) 
        : 0;

      // Fetch last month's attendance for comparison
      const { data: lastMonthAttendance } = await supabase
        .from('attendance')
        .select('status')
        .gte('date', lastMonthStart.toISOString().split('T')[0])
        .lte('date', lastMonthEnd.toISOString().split('T')[0]);

      const lastMonthTotal = lastMonthAttendance?.length || 0;
      const lastMonthPresent = lastMonthAttendance?.filter(a => 
        a.status === 'present' || a.status === 'late'
      ).length || 0;
      const lastMonthAvg = lastMonthTotal > 0 
        ? Math.round((lastMonthPresent / lastMonthTotal) * 100) 
        : 0;
      const attendanceChange = avgAttendance - lastMonthAvg;

      // Fetch exam results
      const { data: examResults } = await supabase
        .from('exam_results')
        .select('marks_obtained, exam:exams(total_marks)');

      let avgExamScore = 0;
      if (examResults && examResults.length > 0) {
        const totalPercentage = examResults.reduce((acc, r) => {
          const exam = Array.isArray(r.exam) ? r.exam[0] : r.exam;
          const totalMarks = exam?.total_marks || 100;
          return acc + (r.marks_obtained / totalMarks) * 100;
        }, 0);
        avgExamScore = Math.round(totalPercentage / examResults.length);
      }

      // Fetch exams conducted this semester (last 6 months)
      const semesterStart = new Date();
      semesterStart.setMonth(semesterStart.getMonth() - 6);
      
      const { data: exams } = await supabase
        .from('exams')
        .select('id')
        .gte('exam_date', semesterStart.toISOString().split('T')[0]);

      const examsConducted = exams?.length || 0;

      setStats({
        avgAttendance,
        avgExamScore,
        activeStudents,
        examsConducted,
        attendanceChange,
        scoreChange: 0, // Would need historical data
        newStudents
      });
    } catch (error) {
      console.error('Error fetching report stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const reportTypes = [
    {
      title: 'Attendance Report',
      description: 'View monthly attendance statistics',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Exam Performance',
      description: 'Student performance analytics',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Student Progress',
      description: 'Individual progress tracking',
      icon: Users,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Overall Summary',
      description: 'Complete institution overview',
      icon: FileText,
      color: 'bg-amber-100 text-amber-600'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Reports & Analytics | Dar-ul-Ulum</title>
        <meta name="description" content="View performance reports and analytics" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <header className="bg-white border-b border-border/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/admin')}
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
                    Reports & Analytics
                  </h1>
                  <p className="text-xs text-muted-foreground">View performance reports</p>
                </div>
              </div>
              
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white border-border/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Attendance</p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {loading ? '...' : `${stats.avgAttendance}%`}
                    </p>
                    <p className={`text-xs mt-1 ${stats.attendanceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.attendanceChange >= 0 ? '↑' : '↓'} {Math.abs(stats.attendanceChange)}% from last month
                    </p>
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
                    <p className="text-sm text-muted-foreground">Avg Exam Score</p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {loading ? '...' : `${stats.avgExamScore}%`}
                    </p>
                    <p className="text-xs text-green-600 mt-1">Overall average</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-border/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Students</p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {loading ? '...' : stats.activeStudents}
                    </p>
                    <p className="text-xs text-primary mt-1">+{stats.newStudents} new this month</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-border/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Exams Conducted</p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {loading ? '...' : stats.examsConducted}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">This semester</p>
                  </div>
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <FileText className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Types */}
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Available Reports
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {reportTypes.map((report) => (
              <Card 
                key={report.title} 
                className="bg-white border-border/30 hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${report.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <report.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800">Coming Soon</CardTitle>
              <CardDescription className="text-amber-700">
                Detailed analytics with charts and exportable reports are coming soon. 
                You'll be able to generate comprehensive performance insights.
              </CardDescription>
            </CardHeader>
          </Card>
        </main>
      </div>
    </>
  );
};

export default Reports;
