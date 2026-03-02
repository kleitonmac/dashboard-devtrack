# 🏗️ Arquitetura - Dev Dashboard

## Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                      React App                              │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           DevProvider (Context)                      │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  State:                                         │  │  │
│  │  │  - xp (number)                                  │  │  │
│  │  │  - level (number)                               │  │  │
│  │  │  - tasks (array)                                │  │  │
│  │  │                                                 │  │  │
│  │  │  Methods:                                       │  │  │
│  │  │  - addXP(amount)                               │  │  │
│  │  │  - addTask(task)                               │  │  │
│  │  │  - completeTask(id, xpReward)                 │  │  │
│  │  │  - deleteTask(id)                              │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  localStorage (Persistência)                         │  │
│  │  - devXP                                            │  │
│  │  - devLevel                                         │  │
│  │  - devTasks                                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Components                                  │  │
│  │  ┌─────────┐  ┌─────────┐  ┌────────┐  ┌─────────┐ │  │
│  │  │ Navbar  │  │ Header  │  │ Card   │  │ Tasks   │ │  │
│  │  └─────────┘  └─────────┘  └────────┘  └─────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Pages                                       │  │
│  │  ┌──────────┐  ┌─────────┐  ┌──────────────────┐  │  │
│  │  │ Dashboard│  │ Study   │  │Projects/Problems│  │  │
│  │  └──────────┘  └─────────┘  └──────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Estrutura de Pastas

```
frontend/
├── public/
│   └── [assets públicos]
├── src/
│   ├── components/
│   │   ├── Header/          # Header com XP e Nível
│   │   │   ├── index.tsx
│   │   │   └── header.css
│   │   ├── Navbar/          # Navegação principal
│   │   │   ├── index.tsx
│   │   │   └── navbar.css
│   │   ├── Tasks/           # Lista de aulas
│   │   │   ├── index.tsx
│   │   │   └── tasks.css
│   │   ├── Card/            # Card reutilizável
│   │   │   ├── index.tsx
│   │   │   └── card.css
│   │   ├── ProgressBar/     # Barra de progresso
│   │   │   ├── index.tsx
│   │   │   └── progressbar.css
│   │   └── Chart/           # Gráfico de evolução
│   │       ├── index.tsx
│   │       └── chart.css
│   ├── pages/
│   │   ├── dashboard/       # Dashboard principal
│   │   │   ├── index.tsx
│   │   │   └── dashboard.css
│   │   ├── study/           # Página de estudos
│   │   │   ├── index.tsx
│   │   │   └── study.css
│   │   ├── projects/        # Página de projetos
│   │   │   ├── index.tsx
│   │   │   └── projects.css
│   │   └── problems/        # Página de problemas
│   │       ├── index.tsx
│   │       └── problems.css
│   ├── context/
│   │   └── DevContext.jsx   # Context do XP e tarefas
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Entry point
│   ├── global.css           # Estilos globais
│   └── routes.jsx           # Rotas da app
├── GUIA_USO.md
├── MUDANCAS.md
├── EXEMPLOS_USO.md
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Fluxo de Navegação

```
┌─ Navbar (Sticky) ─────────────────────────────────────────┐
│ Logo | Dashboard | Estudos | Projetos | Problemas | Nível │
└───────────────────────────────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
    Dashboard          Study          Projects/Problems
         │                │
    ┌─────────┐        ┌──────┐
    │ Header  │        │Header│
    │ Stats   │        │Tasks │
    │ Chart   │        │Tips  │
    └─────────┘        └──────┘
```

## Ciclo de Vida - Adicionar e Completar Aula

```
1. Usuário vai à página Study
   └── Carrega Header (mostra XP/Nível)
   └── Carrega Tasks (lista de aulas)

2. Usuário preenche formulário
   - Input: "React Hooks"
   - Select: "10 XP"
   - Clica: "Adicionar"

3. Componente Tasks
   └── Validação: newTask.trim() !== ""
   └── Chama: addTask({ title, xpReward, createdAt })
   └── DevContext adiciona à lista
   └── localStorage atualiza
   └── Component re-renderiza

4. Aula aparece na lista
   - [ ] React Hooks | +10 XP | 🗑️

