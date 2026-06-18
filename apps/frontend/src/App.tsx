import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/Login';
import { DashboardPage } from './pages/Dashboard';
import { FarmsPage } from './pages/Farms';
import { FarmDetailsPage } from './pages/FarmDetails';
import { AlertsPage } from './pages/Alerts';
import { UsersPage } from './pages/Users';
import { StatusPage } from './pages/Status';

const ProtectedRoute = ({ children, requireAdmin }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { token, role } = useAuthStore();
  
  if (!token) return <Navigate to="/login" replace />;
  if (requireAdmin && role !== 'ADMIN') return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/farms" element={<FarmsPage />} />
          <Route path="/farms/:id" element={<FarmDetailsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/status" element={<StatusPage />} />
          
          <Route path="/users" element={
            <ProtectedRoute requireAdmin>
              <UsersPage />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
