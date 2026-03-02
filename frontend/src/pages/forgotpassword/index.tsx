import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Theme, Text, Callout, Heading } from '@radix-ui/themes';
import { authAPI } from '../../services/api';
import '../Login/auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateForm = () => {
    if (!email.trim()) {
      setError('Digite seu email.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError('Digite um email válido.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await authAPI.forgotPassword(email);

      setSuccess(
        response.data?.message ||
        'Se o email existir na base, você receberá o link de recuperação.'
      );

      setEmail('');

      if (response.data?.devResetLink) {
        console.log('Link de reset (dev):', response.data.devResetLink);
      }
    } catch (err: unknown) {
      const ax = err as { response?: { status?: number; data?: { error?: string } }; message?: string };
      if (ax.response?.status === 429) {
        setError(
          ax.response?.data?.error ||
          'Muitas tentativas. Tente novamente em alguns minutos.'
        );
      } else if (ax.response?.data?.error) {
        setError(ax.response.data.error);
      } else if (ax.message === 'Network Error' || ax.response?.status === undefined) {
        setError('Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        setError('Erro ao processar a solicitação. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-bg login-page">
      <div className="auth-panel">
        <div className="auth-content">

          <Heading className="auth-title">Recuperar Senha</Heading>

          <Text className="auth-subtitle">
            Digite o email da sua conta para receber o link de redefinição.
          </Text>

          {error && (
            <Callout.Root color="red" variant="surface" mb="4">
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}

          {success && (
            <Callout.Root color="green" variant="surface" mb="4">
              <Callout.Text>{success}</Callout.Text>
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

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'ENVIAR LINK'}
            </button>
          </form>

          <div className="auth-footer">
            <Text className="auth-register-text">Lembrou a senha?</Text>
            <Link to="/login" className="auth-register-button">
              Voltar para login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}