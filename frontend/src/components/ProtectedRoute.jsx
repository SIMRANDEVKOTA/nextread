import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    // Redirect unauthenticated users to Login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;