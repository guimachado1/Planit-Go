import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Plane } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getApiErrorMessage } from '../utils/errors.js';

export function LoginPage() {
  const { login, isAuthenticated, bootstrapping } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!bootstrapping && isAuthenticated) {
    return <Navigate to="/viagens" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/viagens');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível entrar.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__bg" aria-hidden />
      <div className="login-page__overlay" aria-hidden />
      <div className="login-card">
        <div className="login-card__brand">
          <div className="login-card__icon">
            <Plane size={32} />
          </div>
          <h1>Planit Go</h1>
          <p className="login-card__subtitle">
            Organize sua viagem de acordo com seu orçamento.
          </p>
        </div>
        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="viajante@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field field--password-toggle">
            <label htmlFor="password">Senha</label>
            <div className="field__icon-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <button
                type="button"
                className="field__toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
              </button>
            </div>
          </div>
          {error ? <div className="alert alert--error">{error}</div> : null}
          <button
            type="submit"
            className="btn btn--primary btn--block btn--lg"
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={20} style={{ animation: 'spin 0.8s linear infinite' }} />
            ) : null}
            Começar a planejar
          </button>
        </form>
        <p className="login-footer">
          Ainda não tem conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
