import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

type AppRole = 'admin' | 'teacher' | 'student';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AppRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    const isAdminArea = location.pathname.startsWith('/admin');
    return <Navigate to={isAdminArea ? '/admin-login' : '/auth'} state={{ from: location }} replace />;
  }

  if (allowedRoles) {
    // Least-privilege default: if role isn't loaded/found, treat as student.
    const effectiveRole: AppRole = role ?? 'student';

    if (!allowedRoles.includes(effectiveRole)) {
      const dashboardPath = effectiveRole === 'admin' || effectiveRole === 'teacher'
        ? '/admin'
        : '/dashboard';
      return <Navigate to={dashboardPath} replace />;
    }
  }

  return <>{children}</>;
};
