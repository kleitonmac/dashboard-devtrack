# 🔌 DevTrack - API Integration Guide

Documentação técnica para integração entre Frontend DevTrack e Backend

---

## 📊 Visão Geral

```
┌─────────────┐        ┌──────────────┐        ┌─────────────┐
│   Browser   │ ◄─────► │    Vite Dev   │        │   Backend   │
│  (Port 5174)│        │   Server      │ ◄─────► │ (Port 3000) │
└─────────────┘        └──────────────┘        └─────────────┘
                              ▲
                              │
                         Axios + JWT
                         Interceptors
```

---

## 🔐 Autenticação & JWT

### Como Funciona

1. **Login/Registro**: Usuário envia credenciais
2. **Token Recebido**: Backend retorna JWT token
3. **Armazenamento**: Token salvo em `localStorage.authToken`
4. **Interceptor**: Axios adiciona `Authorization: Bearer {token}` automaticamente
5. **Requisições**: Todas as requisições incluem o token
6. **Validação**: Backend valida token a cada requisição
7. **Expiração**: Token expirado → 401 → Redirecionamento para login

### Estrutura do Token

```javascript
// Token JWT típico
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "dev@example.com",
    "iat": 1704067200,
    "exp": 1704153600
  },
  "signature": "hash-aqui"
}
```

### Armazenamento

```javascript
// localStorage
localStorage.authToken = "eyJhbGciOiJIUzI1NiIs...";
localStorage.user = JSON.stringify({
  id: "507f1f77bcf86cd799439011",
  name: "João Dev",
  email: "joao@dev.com",
  xp: 1500,
  level: 2
});
```

---

## 🔌 Configuração da API

### Arquivo: `/src/services/api.js`

```javascript
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Adiciona token a cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Trata erros 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 📡 Endpoints Documentados

### ✅ Autenticação (`/api/auth`)

#### Register (Criar Conta)
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Dev",
  "email": "joao@dev.com",
  "password": "senha123"
}
```

**Response (201)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "João Dev",
    "email": "joao@dev.com",
    "xp": 0,
    "level": 1,
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@dev.com",
  "password": "senha123"
}
```

**Response (200)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "João Dev",
    "email": "joao@dev.com",
    "xp": 1500,
    "level": 2
  }
}
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "João Dev Silva",
  "email": "joao.silva@dev.com"
}
```

**Response (200)**:
```json
{
  "success": true,
  "user": { ... }
}
```

#### Change Password
```http
POST /api/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "senha123",
  "newPassword": "newSenha456"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Senha alterada com sucesso"
}
```

---

### 🚀 Projetos (`/api/projects`)

#### Listar Todos
```http
GET /api/projects
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "success": true,
  "projects": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "E-commerce React",
      "stack": ["React", "Node.js", "MongoDB"],
      "difficulty": "medium",
      "timeSpent": 40,
      "learningNotes": "Aprendi sobre Redux e API RESTful",
      "userId": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-05T15:30:00Z"
    }
  ]
}
```

#### Obter Um Projeto
```http
GET /api/projects/:id
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "success": true,
  "project": { ... }
}
```

#### Criar Projeto
```http
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Chat App Real-time",
  "stack": ["React", "Socket.io", "Express"],
  "difficulty": "hard",
  "timeSpent": 60,
  "learningNotes": "WebSockets, real-time updates"
}
```

**Response (201)**:
```json
{
  "success": true,
  "project": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Chat App Real-time",
    "stack": ["React", "Socket.io", "Express"],
    "difficulty": "hard",
    "timeSpent": 60,
    "learningNotes": "WebSockets, real-time updates",
    "userId": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-10T10:00:00Z"
  }
}
```

#### Atualizar Projeto
```http
PUT /api/projects/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "timeSpent": 75,
  "learningNotes": "Adicionei recursos de notificação"
}
```

**Response (200)**:
```json
{
  "success": true,
  "project": { ... }
}
```

#### Deletar Projeto
```http
DELETE /api/projects/:id
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Projeto deletado com sucesso"
}
```

---

### 🐛 Problemas (`/api/problems`)

#### Listar Todos
```http
GET /api/problems
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "success": true,
  "problems": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "error": "TypeError: Cannot read property 'map' of undefined",
      "technology": "React",
      "difficulty": "easy",
      "timeToSolve": 15,
      "solution": "Validar se o array existe antes de usar map()",
      "userId": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-08T14:00:00Z"
    }
  ]
}
```

#### Criar Problema
```http
POST /api/problems
Authorization: Bearer {token}
Content-Type: application/json

{
  "error": "CORS policy: No 'Access-Control-Allow-Origin' header",
  "technology": "Node.js",
  "difficulty": "medium",
  "timeToSolve": 30,
  "solution": "Adicionar CORS middleware no Express"
}
```

**Response (201)**:
```json
{
  "success": true,
  "problem": {
    "_id": "507f1f77bcf86cd799439021",
    ...
  }
}
```

#### Deletar Problema
```http
DELETE /api/problems/:id
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Problema deletado"
}
```

---

### 📚 Sessões de Estudo (`/api/study`)

#### Listar Todas
```http
GET /api/study
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "success": true,
  "sessions": [
    {
      "_id": "507f1f77bcf86cd799439030",
      "technology": "React Hooks",
      "duration": 120,
      "focus": 85,
      "productivity": 80,
      "notes": "Aprendi useEffect, useState, useContext",
      "userId": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-12T09:00:00Z"
    }
  ]
}
```

#### Criar Sessão
```http
POST /api/study
Authorization: Bearer {token}
Content-Type: application/json

{
  "technology": "TypeScript Avançado",
  "duration": 90,
  "focus": 75,
  "productivity": 70,
  "notes": "Generics, tipos complexos, decorators"
}
```

