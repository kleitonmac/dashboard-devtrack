import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Flex, Text } from '@radix-ui/themes';
import './global.css';
// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/forgotpassword';
import ResetPassword from './pages/resetpassword';
import Dashboard from './pages/dashboard';
import Projects from './pages/projects';
import Problems from './pages/problems';
import StudySessions from './pages/study';
import Profile from './pages/profile';

// Private Route Wrapper
function PrivateRoute({ element }: { element: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '100vh', padding: '2rem' }}>
        <Text size="3" color="gray">Carregando...</Text>
      </Flex>
    );
  }

  return user ? <>{element}</> : <Navigate to="/login" replace />;
}

// Public Route Wrapper (redirect to dashboard if already logged in)
function PublicRoute({ element }: { element: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '100vh', padding: '2rem' }}>
        <Text size="3" color="gray">Carregando...</Text>
      </Flex>
    );
  }

  return !user ? <>{element}</> : <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<PublicRoute element={<Login />} />} />
      <Route path="/register" element={<PublicRoute element={<Register />} />} />
      <Route path="/forgot-password" element={<PublicRoute element={<ForgotPassword />} />} />
      <Route path="/reset-password" element={<PublicRoute element={<ResetPassword />} />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
      <Route path="/projetos" element={<PrivateRoute element={<Projects />} />} />
      <Route path="/problemas" element={<PrivateRoute element={<Problems />} />} />
      <Route path="/estudos" element={<PrivateRoute element={<StudySessions />} />} />
      <Route path="/perfil" element={<PrivateRoute element={<Profile />} />} />
      

      {/* Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
