import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { Capacitor } from "@capacitor/core";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PushNotificationProvider } from "@/components/PushNotificationProvider";
import SplashAppGate from "@/components/splash/SplashAppGate";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminLogin from "./pages/AdminLogin";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import StudentProfile from "./pages/StudentProfile";
import StudentHadith from "./pages/StudentHadith";
import StudentBooks from "./pages/StudentBooks";
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
import BookManagement from "./pages/admin/BookManagement";
import QuranManagement from "./pages/admin/QuranManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import Reports from "./pages/admin/Reports";
import StudentExams from "./pages/StudentExams";
import StudentQuran from "./pages/StudentQuran";
import TakeExam from "./pages/TakeExam";
import NotFound from "./pages/NotFound";
import SplashPage from "./pages/SplashPage";
import AdmissionForm from "./pages/AdmissionForm";
import AdmissionManagement from "./pages/admin/AdmissionManagement";
import Support from "./pages/Support";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => {
  const Router = Capacitor.isNativePlatform() ? HashRouter : BrowserRouter;

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Router>
                <AuthProvider>
                  <SplashAppGate>
                    <PushNotificationProvider>
                      <AppErrorBoundary>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/splash" element={<SplashPage />} />
                          <Route path="/sp" element={<Navigate to="/splash" replace />} />
                          <Route path="/home" element={<Navigate to="/" replace />} />
                          <Route path="/admission" element={<AdmissionForm />} />
                          <Route path="/auth" element={<Auth />} />
                          <Route path="/admin-login" element={<AdminLogin />} />
                          <Route path="/reset-password" element={<ResetPassword />} />
                          <Route
                            path="/dashboard"
                            element={
                              <ProtectedRoute allowedRoles={["student"]}>
                                <Dashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/profile"
                            element={
                              <ProtectedRoute allowedRoles={["student"]}>
                                <StudentProfile />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/hadith"
                            element={
                              <ProtectedRoute allowedRoles={["student"]}>
                                <StudentHadith />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/books"
                            element={
                              <ProtectedRoute allowedRoles={["student"]}>
                                <StudentBooks />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/quran"
                            element={
                              <ProtectedRoute allowedRoles={["student"]}>
                                <StudentQuran />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/exams"
                            element={
                              <ProtectedRoute allowedRoles={["student"]}>
                                <StudentExams />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/exams/:examId/take"
                            element={
                              <ProtectedRoute allowedRoles={["student"]}>
                                <TakeExam />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/attendance"
                            element={
                              <ProtectedRoute allowedRoles={["student"]}>
                                <StudentAttendance />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/results"
                            element={
                              <ProtectedRoute allowedRoles={["student"]}>
                                <StudentResults />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/support"
                            element={
                              <ProtectedRoute allowedRoles={["student"]}>
                                <Support />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/contact"
                            element={
                              <ProtectedRoute allowedRoles={["student"]}>
                                <Contact />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin"
                            element={
                              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                                <AdminPanel />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/exams"
                            element={
                              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                                <ExamManagement />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/exams/:examId/results"
                            element={
                              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                                <ExamResults />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/exams/create"
                            element={
                              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                                <CreateExamWithTranslation />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/exams/:examId/submissions"
                            element={
                              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                                <ExamSubmissions />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/attendance"
                            element={
                              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                                <AttendanceManagement />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/users"
                            element={
                              <ProtectedRoute allowedRoles={["admin"]}>
                                <UserManagement />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/hadith"
                            element={
                              <ProtectedRoute allowedRoles={["admin"]}>
                                <HadithManagement />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/books"
                            element={
                              <ProtectedRoute allowedRoles={["admin"]}>
                                <BookManagement />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/quran"
                            element={
                              <ProtectedRoute allowedRoles={["admin"]}>
                                <QuranManagement />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/content"
                            element={
                              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                                <ContentManagement />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/reports"
                            element={
                              <ProtectedRoute allowedRoles={["admin"]}>
                                <Reports />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/admissions"
                            element={
                              <ProtectedRoute allowedRoles={["admin"]}>
                                <AdmissionManagement />
                              </ProtectedRoute>
                            }
                          />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </AppErrorBoundary>
                    </PushNotificationProvider>
                  </SplashAppGate>
                </AuthProvider>
              </Router>
            </TooltipProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;

