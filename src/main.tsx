import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Registra o service worker com auto-update
registerSW({
  onNeedRefresh() {
    if (confirm('Nova versão disponível! Recarregar?')) {
      window.location.reload()
    }
  },
  onOfflineReady() {
    console.log('App pronto para funcionar offline')
  },
})
