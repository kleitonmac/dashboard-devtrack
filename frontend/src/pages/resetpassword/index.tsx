import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Theme, Text, Callout, Heading } from '@radix-ui/themes';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { authAPI } from '../../services/api';
import '../Login/auth.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token) {
      setValidating(false);
      setTokenValid(false);
      return;
    }
    authAPI
      .validateResetToken(token)
      .then(({ data }) => {
        setTokenValid(data?.valid ?? false);
      })
      .catch(() => setTokenValid(false))
      .finally(() => setValidating(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setIsLoading(true);
    try {
      await authAPI.resetPassword({ token, newPassword });
      setSuccess('Senha alterada com sucesso. Redirecionando para o login...');
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err: unknown) {
      const ax = err as { response?: { status?: number; data?: { error?: string } } };
      if (ax.response?.status === 429) {
        setError(ax.response?.data?.error || 'Muitas tentativas. Tente novamente em alguns minutos.');
      } else {
        setError(ax.response?.data?.error || 'Erro ao redefinir senha. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="auth-bg login-page">
        <div className="auth-panel">
          <Theme appearance="dark">
            <div className="auth-content">
              <Text className="auth-subtitle" color="gray">Validando link...</Text>
            </div>
          </Theme>
        </div>
      </div>
    );
  }

  if (!token || tokenValid === false) {
    return (
      <div className="auth-bg login-page">
        <div className="auth-panel">
          <Theme appearance="dark">
            <div className="auth-content">
              <Heading className="auth-title" color="gray" highContrast>Link inválido ou expirado</Heading>
              <Text className="auth-subtitle" color="gray">
                Solicite um novo link de recuperação na página Esqueci minha senha.
              </Text>
              <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
                <Link to="/forgot-password" className="auth-register-button">
                  Solicitar novo link
                </Link>
                <Link to="/login" className="auth-register-button" style={{ marginLeft: 8 }}>
                  Ir para login
                </Link>
              </div>
            </div>
          </Theme>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-bg login-page">
      <div className="auth-panel">
        <Theme appearance="dark">
          <div className="auth-content">

            <Heading className="auth-title" color="gray" highContrast>Nova senha</Heading>

            <Text className="auth-subtitle" color="gray">
              Digite e confirme sua nova senha (mínimo 6 caracteres).
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
            <label htmlFor="newPassword">Nova senha</label>
            <PasswordInput
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite a nova senha"
              disabled={isLoading}
              size="3"
              required
            />

            <label htmlFor="confirmPassword">Confirmar senha</label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a nova senha"
              disabled={isLoading}
              size="3"
              required
            />

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? 'Alterando...' : 'REDEFINIR SENHA'}
            </button>
          </form>

          <div className="auth-footer">
            <Link to="/login" className="auth-register-button">
              Voltar para login
            </Link>
          </div>

        </div>
        </Theme>
      </div>
    </div>
  );
}
