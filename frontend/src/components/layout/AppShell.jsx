import { Link, useNavigate } from 'react-router-dom';
import { Plane, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

function userInitials(user) {
  if (user?.fullName) {
    return user.fullName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
  return user?.email?.[0]?.toUpperCase() ?? '?';
}

export function AppShell({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header__inner">
          <Link to="/viagens" className="app-header__brand">
            <span className="app-header__logo" aria-hidden>
              <Plane size={22} />
            </span>
            <div>
              <p className="app-header__title">Planit Go</p>
              <p className="app-header__tagline">
                Organize sua viagem de acordo com seu orçamento.
              </p>
            </div>
          </Link>
          <div className="app-header__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => navigate('/viagens/nova')}
            >
              <Plus size={18} />
              <span className="hide-mobile">Nova viagem</span>
            </button>
            {user ? (
              <div className="user-chip">
                <span className="user-chip__avatar">{userInitials(user)}</span>
                <span>{user.fullName || user.email}</span>
              </div>
            ) : null}
            <button type="button" className="btn btn--outline" onClick={handleLogout} title="Sair">
              <LogOut size={16} />
              <span className="hide-mobile">Sair</span>
            </button>
          </div>
        </div>
      </header>
      <main className="page-main">{children}</main>
    </div>
  );
}
