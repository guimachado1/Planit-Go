import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!acceptPrivacyPolicy) {
      setError('É necessário aceitar a política de privacidade (LGPD).');
      return;
    }
    try {
      await register({
        fullName,
        email,
        password,
        acceptPrivacyPolicy: true,
      });
      navigate('/viagens');
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        'Não foi possível cadastrar.';
      setError(msg);
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/viagens" replace />;
  }

  return (
    <div className="card">
      <h1 style={{ marginTop: 0 }}>Criar conta</h1>
      <form className="stack" onSubmit={handleSubmit}>
        <label className="stack">
          <span>Nome</span>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            minLength={2}
          />
        </label>
        <label className="stack">
          <span>E-mail</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="stack">
          <span>Senha (mín. 8 caracteres)</span>
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          <input
            type="checkbox"
            checked={acceptPrivacyPolicy}
            onChange={(e) => setAcceptPrivacyPolicy(e.target.checked)}
          />
          <span>
            Li e aceito o tratamento dos meus dados conforme a política de privacidade
            (LGPD).
          </span>
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" className="primary">
          Cadastrar
        </button>
      </form>
      <p className="muted">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  );
}
