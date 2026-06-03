import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function ProtectedRoute() {
  const { isAuthenticated, bootstrapping } = useAuth();

  if (bootstrapping) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" aria-hidden />
        <p>Carregando…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
