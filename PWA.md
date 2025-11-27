# PWA - Progressive Web App

## 🚀 Funcionalidades Implementadas

### ✅ Instalação
- Botão de instalação automático para navegadores compatíveis
- Suporte para iOS (Add to Home Screen)
- Suporte para Android e Desktop (Chrome, Edge, etc)

### ✅ Offline First
- Cache inteligente de assets estáticos
- Cache de requisições da API Supabase (24h)
- Cache de dados da FIPE (7 dias)
- Indicador visual quando offline
- Funcionalidade básica disponível offline

### ✅ Atualizações Automáticas
- Notificação quando nova versão está disponível
- Atualização com um clique
- Service Worker com auto-update

### ✅ Otimizações
- Manifest completo com ícones e screenshots
- Meta tags para iOS e Android
- Shortcuts para acesso rápido
- Tema personalizado
- Robots.txt configurado

## 📱 Como Instalar

### Android (Chrome/Edge)
1. Acesse o site
2. Clique no banner "Instalar App" ou
3. Menu → "Adicionar à tela inicial"

### iOS (Safari)
1. Acesse o site
2. Toque no botão de compartilhar
3. Selecione "Adicionar à Tela de Início"

### Desktop (Chrome/Edge)
1. Acesse o site
2. Clique no ícone de instalação na barra de endereço ou
3. Menu → "Instalar Neon Multimarcas"

## 🛠️ Tecnologias

- **vite-plugin-pwa**: Geração automática do service worker
- **Workbox**: Estratégias de cache avançadas
- **React Hooks**: Gerenciamento de estado PWA
- **Tailwind CSS**: Componentes de UI responsivos

## 📦 Build

```bash
npm run build
```

O build gera automaticamente:
- `dist/sw.js` - Service Worker
- `dist/manifest.webmanifest` - Manifest do PWA
- `dist/workbox-*.js` - Runtime do Workbox

## 🧪 Teste Local

```bash
npm run build
npm run preview
```

Acesse `http://localhost:4173` e teste:
1. Instalação do PWA
2. Modo offline (DevTools → Network → Offline)
3. Atualização automática (faça um novo build)

## 📊 Lighthouse Score

Execute o Lighthouse no Chrome DevTools para verificar:
- PWA: 100/100
- Performance: Otimizado
- Accessibility: Otimizado
- Best Practices: Otimizado
- SEO: Otimizado

## 🔧 Configuração

### vite.config.ts
- Estratégias de cache configuradas
- Assets incluídos automaticamente
- Workbox com runtime caching

### Manifest
- Ícones: 192x192 e 512x512
- Shortcuts para busca e admin
- Tema e cores personalizadas
- Orientação portrait

## 📝 Componentes PWA

### PWAUpdatePrompt
Notifica usuário sobre atualizações disponíveis

### InstallPWA
Banner de instalação do app

### OfflineIndicator
Indicador visual de status offline

### usePWA Hook
- `isInstalled`: Verifica se está instalado
- `canInstall`: Verifica se pode instalar
- `install()`: Dispara instalação
- `isOnline`: Status da conexão

## 🌐 Deploy

O PWA funciona automaticamente em produção. Certifique-se de:
- HTTPS habilitado (obrigatório para PWA)
- Headers corretos para service worker
- Manifest acessível

## 📱 Recursos Nativos

- Splash screen automática
- Ícone na home screen
- Modo standalone (sem barra do navegador)
- Notificações de atualização
- Funcionamento offline
- Cache inteligente
