# 🎨 DevTrack - Visual Component Library

## 🎯 Componentes Disponíveis

```
DevTrack UI Components
├── Button
│   ├── Variant: primary (azul)
│   ├── Variant: secondary (roxo)  
│   ├── Variant: outline (cinza)
│   ├── Variant: ghost (sem fundo)
│   ├── Variant: danger (vermelho)
│   ├── Size: sm (pequeno)
│   ├── Size: md (normal)
│   ├── Size: lg (grande)
│   ├── States: loading, disabled, fullWidth
│   └── Features: icon suporte
│
├── Input
│   ├── Type: text, email, password
│   ├── Features: label, placeholder, helpText, error
│   ├── Icon suporte
│   ├── Validação visual
│   └── States: disabled, focused, error
│
├── Card (Estrutura)
│   ├── CardHeader (title, subtitle, action)
│   ├── CardBody (conteúdo)
│   ├── CardFooter (ações)
│   ├── States: hoverable, interactive
│   └── Espaçamento automático
│
├── Badge
│   ├── Variant: primary, success, warning, danger, secondary
│   ├── Size: sm, md, lg
│   ├── Icon suporte
│   └── Color-coded
│
├── Alert
│   ├── Variant: success, warning, danger, info
│   ├── Features: title, description, closeable
│   ├── Icons automáticos
│   └── Callback onClose
│
├── Dialog
│   ├── Radix AlertDialog base
│   ├── Features: title, description, trigger
│   ├── Estados: confirmText, cancelText, isDestructive
│   └── Async: isLoading support
│
└── Loading
    ├── Spinner animado
    ├── Size: sm, md, lg
    ├── Message suporte
    └── Mode: inline ou fullScreen
```

---

## 🎨 Paleta de Cores Completa

### Brand Colors
```
┌─────────────────────────────────────────┐
│ PRIMARY (Sky Blue) - Ações principais    │
├─────────────────────────────────────────┤
│ 500: #0ea5e9 ███████████ (Principal)    │
│ 600: #0284c7 ██████████░ (Hover)        │
│ 700: #0369a1 █████████░░ (Ativo)        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ SECONDARY (Purple) - Complementar       │
├─────────────────────────────────────────┤
│ 500: #8b5cf6 ███████████ (Principal)    │
│ 600: #7c3aed ██████████░ (Hover)        │
│ 700: #6d28d9 █████████░░ (Ativo)        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STATUS COLORS - Feedback                │
├─────────────────────────────────────────┤
│ Success:  #22c55e ██ (Verde)             │
│ Warning:  #f59e0b ██ (Amarelo)           │
│ Danger:   #ef4444 ██ (Vermelho)          │
│ Info:     #0ea5e9 ██ (Azul)              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ NEUTRAL - Backgrounds & Text            │
├─────────────────────────────────────────┤
│ Dark 50:   #f9fafb (Background claro)   │
│ Dark 100:  #f3f4f6 (Hover state)        │
│ Dark 200:  #e5e7eb (Border)             │
│ Dark 500:  #6b7280 (Muted text)         │
│ Dark 900:  #111827 (Text principal)     │
└─────────────────────────────────────────┘
```

---

## 📐 Espaçamento (Spacing Scale)

```
xs  = 0.25rem = 4px    ▌
sm  = 0.5rem  = 8px    ▌▌
md  = 1rem    = 16px   ▌▌▌▌
lg  = 1.5rem  = 24px   ▌▌▌▌▌▌
xl  = 2rem    = 32px   ▌▌▌▌▌▌▌▌
2xl = 2.5rem  = 40px   ▌▌▌▌▌▌▌▌▌▌
3xl = 3rem    = 48px   ▌▌▌▌▌▌▌▌▌▌▌▌
4xl = 4rem    = 64px   ▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌
```

Exemplos:
```html
<div className="p-lg">      <!-- padding: 24px -->
<div className="m-md">      <!-- margin: 16px -->
<div className="gap-lg">    <!-- gap: 24px -->
<div className="space-y-md"><!-- y-gap: 16px -->
```

---

## 🔤 Tipografia

