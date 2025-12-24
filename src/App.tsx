import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminLogin from "./pages/AdminLogin";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import StudentProfile from "./pages/StudentProfile";
import StudentHadith from "./pages/StudentHadith";
import StudentAttendance from "./pages/StudentAttendance";
import StudentResults from "./pages/StudentResults";
import AdminPanel from "./pages/AdminPanel";
import ExamManagement from "./pages/admin/ExamManagement";
import ExamResults from "./pages/admin/ExamResults";
import ExamSubmissions from "./pages/admin/ExamSubmissions";
import CreateExamWithTranslation from "./pages/admin/CreateExamWithTranslation";
import AttendanceManagement from "./pages/admin/AttendanceManagement";
import UserManagement from "./pages/admin/UserManagement";
import HadithManagement from "./pages/admin/HadithManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import Reports from "./pages/admin/Reports";
import StudentExams from "./pages/StudentExams";
import TakeExam from "./pages/TakeExam";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/hadith" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentHadith />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/exams" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentExams />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/exams/:examId/take" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <TakeExam />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/attendance" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentAttendance />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/results" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentResults />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/exams" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                    <ExamManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/exams/:examId/results" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                    <ExamResults />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/exams/create" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                    <CreateExamWithTranslation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/exams/:examId/submissions" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                    <ExamSubmissions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/attendance"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                    <AttendanceManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/hadith" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <HadithManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/content" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                    <ContentManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/reports" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Reports />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
