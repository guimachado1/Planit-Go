import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/viagens');
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        'Não foi possível entrar. Verifique suas credenciais.';
      setError(msg);
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/viagens" replace />;
  }

  return (
    <div className="card">
      <h1 style={{ marginTop: 0 }}>Entrar</h1>
      <p className="muted">
        Base alinhada ao fluxo do Figma (login); estilos serão refinados depois.
      </p>
      <form className="stack" onSubmit={handleSubmit}>
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
          <span>Senha</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" className="primary">
          Entrar
        </button>
      </form>
      <p className="muted">
        Não tem conta? <Link to="/register">Cadastre-se</Link>
      </p>
    </div>
  );
}
