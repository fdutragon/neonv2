import { Link } from 'react-router-dom'
import { Wrench, Home, Clock } from 'lucide-react'

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gray-800 p-8 rounded-full border border-yellow-400/30">
              <Wrench className="h-20 w-20 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Página em Manutenção
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-300 mb-8">
          Estamos trabalhando para melhorar sua experiência.
          <br />
          Voltaremos em breve!
        </p>

        {/* Info Box */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 text-yellow-400 mb-2">
            <Clock className="h-5 w-5" />
            <span className="font-semibold">Tempo estimado</span>
          </div>
          <p className="text-gray-300">
            A página estará disponível novamente em breve
          </p>
        </div>

        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-xl hover:bg-yellow-500 transition-all transform hover:scale-105"
        >
          <Home className="h-5 w-5" />
          Voltar para Home
        </Link>

        {/* Footer Note */}
        <p className="mt-8 text-sm text-gray-500">
          Desculpe pelo inconveniente. Agradecemos sua compreensão.
        </p>
      </div>
    </div>
  )
}
