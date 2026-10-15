import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './features/auth/LandingPage';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import EmployeeDashboard from './features/dashboard/EmployeeDashboard';
import CaseDetail from './features/dashboard/CaseDetail';
import GameIntroScreen from './features/dashboard/GameIntroScreen';
import HelpScreen from './features/dashboard/HelpScreen';
import ScoreFeedback from './features/investigation/ScoreFeedback';

// Code-split heavy screens: the 3D investigation pulls in three.js, and
// employees never need the admin bundle.
const InvestigationScreen = lazy(() => import('./features/investigation/InvestigationScreen'));
const AdminDashboard      = lazy(() => import('./features/admin/AdminDashboard'));

const PageLoader = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
    Loading…
  </div>
);

function ProtectedRoute({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute role="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/case/:id" element={
            <ProtectedRoute role="employee">
              <CaseDetail />
            </ProtectedRoute>
          } />
          
          <Route path="/game/intro" element={
            <ProtectedRoute role="employee">
              <GameIntroScreen />
            </ProtectedRoute>
          } />
          
          <Route path="/game/help" element={
            <ProtectedRoute role="employee">
              <HelpScreen />
            </ProtectedRoute>
          } />
          
          <Route path="/game/play" element={
            <ProtectedRoute role="employee">
              <InvestigationScreen />
            </ProtectedRoute>
          } />
          
          <Route path="/game/result" element={
            <ProtectedRoute role="employee">
              <ScoreFeedback />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
