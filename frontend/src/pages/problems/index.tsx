import { useState, useEffect } from 'react'
import { problemsAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { MainLayout } from '../../components/Layout'
import {
  Flex,
  Text,
  Button,
  Card,
  TextField,
  TextArea,
  Badge,
  Heading,
  Box,
  IconButton,
  Dialog,
  Select,
} from '@radix-ui/themes'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import './problems.css'

export default function Problems() {
  const { user, updateUser } = useAuth()
  const [problems, setProblems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    error: '',
    solution: '',
    technology: '',
    difficulty: 'medium',
    timeToSolve: 0,
  })

  useEffect(() => {
    loadProblems()
  }, [])

  const loadProblems = async () => {
    try {
      setIsLoading(true)
      const response = await problemsAPI.getAll()
      setProblems(response.data || [])
    } catch (error) {
      console.error('Error loading problems:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'timeToSolve' ? parseInt(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data } = await problemsAPI.create(formData)
      if (data?.newXp !== undefined)
        updateUser({ ...user, xp: data.newXp, level: data.newLevel })
      setFormData({
        error: '',
        solution: '',
        technology: '',
        difficulty: 'medium',
        timeToSolve: 0,
      })
      setShowForm(false)
      loadProblems()
    } catch (error) {
      console.error('Erro ao criar o problema:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await problemsAPI.delete(id)
      loadProblems()
    } catch (error) {
      console.error('Erro ao deletar o problema:', error)
    }
  }

  return (
    <MainLayout>
      <Flex direction="column" gap="6">
        <Flex justify="between" align="center" wrap="wrap" gap="4">
          <Heading size="8">🐛 Problemas Resolvidos</Heading>
          <Button size="3" onClick={() => setShowForm(!showForm)}>
            <FiPlus />
            {showForm ? 'Cancelar' : 'Novo Problema'}
          </Button>
        </Flex>

        {showForm && (
          <Card size="3">
            <Heading size="4" mb="4">
              Registrar Problema
            </Heading>
            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="4">
                <Box>
                  <Text size="2" weight="medium" mb="2" as="label">
                    Erro Encontrado
                  </Text>
                  <TextField.Root
                    name="error"
                    value={formData.error}
                    onChange={handleInputChange}
                    placeholder="Digite o erro encontrado (ex: Não é possível ler a propriedade de indefinido)"
                    required
                  />
                </Box>
                <Flex gap="4" wrap="wrap">
                  <Box style={{ flex: 1, minWidth: 150 }}>
                    <Text size="2" weight="medium" mb="2" as="label">
                      Tecnologia
                    </Text>
                    <TextField.Root
                      name="technology"
                      value={formData.technology}
                      onChange={handleInputChange}
                      placeholder="Digite a tecnologia (ex: React)"
                      required
                    />
                  </Box>
                  <Box>
                    <Text size="2" weight="medium" mb="2" as="label">
                      Dificuldade
                    </Text>
                    <Select.Root
                      value={formData.difficulty}
                      onValueChange={(v) =>
                        setFormData((p) => ({ ...p, difficulty: v }))
                      }
                    >
                      <Select.Trigger style={{ width: 120 }} />
                      <Select.Content>
                        <Select.Item value="easy">Fácil</Select.Item>
                        <Select.Item value="medium">Médio</Select.Item>
                        <Select.Item value="hard">Difícil</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Box>
                  <Box>
                    <Text size="2" weight="medium" mb="2" as="label">
                      Tempo (min)
                    </Text>
                    <TextField.Root
                      name="timeToSolve"
                      type="number"
                      value={formData.timeToSolve || ''}
                      onChange={handleInputChange}
                      min={0}
                      style={{ width: 100 }}
                    />
                  </Box>
                </Flex>
                <Box>
                  <Text size="2" weight="medium" mb="2" as="label">
                    Solução
                  </Text>
                  <TextArea
                    name="solution"
                    value={formData.solution}
                    onChange={handleInputChange}
                    placeholder="Digite como você resolveu o problema"
                    rows={5}
                    required
                  />
                </Box>
                <Button type="submit">Salvar Problema</Button>
              </Flex>
            </form>
          </Card>
        )}

        {isLoading ? (
          <Text color="gray">Carregando...</Text>
        ) : problems.length > 0 ? (
          <Flex direction="column" gap="3">
            {problems.map((problem: any) => (
              <Card key={problem._id} size="3">
                <Flex justify="between" align="start" wrap="wrap" gap="3">
                  <Box>
                    <Text size="4" weight="bold" as="div">
                      {problem.error}
                    </Text>
                    <Badge size="1" color="gray" variant="soft" mt="1">
                      {problem.technology}
                    </Badge>
                    <Text size="2" mt="2" as="p">
                      <strong>Solução:</strong> {problem.solution}
                    </Text>
                    <Badge color="blue" variant="soft" mt="2" size="1">
                      ⏱️ {problem.timeToSolve} min
                    </Badge>
                  </Box>
                  <Flex gap="2" align="center">
                    <Badge
                      color={
                        problem.difficulty === 'hard'
                          ? 'red'
                          : problem.difficulty === 'medium'
                            ? 'yellow'
                            : 'green'
                      }
                      variant="soft"
                    >
                      {problem.difficulty}
                    </Badge>
                    <Dialog.Root>
                      <Dialog.Trigger>
                        <IconButton variant="ghost" color="red" size="2">
                          <FiTrash2 />
                        </IconButton>
                      </Dialog.Trigger>
                      <Dialog.Content>
                        <Dialog.Title>Remover problema?</Dialog.Title>
                        <Flex gap="3" mt="4" justify="end">
                          <Dialog.Close>
                            <Button variant="soft" color="gray">
                              Cancelar
                            </Button>
                          </Dialog.Close>
                          <Dialog.Close>
                            <Button
                              color="red"
                              onClick={() => handleDelete(problem._id)}
                            >
                              Remover
                            </Button>
                          </Dialog.Close>
                        </Flex>
                      </Dialog.Content>
                    </Dialog.Root>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Flex>
        ) : (
          <Card size="3" className="empty-state">
            <Flex direction="column" align="center" gap="3" py="6">
              <Text size="6">🎉</Text>
              <Heading size="4">Nenhum problema registrado</Heading>
              <Text color="gray" align="center">
                Registre os problemas que você resolve!
              </Text>
              <Button onClick={() => setShowForm(true)}>
                <FiPlus /> Registrar problema
              </Button>
            </Flex>
          </Card>
        )}
      </Flex>
    </MainLayout>
  )
}