### Tamanhos
```
xs   = 0.75rem = 12px  ▌ Pequeno
sm   = 0.875rem = 14px ▌▌ Pequeno
base = 1rem = 16px     ▌▌▌ Normal
lg   = 1.125rem = 18px ▌▌▌▌ Grande
xl   = 1.25rem = 20px  ▌▌▌▌▌ Maior
2xl  = 1.5rem = 24px   ▌▌▌▌▌▌ Grande Título
3xl  = 1.875rem = 30px ▌▌▌▌▌▌▌ Subtítulo
4xl  = 2.25rem = 36px  ▌▌▌▌▌▌▌▌ Título
5xl  = 3rem = 48px     ▌▌▌▌▌▌▌▌▌ Principal
```

### Pesos
```
normal    = 400 - Padrão
medium    = 500 - Ênfase
semibold  = 600 - Forte
bold      = 700 - Muito forte
```

---

## 🎯 Responsive Grid

### Layout Automático
```
Mobile (xs-sm):     Grid de 1 coluna
Tablet (md):        Grid de 2 colunas  
Desktop (lg):       Grid de 3 colunas
Wide (xl-2xl):      Grid de 4 colunas

Classe: grid-responsive (configurado em Tailwind)
Gap: sempre lg (24px)
```

Exemplo:
```jsx
<div className="grid-responsive">
  <Card>...</Card>   <!-- 1 col em mobile -->
  <Card>...</Card>   <!-- 2 cols em tablet -->
  <Card>...</Card>   <!-- 3 cols em desktop -->
  <Card>...</Card>   <!-- 4 cols em wide -->
</div>
```

---

## ✨ Efeitos & Animações

### Sombras
```
xs: 0 1px 2px 0 rgb(0 0 0 / 0.05)         ▪
sm: 0 1px 3px 0 rgb(0 0 0 / 0.1)          ▪▪
md: 0 4px 6px -1px rgb(0 0 0 / 0.1)       ▪▪▪
lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)     ▪▪▪▪
xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)     ▪▪▪▪▪
2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)  ▪▪▪▪▪▪
```

### Animações
```
fadeIn:      Fade in (0.3s)
slideIn:     Slide in from bottom (0.3s)
slideInDown: Slide in from top (customizado)
slideInUp:   Slide in from bottom (customizado)
pulse:       Pulse subtle (2s infinito)
spin:        Spin/rotate (infinito)
bounce:      Bounce (infinito)
```

### Transições
```
duration-200: 200ms (rápido)
duration-300: 300ms (normal)
duration-400: 400ms (lento)

ease-in, ease-out, ease-in-out disponíveis
```

---

## 📱 Componentes em Ação

### Login Page
```
┌────────────────────────────────────┐
│      🚀 DevTrack (Header)          │
│  Rastreie sua evolução             │
├────────────────────────────────────┤
│  [Input] Email (icon: 📧)          │ ← Component
│  [Input] Password (icon: 🔐)       │ ← Component
│  ─────────────────────────────────  │
│  [Button] Entrar (primary, lg)     │ ← Component
│  [Button] Criar Conta (outline)    │ ← Component
│                                     │
│  📝 Admin Demo Creds (Alert)       │ ← Component
└────────────────────────────────────┘
```

### Dashboard Page
```
┌─────────────────────────────────────────┐
│ DevTrack (Navbar)                       │
├─────────────────────────────────────────┤
│ 📊 Dashboard                            │
│ Bem-vindo, João!                        │
├─────────────────────────────────────────┤
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌────┐  │
│ │⭐ Nv10│ │🎯 XP  │ │🚀 5P  │ │📚 5h│  │ ← Cards
│ │       │ │32/100 │ │       │ │    │  │
│ └───────┘ └───────┘ └───────┘ └────┘  │
├─────────────────────────────────────────┤
│ 📈 Análise Semanal                      │
│ ┌───────────────────┐ ┌───────────────┐│
│ │ XP por Dia (Graph)│ │ Tecnologias   ││ ← Cards
│ │                   │ │ - React (5)   ││
│ │                   │ │ - Node (3)    ││
│ └───────────────────┘ └───────────────┘│
├─────────────────────────────────────────┤
│ 🚀 Últimos Projetos │ 📚 Últimas Sess │
│ ┌─────────────────┐ │ ┌──────────────┐│
│ │ Project 1 [Med]│ │ │ React 120min ││ ← Cards
│ │ React, Node    │ │ │ 80% foco     ││
│ └─────────────────┘ │ └──────────────┘│
│                     │                   │
│ [Badges] Tech tags  │ [Badges] Status │
└─────────────────────────────────────────┘
```

