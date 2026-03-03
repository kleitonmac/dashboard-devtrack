import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'
import api from '../../services/api'
import MainLayout from '../../components/Layout'
import {
  Flex,
  Text,
  Button,
  Card,
  TextField,
  Heading,
  Box,
  Avatar,
  Callout,
  Separator,
} from '@radix-ui/themes'
import { FiUser, FiCamera, FiLock, FiLogOut } from 'react-icons/fi'
import { PasswordInput } from '../../components/ui/PasswordInput'
import './profile.css'

const MAX_IMAGE_SIZE = 2 * 1024 * 1024 // 2MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function Profile() {
  const { user, updateUser, logout, refreshUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', email: user.email || '' })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setMessage({
        type: 'error',
        text: 'Formato inválido. Use JPG, PNG ou WebP.',
      })
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setMessage({ type: 'error', text: 'Imagem deve ter no máximo 2MB.' })
      return
    }

    setLoading(true)
    setMessage(null)

    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result as string
      try {
        const { data } = await api.put('/auth/profile', { avatar: base64 })
        updateUser({ ...user, avatar: data.user.avatar })
        setMessage({ type: 'success', text: 'Foto atualizada com sucesso!' })
      } catch (err) {
        setMessage({ type: 'error', text: 'Erro ao enviar foto.' })
      } finally {
        setLoading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const { data } = await api.put('/auth/profile', { avatar: null })
      updateUser({ ...user, avatar: null })
      setMessage({ type: 'success', text: 'Foto removida.' })
    } catch {
      setMessage({ type: 'error', text: 'Erro ao remover foto.' })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { data } = await api.put('/auth/profile', formData)
      
      // Atualizar com os dados retornados do servidor
      if (data.user) {
        updateUser(data.user)
      } else {
        updateUser({ ...user, ...formData })
      }
      
      // Sincronizar com o banco para garantir dados atualizados
      await refreshUser()
      
      setEditMode(false)
      setMessage({ 
        type: 'success', 
        text: `Perfil atualizado com sucesso! ${formData.email !== user?.email ? 'Você pode fazer login com seu novo email.' : ''}` 
      })
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Erro ao atualizar.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' })
      return
    }
    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: 'error',
        text: 'A nova senha deve ter no mínimo 6 caracteres.',
      })
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' })
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Senha atual incorreta.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) logout()
  }

  return (
    <MainLayout>
      <div className="profile-page">
        {message && (
          <Callout.Root
            color={message.type === 'success' ? 'green' : 'red'}
            variant="soft"
            mb="4"
            onOpenChange={() => setMessage(null)}
          >
            <Callout.Text>{message.text}</Callout.Text>
          </Callout.Root>
        )}

        <Heading size="8" mb="6" className="profile-title">
          <FiUser size={28} /> Meu Perfil
        </Heading>

        <Flex gap="6" wrap="wrap" className="profile-layout">
          {/* Card da Foto e Info Principal */}
          <Card size="3" className="profile-avatar-card">
            <Flex direction="column" align="center" gap="4" p="4">
              <div className="avatar-upload-wrapper">
                <Avatar
                  size="8"
                  radius="full"
                  src={user?.avatar || undefined}
                  fallback={user?.name?.charAt(0).toUpperCase() || '?'}
                  className="profile-avatar"
                />
                <label className="avatar-upload-overlay">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarUpload}
                    disabled={loading}
                  />
                  <span className="avatar-upload-btn">
                    <FiCamera size={20} /> Trocar foto
                  </span>
                </label>
              </div>
              {user?.avatar && (
                <Button
                  variant="ghost"
                  color="gray"
                  size="1"
                  onClick={handleRemoveAvatar}
                  disabled={loading}
                >
                  Remover foto
                </Button>
              )}
              <Box textAlign="center">
                <Text size="4" weight="bold" as="div">
                  {user?.name}
                </Text>
                <Text size="2" color="gray" as="div">
                  {user?.email}
                </Text>
              </Box>

              {/* Stats */}
              <Flex
                gap="4"
                wrap="wrap"
                justify="center"
                className="profile-stats"
              >
                <Box className="stat-item">
                  <Text size="1" color="gray">
                    Nível
                  </Text>
                  <Text size="6" weight="bold">
                    {user?.level || 1}
                  </Text>
                </Box>
                <Box className="stat-item">
                  <Text size="1" color="gray">
                    XP Total
                  </Text>
                  <Text size="6" weight="bold">
                    {user?.xp || 0}
                  </Text>
                </Box>
                <Box className="stat-item">
                  <Text size="1" color="gray">
                    Membro desde
                  </Text>
                  <Text size="2" weight="medium">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('pt-BR')
                      : 'N/A'}
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </Card>

          {/* Coluna de Formulários */}
          <Flex direction="column" gap="4" style={{ flex: 1, minWidth: 320 }}>
            {/* Informações da Conta */}
            <Card size="3">
              <Heading size="4" mb="4">
                Informações da Conta
              </Heading>
              <form onSubmit={handleUpdateProfile}>
                <Flex direction="column" gap="3">
                  <Box>
                    <Text
                      size="1"
                      weight="medium"
                      mb="1"
                      as="label"
                      color="gray"
                    >
                      Nome completo
                    </Text>
                    <TextField.Root
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="Digite seu nome completo"
                    />
                  </Box>
                  <Box>
                    <Text
                      size="1"
                      weight="medium"
                      mb="1"
                      as="label"
                      color="gray"
                    >
                      Email
                    </Text>
                    <TextField.Root
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="Digite seu email"
                    />
                  </Box>
                  <Flex gap="2" mt="2">
                    {editMode ? (
                      <>
                        <Button type="submit" disabled={loading}>
                          {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                        <Button
                          type="button"
                          variant="soft"
                          color="gray"
                          onClick={() => setEditMode(false)}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button type="button" onClick={() => setEditMode(true)}>
                        Editar informações
                      </Button>
                    )}
                  </Flex>
                </Flex>
              </form>
            </Card>

            {/* Alterar Senha */}
            <Card size="3">
              <Heading size="4" mb="2">
                <FiLock
                  size={18}
                  style={{ verticalAlign: 'middle', marginRight: 8 }}
                />
                Alterar Senha
              </Heading>
              <Text size="1" color="gray" mb="4" as="p">
                Use uma senha forte com no mínimo 6 caracteres.
              </Text>
              <form onSubmit={handleChangePassword}>
                <Flex direction="column" gap="3">
                  <Box>
                    <Text size="1" weight="medium" mb="1" as="label">
                      Senha atual
                    </Text>
                    <PasswordInput
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Digite sua senha atual"
                      disabled={loading}
                      size="2"
                    />
                  </Box>
                  <Box>
                    <Text size="1" weight="medium" mb="1" as="label">
                      Nova senha
                    </Text>
                    <PasswordInput
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Digite a nova senha (mínimo 6 caracteres)"
                      disabled={loading}
                      size="2"
                    />
                  </Box>
                  <Box>
                    <Text size="1" weight="medium" mb="1" as="label">
                      Confirmar nova senha
                    </Text>
                    <PasswordInput
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Digite novamente a nova senha"
                      disabled={loading}
                      size="2"
                    />
                  </Box>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Alterando...' : 'Alterar senha'}
                  </Button>
                </Flex>
              </form>
            </Card>

            {/* Ações da Conta */}
            <Card size="3" className="profile-actions-card">
              <Heading size="4" mb="2">
                Ações da Conta
              </Heading>
              <Button
                className="profile-logout-btn"
                color="red"
                variant="soft"
                onClick={handleLogout}
                style={{ width: 'fit-content' }}
              >
                <FiLogOut size={16} style={{ marginRight: 8 }} />
                Sair da conta
              </Button>
              <Text size="1" color="gray" mt="2" as="p">
                Ao sair, você será redirecionado para a página de login.
              </Text>
            </Card>
          </Flex>
        </Flex>
      </div>
    </MainLayout>
  )
}