**Response (201)**:
```json
{
  "success": true,
  "session": {
    "_id": "507f1f77bcf86cd799439031",
    ...
  }
}
```

#### Deletar Sessão
```http
DELETE /api/study/:id
Authorization: Bearer {token}
```

---

### 📊 Dashboard (`/api/dashboard`)

#### Obter Estatísticas
```http
GET /api/dashboard/stats
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "success": true,
  "stats": {
    "totalXP": 3500,
    "currentLevel": 3,
    "projectsCount": 8,
    "problemsCount": 15,
    "studyHours": 42.5,
    "currentStreak": 7
  }
}
```

#### Obter Analytics
```http
GET /api/dashboard/analytics?period=week
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "success": true,
  "analytics": {
    "period": "week",
    "xpByDay": [
      { "date": "2024-01-08", "xp": 100 },
      { "date": "2024-01-09", "xp": 150 },
      ...
    ],
    "topTechnologies": [
      { "technology": "React", "hours": 20 },
      { "technology": "Node.js", "hours": 15 },
      ...
    ]
  }
}
```

---

## 🚨 Códigos de Erro

### HTTP Status Codes

| Código | Significado | Ação |
|--------|-------------|------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado |
| 400 | Bad Request | Dados inválidos |
| 401 | Unauthorized | Token ausente/inválido |
| 403 | Forbidden | Acesso negado |
| 404 | Not Found | Recurso não encontrado |
| 500 | Server Error | Erro no servidor |

### Resposta de Erro

```json
{
  "success": false,
  "error": "Email já cadastrado",
  "code": "EMAIL_EXISTS"
}
```

### Tratamento no Frontend

```javascript
try {
  const response = await api.post('/projects', projectData);
  console.log('Sucesso:', response.data);
} catch (error) {
  if (error.response?.status === 400) {
    console.error('Dados inválidos:', error.response.data.error);
  } else if (error.response?.status === 401) {
    console.error('Não autenticado');
    // Redirecionar para login
  } else {
    console.error('Erro na requisição:', error.message);
  }
}
```

---

## 🔄 Fluxo de Requisições

### Exemplo: Criar um Projeto

```
1. Frontend (React)
   ↓
   const data = {
     name: "E-commerce",
     stack: ["React", "Node.js"],
     difficulty: "medium",
     timeSpent: 40,
     learningNotes: "..."
   }

2. API Service (Axios)
   ↓
   POST /api/projects
   Headers: Authorization: Bearer {token}
   Body: data

3. Interceptor Request
   ↓
   Adiciona token ao header

4. Backend (Express)
   ↓
   Valida token
   Validaantes dados
   Salva no MongoDB
   Retorna projeto criado

5. Interceptor Response
   ↓
   Processa resposta
   Verifica status 401/erro

6. Frontend (React)
   ↓
   Atualiza estado
   Mostra projeto na lista
   Exibe mensagem de sucesso
```

---

## 🧪 Testando Endpoints com Insomnia/Postman

### Setup

1. **Crie collection**: DevTrack API
2. **Configure base URL**: `http://localhost:3000/api`
3. **Variável de ambiente**: `token` = seu JWT

### Exemplo: Listar Projetos

```
Method: GET
URL: {{base_url}}/projects
Headers: 
  - Authorization: Bearer {{token}}

Clique em Send
```

### Exemplo: Criar Projeto

```
Method: POST
URL: {{base_url}}/projects
Headers:
  - Authorization: Bearer {{token}}
  - Content-Type: application/json

Body (raw JSON):
{
  "name": "Nova App",
  "stack": ["React", "Express"],
  "difficulty": "hard",
  "timeSpent": 50,
  "learningNotes": "Aprendi sobre..."
}

Clique em Send
```

---

## 🔒 Segurança

### CORS (Cross-Origin Resource Sharing)

Backend deve permitir requisições do frontend:

```javascript
// Backend - Express
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));
```

### Armazenamento de Tokens

✅ **Certo**: localStorage com expiração
❌ **Errado**: Token em cookies sem HttpOnly
❌ **Errado**: Token em variável global

### Renovação de Token

Quando token expira:

1. Axios interceptor captura 401
2. Limpa localStorage
3. Redireciona para /login
4. Usuário faz login novamente

---

## 📝 Checklist de Integração

- [ ] Backend rodando em `localhost:3000`
- [ ] CORS configurado corretamente
- [ ] `VITE_API_URL` definido no .env.local
- [ ] Endpoints testados com Postman/Insomnia
- [ ] JWT token gerado corretamente
- [ ] Interceptor de requisição funcionando
- [ ] Interceptor de resposta (401) funcionando
- [ ] localStorage salvando token corretamente
- [ ] Rotas protegidas redirecionando sem token
- [ ] Dados sendo exibidos corretamente

---

## 🐛 Debug & Troubleshooting

### Ver Requisições no DevTools

```
F12 → Network → Filtrar por XHR/Fetch
```

### Ver Token Armazenado

```javascript
// No Console do DevTools
console.log(localStorage.getItem('authToken'));
console.log(JSON.parse(localStorage.getItem('user')));
```

### Ver Headers Enviados

```
DevTools → Network → Clique na requisição → Headers
Procure por: Authorization: Bearer ...
```

### Verificar CORS

Se erro de CORS aparece:
1. Abra DevTools → Console
2. Procure por `Access-Control-Allow-Origin`
3. Configure CORS no backend

---

## 📚 Recursos Adicionais

- [Axios Documentation](https://axios-http.com/docs/intro)
- [JWT.io](https://jwt.io) - Decodifique tokens
- [REST API Best Practices](https://restfulapi.net)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

*Última atualização: 2024*
