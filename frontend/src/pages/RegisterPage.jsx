import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Plane, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getApiErrorMessage } from '../utils/errors.js';

export function RegisterPage() {
  const { register, isAuthenticated, bootstrapping } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!bootstrapping && isAuthenticated) {
    return <Navigate to="/viagens" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!acceptPrivacyPolicy) {
      setError('É necessário aceitar a política de privacidade (LGPD).');
      return;
    }
    setLoading(true);
    try {
      await register({
        fullName,
        email,
        password,
        acceptPrivacyPolicy: true,
      });
      navigate('/viagens');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível cadastrar.'));
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
          <h1>Criar conta</h1>
        </div>
        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="fullName">Nome</label>
            <input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              minLength={2}
            />
          </div>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Senha (mín. 8)</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <label style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem' }}>
            <input
              type="checkbox"
              checked={acceptPrivacyPolicy}
              onChange={(e) => setAcceptPrivacyPolicy(e.target.checked)}
            />
            Aceito o tratamento dos meus dados conforme a política de privacidade (LGPD).
          </label>
          {error ? <div className="alert alert--error">{error}</div> : null}
          <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={loading}>
            {loading ? (
              <Loader2 size={20} style={{ animation: 'spin 0.8s linear infinite' }} />
            ) : null}
            Cadastrar
          </button>
        </form>
        <p className="login-footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
