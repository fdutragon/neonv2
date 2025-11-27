import { Outlet, Link, useLocation } from 'react-router-dom'
import { Menu, X, MessageCircle, MapPin, Phone, Mail, Instagram } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-md shadow-2xl border-b border-gray-700/50' 
          : 'bg-gray-900 shadow-lg border-b border-gray-800'
      }`}>
        {/* Brilho sutil no topo */}
        <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent transition-opacity duration-500 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-500 ${
            isScrolled ? 'py-2' : 'py-3'
          }`}>
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <img 
                src="/logo.png" 
                alt="Neon Multimarcas" 
                className={`w-auto transition-all duration-500 group-hover:scale-105 ${
                  isScrolled ? 'h-10' : 'h-11'
                }`} 
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`relative px-4 py-2 font-medium transition-all duration-300 rounded-lg group ${
                  isActive('/') 
                    ? 'text-yellow-400' 
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
                }`}
              >
                <span className="relative z-10">Início</span>
                {isActive('/') && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></span>
                )}
              </Link>
              <Link
                to="/search"
                className={`relative px-4 py-2 font-medium transition-all duration-300 rounded-lg group ${
                  isActive('/search') 
                    ? 'text-yellow-400' 
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
                }`}
              >
                <span className="relative z-10">Buscar Veículos</span>
                {isActive('/search') && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></span>
                )}
              </Link>
            </div>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/5511942618407"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg shadow-lg shadow-green-600/20 hover:shadow-green-600/40 transition-all duration-300 hover:scale-105 ${
                isScrolled ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
              }`}
            >
              <MessageCircle className={`${isScrolled ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
              <span>WhatsApp</span>
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50 transition-all duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  isActive('/') 
                    ? 'text-yellow-400 bg-gray-700' 
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link
                to="/search"
                className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  isActive('/search') 
                    ? 'text-yellow-400 bg-gray-700' 
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Buscar Veículos
              </Link>
              <Link
                to="/admin/login"
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-yellow-400 hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Área Administrativa
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-[60px]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
        {/* Efeito de brilho sutil no fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info com Logo */}
            <div>
              <div className="mb-6 group">
                <img 
                  src="/logo.png" 
                  alt="Neon Multimarcas" 
                  className="h-12 w-auto transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sua concessionária premium de veículos. Qualidade, confiança e excelência em cada veículo.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-yellow-400">Links Rápidos</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Início
                  </Link>
                </li>
                <li>
                  <Link to="/search" className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Buscar Veículos
                  </Link>
                </li>
                <li>
                  <Link to="/admin/login" className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Área Administrativa
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-yellow-400">Contato</h3>
              <div className="space-y-3 text-sm">
                <a 
                  href="https://maps.google.com/?q=Jorge+Caixe+323+Jardim+Nomura+Cotia+SP" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-400 hover:text-yellow-400 transition-colors group"
                >
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Jorge Caixe, 323 - Jardim Nomura - Cotia/SP</span>
                </a>
                <a 
                  href="tel:+5511942618407" 
                  className="flex items-center gap-3 text-gray-400 hover:text-yellow-400 transition-colors group"
                >
                  <Phone className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>11 94261-8407</span>
                </a>
                <a 
                  href="mailto:contato@neonmultimarcas.com" 
                  className="flex items-center gap-3 text-gray-400 hover:text-yellow-400 transition-colors group"
                >
                  <Mail className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>contato@neonmultimarcas.com</span>
                </a>
                <a 
                  href="https://instagram.com/neon_multimarcas" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-gray-400 hover:text-pink-400 transition-colors group"
                >
                  <Instagram className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>@neon_multimarcas</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2025 Neon Multimarcas. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/5511942618407"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        aria-label="WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  )
}
