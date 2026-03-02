# 🎯 DevTrack Frontend - Plano de Implementação

## 📋 Estrutura Frontend

```
src/
├── pages/
│   ├── Login/              # Autenticação
│   ├── Dashboard/          # Visão geral + Analytics
│   ├── Projects/           # Gerenciar projetos
│   ├── Problems/           # Registrar bugs
│   ├── Study/              # Sessões de estudo
│   └── Profile/            # Perfil do dev
│
├── components/
│   ├── Header/             # Navbar com XP/Level
│   ├── Card/               # Componente reutilizável
│   ├── Chart/              # Gráficos
│   ├── XPBar/              # Barra de XP
│   ├── Modal/              # Formulários modais
│   └── Badge/              # Badges de achievement
│
├── services/
│   └── api.js              # Integração com backend
│
├── context/
│   ├── AuthContext.jsx     # Auth + User data
│   └── XPContext.jsx       # XP e achievements
│
├── hooks/
│   ├── useFetch.js         # Fetch com error handling
│   └── useAuth.js          # Auth helpers
│
├── styles/
│   ├── global.css
│   └── theme.css
│
└── App.tsx
```

## 🔗 Endpoints do Backend (esperados)

```
POST   /api/auth/register      - Criar conta
POST   /api/auth/login         - Login

GET    /api/projects           - Listar projetos
POST   /api/projects           - Criar projeto
PUT    /api/projects/:id       - Editar
DELETE /api/projects/:id       - Deletar

GET    /api/study              - Listar sessões
POST   /api/study              - Criar sessão
PUT    /api/study/:id          - Editar

GET    /api/problems           - Listar problemas
POST   /api/problems           - Criar problema
PUT    /api/problems/:id       - Editar

GET    /api/dashboard          - Analytics
GET    /api/dashboard/stats    - Estatísticas

GET    /api/user/profile       - Perfil
PUT    /api/user/profile       - Atualizar perfil
```

## 📊 Dashboard Analytics

```
Seção 1: Visão Geral
├─ XP Total | Level | Próximo nível
├─ Projetos completos
├─ Problemas resolvidos
└─ Horas de estudo

Seção 2: Gráficos
├─ Evolução semanal (XP)
├─ Tecnologias mais usadas (pie chart)
├─ Tempo por categoria (bar chart)
└─ Progresso por mês (line chart)

Seção 3: Badges
├─ Badges conquistadas
├─ Próximas badges
└─ Progresso de cada badge

Seção 4: Atividades Recentes
├─ Últimos projetos
├─ Últimas sessões de estudo
└─ Últimos problemas resolvidos
```

## 🎮 Features por Seção

### 📚 Projects
- [ ] Listar projetos com filtro por technology
- [ ] Criar projeto (modal)
- [ ] Editar projeto
- [ ] Deletar projeto
- [ ] Ver detalhes do projeto
- [ ] Cálculo automático de XP
- [ ] Ranking de tecnologias

### 🐛 Problems
- [ ] Listar problemas resolvidos
- [ ] Criar novo problema
- [ ] Filtrar por technology/difficulty
- [ ] Tempo médio de resolução
- [ ] Estatísticas de bugs

### 📖 Study Sessions
- [ ] Criar sessão de estudo
- [ ] Registrar tempo e foco
- [ ] Calcular produtividade
- [ ] Histórico de sessões
- [ ] Estatísticas por technology

### 📊 Dashboard
- [ ] Stats boxes (XP, Level, Projects, etc)
- [ ] Gráficos com dados reais
- [ ] Timeline de atividades
- [ ] Badges conquistadas
- [ ] Recomendações (próximos passos)

## 🎨 Design System

```
Cores:
- Primary: #6366f1 (Indigo)
- Success: #10b981 (Emerald)
- Warning: #f59e0b (Amber)
- Danger: #ef4444 (Red)
- Dark: #0f172a (Slate)

Spacing: 8px base (8, 16, 24, 32, 40, 48)
Border Radius: 8px default
Shadow: elevation system (sm, md, lg)
```

## 🔐 Autenticação

```
Flow:
1. User faz login → JWT token
2. Token salvo em localStorage
3. Cada request inclui token no header
4. Se token expirar → redirect para login
5. Protected routes com PrivateRoute
```

## 🚀 Fase 1 (Agora)
- [x] Estrutura de pastas
- [ ] Setup inicial (Vite + React)
- [ ] Componentes base
- [ ] Serviço de API
- [ ] Context de Auth
- [ ] Login/Register pages
- [ ] Dashboard com dados mockados

## 🚀 Fase 2 (Depois)
- [ ] Integração com backend
- [ ] Projects CRUD
- [ ] Problems CRUD
- [ ] Study Sessions CRUD
- [ ] Analytics reais
- [ ] Badges system
- [ ] Perfil do usuário

## 📱 Responsive Design
- Mobile first
- Breakpoints: 480px, 768px, 1024px, 1280px
- Touch-friendly buttons
- Drawer menu em mobile
