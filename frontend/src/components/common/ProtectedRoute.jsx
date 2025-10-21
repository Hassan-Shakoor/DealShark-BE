import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedUserTypes = ['customer', 'business'] }) => {
  const { isAuthenticated, userType, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while authenticating or if userType is not yet determined
  if (isLoading || (isAuthenticated && !userType)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedUserTypes?.length > 0 && !allowedUserTypes.includes(userType)) {
    // Redirect to appropriate dashboard
    const dashboardPath = userType === 'customer' ? '/my-subscriptions' : '/my-subscribers';
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
