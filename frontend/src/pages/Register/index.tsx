import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiZap } from 'react-icons/fi';
import { PasswordInput } from '../../components/ui/PasswordInput';
import {
  Flex,
  Text,
  Button,
  TextField,
  Card,
  Callout,
  Box,
  Heading,
} from '@radix-ui/themes';
import './auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não correspondem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      // Registrar usuário — o backend já retorna token e user; o AuthContext já faz o "login" ao salvar
      const result = await register(name, email, password);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Erro ao registrar');
      }
    } catch {
      setError('Erro ao registrar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-layout">
      {/* Lado esquerdo - Mascote */}
      <div className="register-mascot-area"></div>

      {/* Lado direito - Formulário */}
      <Flex
        className="auth-page"
        direction="column"
        align="center"
        justify="center"
      >
        <Box style={{ width: '100%', maxWidth: 400 }}>
          <Flex className="register-header" direction="column" align="center" gap="4" mb="6">
            <Flex
              align="center"
              justify="center"
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
              }}
            >
              <FiZap size={32} color="white" />
            </Flex>
            <Box>
              <Heading size="8" align="center">
                 Cadastra-se
              </Heading>
              <Text size="2" color="gray" align="center" as="p">
                Crie sua conta e comece sua jornada
              </Text>
            </Box>
          </Flex>

          <Card size="3">
            {error && (
              <Callout.Root color="red" variant="surface" mb="4">
                <Callout.Text>{error}</Callout.Text>
              </Callout.Root>
            )}

            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="4">
                <Box>
                  <Text size="2" weight="medium" mb="2" as="label">
                    Nome Completo
                  </Text>
                  <TextField.Root
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    size="3"
                    required
                  />
                </Box>

                <Box>
                  <Text size="2" weight="medium" mb="2" as="label">
                    Email
                  </Text>
                  <TextField.Root
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    size="3"
                    required
                  />
                </Box>

                <Box>
                  <Text size="2" weight="medium" mb="2" as="label">
                    Senha
                  </Text>
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    disabled={isLoading}
                    name="password"
                    size="3"
                    required
                  />
                  <Text size="1" color="gray" mt="1">
                    Mínimo 6 caracteres
                  </Text>
                </Box>

                <Box>
                  <Text size="2" weight="medium" mb="2" as="label">
                    Confirmar Senha
                  </Text>
                  <PasswordInput
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="********"
                    disabled={isLoading}
                    name="confirmPassword"
                    size="3"
                    required
                  />
                </Box>

                <Button type="submit" size="3" disabled={isLoading} style={{ width: '100%' }}>
                  {isLoading ? 'Registrando...' : 'Criar Conta'}
                </Button>
              </Flex>
            </form>

            <Flex align="center" gap="2" my="4">
              <Box style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.12)' }} />
              <Text size="1" color="gray">
                Ou
              </Text>
              <Box style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.12)' }} />
            </Flex>

            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="soft" color="gray" size="3" style={{ width: '100%' }}>
                Já tem conta? Fazer login
              </Button>
            </Link>
          </Card>
        </Box>
      </Flex>
    </div>
  );
}
