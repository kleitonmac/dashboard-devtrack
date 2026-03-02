import { useState, useEffect } from 'react'
import { projectsAPI } from '../../services/api'
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
import './projects.css'

export default function Projects() {
  const { user, updateUser } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    stack: [] as string[],
    difficulty: 'medium',
    timeSpent: 0,
    learning: '',
  })
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadProjects()
  }, [filter])

  const loadProjects = async () => {
    try {
      setIsLoading(true)
      const response = await projectsAPI.getAll()
      setProjects(response.data || [])
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStackChange = (e: any) => {
    const value = e.target.value
    setFormData((prev) => ({
      ...prev,
      stack: value.split(',').map((s: string) => s.trim()),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data } = await projectsAPI.create(formData)
      if (data?.newXp !== undefined)
        updateUser({ ...user, xp: data.newXp, level: data.newLevel })
      setFormData({
        name: '',
        stack: [],
        difficulty: 'medium',
        timeSpent: 0,
        learning: '',
      })
      setShowForm(false)
      loadProjects()
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await projectsAPI.delete(id)
      loadProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const filteredProjects =
    filter === 'all'
      ? projects
      : projects.filter((p) => p.difficulty?.toLowerCase() === filter)

  return (
    <MainLayout>
      <Flex direction="column" gap="6">
        <Flex justify="between" align="center" wrap="wrap" gap="4">
          <Heading size="8">🚀 Meus Projetos</Heading>
          <Button size="3" onClick={() => setShowForm(!showForm)}>
            <FiPlus />
            {showForm ? 'Cancelar' : 'Novo Projeto'}
          </Button>
        </Flex>

        {showForm && (
          <Card size="3">
            <Heading size="4" mb="4">
              Novo Projeto
            </Heading>
            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="4">
                <Box>
                  <Text size="2" weight="medium" mb="2" as="label">
                    Nome do Projeto
                  </Text>
                  <TextField.Root
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Digite o nome do projeto (ex: E-commerce com React)"
                    required
                  />
                </Box>
                <Flex gap="4" wrap="wrap">
                  <Box style={{ flex: 1, minWidth: 200 }}>
                    <Text size="2" weight="medium" mb="2" as="label">
                      Tecnologias (separadas por vírgula)
                    </Text>
                    <TextField.Root
                      value={formData.stack.join(', ')}
                      onChange={handleStackChange}
                      placeholder="Digite as tecnologias separadas por vírgula (ex: React, Node.js, MongoDB)"
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
                      Tempo (horas)
                    </Text>
                    <TextField.Root
                      name="timeSpent"
                      type="number"
                      value={formData.timeSpent || ''}
                      onChange={handleInputChange}
                      min={0}
                      style={{ width: 100 }}
                    />
                  </Box>
                </Flex>
                <Box>
                  <Text size="2" weight="medium" mb="2" as="label">
                    Aprendizados
                  </Text>
                  <TextArea
                    name="learning"
                    value={formData.learning}
                    onChange={handleInputChange}
                    placeholder="Digite o que você aprendeu com o projeto"
                    rows={4}
                  />
                </Box>
                <Button type="submit">Salvar Projeto</Button>
              </Flex>
            </form>
          </Card>
        )}

        <Flex gap="2" wrap="wrap">
          {['all', 'easy', 'medium', 'hard'].map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'soft' : 'ghost'}
              color="green"
              size="2"
              onClick={() => setFilter(f)}
              style={{ backgroundColor: 'var(--green-3)' }}
            >
              {f === 'all'
                ? 'Todos'
                : f === 'easy'
                  ? 'Fácil'
                  : f === 'medium'
                    ? 'Médio'
                    : 'Difícil'}
            </Button>
          ))}
        </Flex>

        {isLoading ? (
          <Text color="gray">Carregando...</Text>
        ) : filteredProjects.length > 0 ? (
          <Flex
            direction="column"
            gap="3"
            wrap="wrap"
            className="projects-grid"
          >
            {filteredProjects.map((project: any) => (
              <Card key={project._id} size="3">
                <Flex justify="between" align="start" wrap="wrap" gap="3">
                  <Box>
                    <Text size="4" weight="bold" as="div">
                      {project.name}
                    </Text>
                    <Flex gap="2" mt="2" wrap="wrap">
                      <Badge color="blue" variant="soft">
                        ⏱️ {project.timeSpent}h
                      </Badge>
                      <Badge color="gray" variant="soft">
                        📚 {project.stack?.length || 0} techs
                      </Badge>
                    </Flex>
                    {project.stack?.length > 0 && (
                      <Flex gap="1" mt="2" wrap="wrap">
                        {project.stack.map((tech: string) => (
                          <Badge key={tech} size="1" variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </Flex>
                    )}
                    {project.learning && (
                      <Text size="2" color="gray" mt="2" as="p">
                        {project.learning}
                      </Text>
                    )}
                  </Box>
                  <Flex gap="2" align="center">
                    <Badge
                      color={
                        project.difficulty === 'hard'
                          ? 'red'
                          : project.difficulty === 'medium'
                            ? 'yellow'
                            : 'green'
                      }
                      variant="soft"
                    >
                      {project.difficulty}
                    </Badge>
                    <Dialog.Root>
                      <Dialog.Trigger>
                        <IconButton variant="ghost" color="red" size="2">
                          <FiTrash2 />
                        </IconButton>
                      </Dialog.Trigger>
                      <Dialog.Content>
                        <Dialog.Title>Remover projeto?</Dialog.Title>
                        <Dialog.Description>
                          Esta ação não pode ser desfeita.
                        </Dialog.Description>
                        <Flex gap="3" mt="4" justify="end">
                          <Dialog.Close>
                            <Button variant="soft" color="gray">
                              Cancelar
                            </Button>
                          </Dialog.Close>
                          <Dialog.Close>
                            <Button
                              color="red"
                              onClick={() => handleDelete(project._id)}
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
              <Text size="6">📭</Text>
              <Heading size="4">Nenhum projeto ainda</Heading>
              <Text color="gray" align="center">
                Comece criando seu primeiro projeto!
              </Text>
              <Button onClick={() => setShowForm(true)}>
                <FiPlus /> Criar projeto
              </Button>
            </Flex>
          </Card>
        )}
      </Flex>
    </MainLayout>
  )
}
