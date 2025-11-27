import { Download, X } from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'
import { useState } from 'react'

export function InstallPWA() {
  const { canInstall, install } = usePWA()
  const [dismissed, setDismissed] = useState(false)

  if (!canInstall || dismissed) return null

  const handleInstall = async () => {
    const success = await install()
    if (success) {
      setDismissed(true)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Download className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Instalar App</h3>
          <p className="text-sm text-blue-100 mb-3">
            Instale o app para acesso rápido e uso offline
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="px-3 py-1.5 bg-white text-blue-600 text-sm font-medium rounded hover:bg-blue-50 transition-colors"
            >
              Instalar
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="px-3 py-1.5 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium rounded transition-colors"
            >
              Agora não
            </button>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-blue-200 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
