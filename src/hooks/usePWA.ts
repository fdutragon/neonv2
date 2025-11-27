import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePWA() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    // Verifica se está instalado
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isIOSStandalone = (window.navigator as any).standalone === true
      
      setIsInstalled(isStandalone || (isIOS && isIOSStandalone))
    }

    checkInstalled()

    // Captura o evento de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }

    // Monitora status online/offline
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const install = async () => {
    if (!installPrompt) return false

    try {
      await installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      
      if (outcome === 'accepted') {
        setInstallPrompt(null)
        setIsInstalled(true)
        return true
      }
      return false
    } catch (error) {
      console.error('Erro ao instalar PWA:', error)
      return false
    }
  }

  return {
    isInstalled,
    canInstall: !!installPrompt,
    install,
    isOnline,
  }
}
