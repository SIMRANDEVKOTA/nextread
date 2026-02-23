//this component is used to protect routes that require authentication. 
// It checks if the user is authenticated using the useAuth hook from the AuthContext.
//  If the user is not authenticated, it redirects them to the login page. 
// If the user is authenticated, it renders the child components passed to it.
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