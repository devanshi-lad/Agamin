import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff7fa]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#556069]" size={40} />
          <p className="text-[#556069] font-bold animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