---

## 🎯 Estados de Componentes

### Button States
```
Default:    [Button]
Hover:      [Button] (hover:bg-lighter)
Active:     [Button] (pressed)
Disabled:   [Button] (disabled, opacity-50)
Loading:    [Button] (spinner icon)
```

### Input States
```
Default:    [________]
Focused:    [________] (border-primary, ring)
Error:      [________] (border-danger, error msg)
Disabled:   [________] (disabled, opacity-50)
Success:    [✓_____] (border-success)
```

### Card States
```
Default:    ┌─────────┐
            │ Content │
            └─────────┘

Hover:      ┌─────────┐ (shadow-lg, -translate-y)
            │ Content │
            └─────────┘

Interactive:┌─────────┐ (cursor-pointer)
            │ Content │
            └─────────┘
```

---

## 🚀 Exemplo Prático: Formulário Completo

```jsx
export function MyForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-50 px-lg">
      <Card className="w-full max-w-md">
        {/* Header */}
        <CardHeader 
          title="Criar Conta"
          subtitle="Bem-vindo ao DevTrack"
        />
        
        {/* Conteúdo */}
        <CardBody className="space-y-lg">
          <Alert variant="info" title="Dica" closeable />
          
          <Input 
            label="Nome"
            icon={<span>👤</span>}
            placeholder="Seu nome"
            fullWidth
          />
          
          <Input 
            label="Email"
            type="email"
            icon={<span>📧</span>}
            placeholder="seu@email.com"
            fullWidth
          />
          
          <Input 
            label="Senha"
            type="password"
            icon={<span>🔐</span>}
            helpText="Mínimo 6 caracteres"
            fullWidth
          />
          
          <Button variant="primary" fullWidth>
            Criar Conta
          </Button>
        </CardBody>
        
        {/* Footer */}
        <CardFooter>
          <p>Já tem conta? <a href="#">Fazer login</a></p>
        </CardFooter>
      </Card>
    </div>
  );
}
```

---

## 📊 Componentes Utilizados

| Página | Componentes | Variantes |
|--------|-----------|-----------|
| Login | Button, Input, Alert, Card | 5 |
| Register | Button, Input, Alert, Card | 5 |
| Navbar | Button, Badge, Dialog | 6 |
| Dashboard | Card, Badge, Loading | 8 |
| Profile | Card, Button, Badge | 5 |

**Total: 29 componentes em uso**

---

## 🎓 Padrões Utilizados

### Compound Components (Card)
```jsx
<Card>
  <CardHeader title="..." />
  <CardBody>...</CardBody>
  <CardFooter>...</CardFooter>
</Card>
```

### Variant Pattern (Button)
```jsx
<Button variant="primary" size="lg" />
<Button variant="secondary" size="md" />
<Button variant="outline" size="sm" />
```

### State Management (Input)
```jsx
<Input 
  value={value}
  onChange={(e) => setValue(e.target.value)}
  error={errors.email}
/>
```

### Radix UI Primitives (Dialog)
```jsx
<Dialog
  trigger={<Button>Open</Button>}
  onConfirm={handleAction}
/>
```

---

## ✅ Checklist de Uso

Ao criar uma nova página:

- [ ] Importar componentes de `@/components/ui`
- [ ] Usar classes Tailwind para layout
- [ ] Respeitar espaçamento (gap-lg, p-lg, etc)
- [ ] Usar cores do design system
- [ ] Adicionar estados de loading
- [ ] Validar inputs
- [ ] Testar responsividade
- [ ] Adicionar feedback visual
- [ ] Documentar componentes customizados

---

## 🔗 Referências Rápidas

### Imports Comuns
```tsx
import { Button, Input, Card, Badge, Alert } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/Layout';
```

### Tailwind Shortcuts
```
p-lg    = padding: 24px
gap-lg  = gap: 24px
w-full  = width: 100%
flex    = display: flex
grid    = display: grid
space-y-md = y-gap: 16px
```

### Breakpoints
```
md:grid-cols-2      = 2 colunas em tablet
lg:grid-cols-3      = 3 colunas em desktop
hidden md:block      = Esconder mobile, mostrar desktop
```

---

**✨ Parabéns! Você possui um sistema de design completo e profissional!**

Para mais exemplos, veja `COMPONENTES_GUIDE.md`
