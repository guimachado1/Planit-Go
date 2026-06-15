import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { TripsPage } from './pages/TripsPage.jsx';
import { CreateTripPage } from './pages/CreateTripPage.jsx';
import { TripBudgetPage } from './pages/TripBudgetPage.jsx';
import { TripDetailPage } from './pages/TripDetailPage.jsx';
import { TripItineraryPage } from './pages/TripItineraryPage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/viagens" element={<TripsPage />} />
          <Route path="/viagens/nova" element={<CreateTripPage />} />
          <Route path="/viagens/nova/orcamento" element={<TripBudgetPage />} />
          <Route path="/viagens/:id" element={<TripDetailPage />} />
          <Route path="/viagens/:id/itinerario" element={<TripItineraryPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/viagens" replace />} />
        <Route path="*" element={<Navigate to="/viagens" replace />} />
      </Routes>
    </AuthProvider>
  );
}
