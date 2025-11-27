import { Smartphone } from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'

export function PWABadge() {
  const { isInstalled } = usePWA()

  if (!isInstalled) return null

  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
      <Smartphone className="w-3 h-3" />
      <span>App Instalado</span>
    </div>
  )
}
