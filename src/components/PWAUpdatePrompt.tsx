import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { RefreshCw, X } from 'lucide-react'

export function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false)

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  useEffect(() => {
    if (needRefresh) {
      setShowPrompt(true)
    }
  }, [needRefresh])

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-3">
        <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Nova versão disponível
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Atualize para obter as últimas melhorias
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => updateServiceWorker(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
            >
              Atualizar
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded transition-colors"
            >
              Depois
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
