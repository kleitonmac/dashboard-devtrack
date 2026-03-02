import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { dashboardAPI, projectsAPI, studyAPI } from '../../services/api'
import { MainLayout } from '../../components/Layout'
import monsterImg from '../../assets/monster.png'
import {
  Flex,
  Card,
  Badge,
  Text,
  Heading,
  Box,
  Progress,
} from '@radix-ui/themes'
import Chart from '../../components/Chart'
import './Dashboard.css'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Dashboard() {
  const { user, refreshUser } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    try {
      const [statsRes, analyticsRes, projectsRes, sessionsRes] =
        await Promise.allSettled([
          dashboardAPI.getStats(),
          dashboardAPI.getAnalytics('week'),
          projectsAPI.getAll({ limit: 5 }),
          studyAPI.getAll({ limit: 5 }),
        ])

      setStats(statsRes.status === 'fulfilled' ? statsRes.value?.data : null)
      setAnalytics(
        analyticsRes.status === 'fulfilled' ? analyticsRes.value?.data : null,
      )
      setProjects(
        projectsRes.status === 'fulfilled' ? projectsRes.value?.data || [] : [],
      )
      setSessions(
        sessionsRes.status === 'fulfilled' ? sessionsRes.value?.data || [] : [],
      )

      await refreshUser()
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const onFocus = () => {
      loadData()
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  if (isLoading) {
    return (
      <MainLayout>
        <Flex align="center" justify="center" py="9">
          <Text size="3" color="gray">
            Carregando Dashboard...
          </Text>
        </Flex>
      </MainLayout>
    )
  }

  const xpPercentage = (user?.xp || 0) % 100

  const chartData = analytics?.weeklyXP || [
    { name: 'Seg', xp: 0 },
    { name: 'Ter', xp: 0 },
    { name: 'Qua', xp: 0 },
    { name: 'Qui', xp: 0 },
    { name: 'Sex', xp: 0 },
    { name: 'Sáb', xp: 0 },
    { name: 'Dom', xp: 0 },
  ]

  return (
    <MainLayout>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="dashboard-container"
      >
        {/* ✅ HEADER ATUALIZADO */}
        <motion.div variants={item} className="dashboard-header">
          <Heading size="6">Bem-vindo de volta {user?.name} 🚀</Heading>
          <Text size="3" style={{ opacity: 0.9 }}>
            Prepare-se para aprender e evoluir!
          </Text>
        </motion.div>

        <motion.div variants={item} className="dashboard-grid">
          <Card size="3" className="stat-card">
            <Flex direction="column" gap="2">
              <Text size="2" color="gray">
                Nível
              </Text>
              <Text size="8" weight="bold">
                {user?.level || 1}
              </Text>
            </Flex>
          </Card>

          <Card size="3" className="stat-card">
            <Flex direction="column" gap="2">
              <Text size="2" color="gray">
                XP Total
              </Text>
              <Text size="8" weight="bold">
                {user?.xp || 0}
              </Text>
              <Box mt="2">
                <Progress value={xpPercentage} size="2" />
                <Text size="1" color="gray" mt="1">
                  {xpPercentage}/100 para próximo nível
                </Text>
              </Box>
            </Flex>
          </Card>

          <Card size="3" className="stat-card">
            <Flex direction="column" gap="2">
              <Text size="2" color="gray">
                Projetos
              </Text>
              <Text size="8" weight="bold">
                {Array.isArray(projects)
                  ? projects.length
                  : stats?.totalProjects || 0}
              </Text>
            </Flex>
          </Card>

          <Card size="3" className="stat-card">
            <Flex direction="column" gap="2">
              <Text size="2" color="gray">
                Sessões
              </Text>
              <Text size="8" weight="bold">
                {Array.isArray(sessions) ? sessions.length : 0}
              </Text>
            </Flex>
          </Card>
        </motion.div>

        <motion.div variants={item} className="evolution-wrapper">
          <Card size="3" className="evolution-card">
            <Flex direction="column" gap="3">
              <Heading size="4">Evolução Semanal</Heading>
              <Chart data={chartData} />
            </Flex>

            {/* MASCOTE */}
            <img src={monsterImg} alt="Mascote" className="dashboard-mascot" />
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card size="3">
            <Flex direction="column" gap="3">
              <Heading size="4">Projetos Recentes</Heading>
              {Array.isArray(projects) && projects.length > 0 ? (
                <Flex direction="column" gap="2">
                  {projects.map((p: any) => (
                    <Flex
                      key={p._id}
                      justify="between"
                      align="center"
                      p="2"
                      style={{
                        background: '#f1f5f9',
                        borderRadius: 8,
                      }}
                    >
                      <Text weight="medium">{p.name}</Text>
                      <Badge variant="soft" color="blue">
                        {p.difficulty}
                      </Badge>
                    </Flex>
                  ))}
                </Flex>
              ) : (
                <Text style={{ color: '#000' }}>Nenhum projeto ainda.</Text>
              )}
            </Flex>
          </Card>
        </motion.div>
      </motion.div>
    </MainLayout>
  )
}