5. Usuário marca como completa
   - Clica no checkbox
   - Chama: completeTask(taskId, 10)

6. DevContext
   └── Marca task como completed: true
   └── Chama: addXP(10)
   └── addXP calcula novo level
   └── localStorage atualiza
   └── Header re-renderiza com novo XP

7. UI Atualiza
   - ✅ React Hooks | +10 XP | 🗑️
   - Header mostra XP aumentado
   - Se atingiu 100 XP, nível sobe
```

## Padrões Utilizados

### 1. Context API para State Global
```jsx
// Acessar em qualquer componente
const { xp, addXP } = useContext(DevContext);
```

### 2. localStorage para Persistência
```jsx
// Salva automaticamente
useEffect(() => {
  localStorage.setItem("devXP", xp);
}, [xp]);
```

### 3. CSS Variables para Tema
```css
/* Definido em global.css */
--primary: #6366f1;
--secondary: #10b981;
--accent: #f59e0b;

/* Usado em qualquer lugar */
background: var(--primary);
```

### 4. Responsive Design
```css
/* Desktop (padrão) */
grid-template-columns: repeat(4, 1fr);

/* Tablet */
@media (max-width: 768px) {
  grid-template-columns: repeat(2, 1fr);
}

/* Mobile */
@media (max-width: 480px) {
  grid-template-columns: 1fr;
}
```

## Performance

### Otimizações Implementadas

1. **Code Splitting**
   - Cada página é um componente separado
   - React Router carrega só o necessário

2. **CSS Otimizado**
   - CSS Variables reutilizáveis
   - Sem estilos inline (melhor cacheamento)
   - Media queries para diferentes devices

3. **localStorage ao invés de API**
   - Sem latência de rede
   - Dados sempre disponíveis offline
   - Melhor performance local

4. **Memoização do Context**
   - Só re-renderiza quando necessário
   - Não causa re-renders em cascata

## Escalabilidade

### Como Expandir?

#### Adicionar Nova Página
```jsx
// 1. Criar arquivo em src/pages/nova-pagina/index.tsx
export default function NovaPagina() {
  return (
    <div className="nova-pagina">
      <Header />
      {/* conteúdo */}
    </div>
  );
}

// 2. Adicionar em src/routes.jsx
<Route path="/nova" element={<NovaPagina />} />

// 3. Adicionar em Navbar
<Link to="/nova">Nova Página</Link>
```

#### Adicionar Novo Tipo de Task
```jsx
// 1. Expandir modelo Task
interface Task {
  id: number;
  title: string;
  xpReward: number;
  createdAt: string;
  completed: boolean;
  category?: string; // novo
  difficulty?: string; // novo
}

// 2. Atualizar Tasks UI para mostrar novos campos
// 3. Atualizar localStorage
```

#### Integrar com Backend
```jsx
// 1. Criar services/api.js
export const api = {
  saveXP: async (xp) => { /* POST /api/xp */ },
  getTasks: async () => { /* GET /api/tasks */ },
};

// 2. Em DevContext, chamar ao invés de localStorage
// 3. Sincronizar dados com servidor
```

## Debugging

### Como Debugar XP?
```jsx
// 1. Abrir DevTools (F12)
// 2. Ir em Console
// 3. Verificar localStorage
localStorage.getItem("devXP")
localStorage.getItem("devLevel")
localStorage.getItem("devTasks")

// 4. Limpar dados (para testes)
localStorage.clear()
```

### Ver Renderizações
```jsx
// React DevTools > Profiler
// Mostra quais componentes estão renderizando
// E por quanto tempo levam
```

## TypeScript

### Tipos Utilizados

```typescript
interface Task {
  id: number;
  title: string;
  xpReward: number;
  createdAt: string;
  completed: boolean;
}

interface DevContextType {
  xp: number;
  setXp: (xp: number) => void;
  level: number;
  setLevel: (level: number) => void;
  addXP: (amount: number) => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  completeTask: (taskId: number, xpReward: number) => void;
  deleteTask: (taskId: number) => void;
}
```

---

**Documentação técnica completa! 🚀**

Para dúvidas, veja EXEMPLOS_USO.md e GUIA_USO.md
