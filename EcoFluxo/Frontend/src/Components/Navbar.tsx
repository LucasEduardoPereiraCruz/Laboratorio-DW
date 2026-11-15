import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }: any) {
  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-emerald-100 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between w-full">
        
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center no-underline">
            <img 
              src="/ecofluxo.png" 
              alt="EcoFluxo Logo" 
              className="h-18.75 w-auto block object-contain" 
            />
          </Link>
        </div>
        
        {/* Links Centrais / Ações Direita */}
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-6">
              

              {/* Links exclusivos para GESTOR (aceita perfil ou role) */}
              {((user.perfil || user.role)?.toUpperCase() === 'GESTOR') && (
                <div className="flex items-center gap-4">
                  <Link to="/ecopontos" className="text-emerald-800 font-semibold hover:text-emerald-600 transition">
                    Ecopontos
                  </Link>
                  <Link to="/lixeiras" className="text-emerald-800 font-semibold hover:text-emerald-600 transition">
                    Lixeiras
                  </Link>
                </div>
              )}

              {/* Link exclusivo para MORADOR */}
              {((user.perfil || user.role)?.toUpperCase() === 'MORADOR') && (
                <Link to="/mapa" className="text-emerald-800 font-semibold hover:text-emerald-600 transition">
                  Mapa
                </Link>
              )}

              {/* Saudação e Logout */}
              <div className="flex items-center gap-4 pl-4 border-l border-emerald-100 text-emerald-900 font-semibold">
                <span className="text-sm font-bold text-emerald-600">
                  Olá, {user.nome ? user.nome.split(' ')[0] : 'Usuário'}
                </span>
                <button 
                  onClick={onLogout} 
                  className="bg-transparent border-none cursor-pointer font-semibold text-emerald-800 hover:text-red-600 text-base transition"
                >
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="no-underline bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-xs transition"
            >
              Entrar
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}