import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PasswordInput } from '../../components/ui/PasswordInput';
import {
  Theme,
  Text,
  Callout,
  Heading,
} from '@radix-ui/themes';
import './auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // 🔐 Redireciona se já estiver logado
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setError('Preencha todos os campos.');
      return false;
    }

    if (!email.includes('@')) {
      setError('Digite um email válido.');
      return false;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Email ou senha inválidos.');
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-bg login-page">
      <div className="auth-panel">
        <div className="auth-content">

          <Heading className="auth-title" appearance="gray-1" color='gray'>Login</Heading>


          <Text className="auth-subtitle">
            Acesse sua conta e continue sua evolução como desenvolvedor.
          </Text>

          {error && (
            <Callout.Root color="red" variant="surface" mb="4">
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
              required
              className="auth-input"
            />

            <label htmlFor="password">Senha</label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              disabled={isLoading}
              autoComplete="current-password"
            />

            <div className="auth-forgot-wrapper">
              <Link to="/forgot-password" className="auth-forgot-link">
                Esqueci minha senha
              </Link>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'ENTRAR'}
            </button>

          </form>

          <div className="auth-footer">
            <Text className="auth-register-text">
              Ainda não tem conta?
            </Text>
            <Link to="/register" className="auth-register-button">
              Criar nova conta
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
