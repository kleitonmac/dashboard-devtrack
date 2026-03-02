/**
 * ESTRUTURA DO BANCO DE DADOS - DevTrack
 * =======================================
 * Uma coleção por seção, sem misturar dados:
 *
 * | Seção      | Coleção       | Uso                              |
 * |------------|---------------|-----------------------------------|
 * | Login/Register + Perfil | users       | Conta, senha, XP, nível, avatar |
 * | Estudos    | studysessions | Sessões de estudo                |
 * | Estudos    | studytasks    | Tarefas to-do de estudo          |
 * | Projetos   | projects      | Projetos do usuário              |
 * | Problemas  | devproblems   | Problemas resolvidos             |
 * | Dashboard  | (agregado)    | Lê das outras; não tem coleção   |
 *
 * Tudo isolado por usuário via userId (exceto users, que é 1 doc por conta).
 *
 * PROGRESSO POR CONTA: cada usuário tem seu próprio XP, projetos, estudos, problemas.
 * Quando o usuário A faz tarefas, só o XP dele sobe (salvo em users + atividades com userId).
 * O usuário B não recebe esse progresso; cada conta é independente no banco.
 */

export const DATABASE_STRUCTURE = {
  /**
   * ========== LOGIN | REGISTER | PERFIL ==========
   * Coleção: users (uma sessão só para conta e perfil)
   * - POST /api/auth/register: cria conta e salva no banco
   * - POST /api/auth/login: autentica e retorna token; usuário acessa seus dados
   */
  users: {
    collection: "users",
    section: "Login | Register | Perfil",
    fields: {
      name: "String (obrigatório)",
      email: "String único (obrigatório)",
      password: "String hash (obrigatório)",
      xp: "Number (default: 0) - aumenta com atividades",
      level: "Number (default: 1) - calculado: floor(xp/100)+1",
      role: "user | admin",
      lastLogin: "Date",
      createdAt: "Date (automático)",
      updatedAt: "Date (automático)",
    },
    xpSource: "Nova conta sempre começa com XP 0",
  },

  /**
   * ========== PERFIL ==========
   * Coleção: users (mesma do Login/Register)
   * Rota API: /api/auth
   * - PUT /profile: Atualiza nome e email
   * - POST /change-password: Altera senha
   */
  profile: {
    collection: "users",
    section: "Perfil",
    note: "Dados do perfil estão na coleção users",
  },

  /**
   * ========== DASHBOARD ==========
   * Não possui coleção própria - agrega dados de:
   * - users (XP, nível)
   * - projects (contagem)
   * - studysessions (contagem, tempo total)
   * - studytasks (completadas)
   * - devproblems (contagem)
   * Rota API: /api/dashboard
   * - GET /: Estatísticas gerais
   * - GET /stats: XP, nível, contagens
   * - GET /analytics: Evolução semanal de XP
   */
  dashboard: {
    section: "Dashboard",
    note: "Dados agregados das outras coleções",
  },

  /**
   * ========== PROJETOS ==========
   * Coleção: projects
   * Rota API: /api/projects
   * - GET /: Lista projetos do usuário
   * - POST /: Cria projeto (+30 XP)
   * - DELETE /:id: Remove projeto
   */
  projects: {
    collection: "projects",
    section: "Projetos",
    fields: {
      name: "String",
      stack: "Array de strings",
      difficulty: "easy | medium | hard",
      timeSpent: "Number (horas)",
      learning: "String",
      userId: "ObjectId ref User",
      createdAt: "Date",
      updatedAt: "Date",
    },
    xpPerItem: 30,
  },

  /**
   * ========== ESTUDOS ==========
   * Coleções: studysessions, studytasks
   * Rota API: /api/study
   */
  studies: {
    section: "Estudos",
    collections: {
      studysessions: {
        description: "Sessões de estudo registradas",
        xpPerItem: 10,
        fields: {
          technology: "String",
          duration: "Number (minutos)",
          focus: "Number 0-100",
          productivity: "Number 0-100",
          notes: "String",
          userId: "ObjectId ref User",
        },
      },
      studytasks: {
        description: "Tarefas To-Do de estudo",
        xpPerItem: 10,
        fields: {
          title: "String",
          description: "String",
          completed: "Boolean",
          completedAt: "Date",
          priority: "low | medium | high",
          xpReward: "Number",
          userId: "ObjectId ref User",
        },
      },
    },
  },

  /**
   * ========== PROBLEMAS ==========
   * Coleção: devproblems
   * Rota API: /api/problems
   * - GET /: Lista problemas do usuário
   * - POST /: Registra problema (+20 XP)
   * - DELETE /:id: Remove problema
   */
  problems: {
    collection: "devproblems",
    section: "Problemas",
    fields: {
      error: "String",
      solution: "String",
      technology: "String",
      difficulty: "easy | medium | hard",
      timeToSolve: "Number (minutos)",
      userId: "ObjectId ref User",
      createdAt: "Date",
      updatedAt: "Date",
    },
    xpPerItem: 20,
  },
};

/**
 * Tabela de XP por atividade
 */
export const XP_TABLE = {
  study: 10, // sessão de estudo
  task: 10, // tarefa completada
  project: 30,
  problem: 20,
};
