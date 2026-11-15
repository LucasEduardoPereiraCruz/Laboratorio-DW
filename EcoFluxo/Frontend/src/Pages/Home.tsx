import { Link } from 'react-router-dom';

export default function Home({ user }: { user: any }) {
  const isGestor = ((user?.perfil || user?.role)?.toUpperCase() === 'GESTOR');

  
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center justify-center text-center w-full">
      <h1 className="text-5xl font-black text-emerald-900 leading-tight">
        Bem-vindo ao <span className="text-emerald-600 italic">EcoFluxo</span>
      </h1>
      <p className="text-xl text-emerald-900 font-medium max-w-2xl mt-4">
        Gestão inteligente de resíduos e monitoramento em tempo real para cidades mais sustentáveis.
      </p>

      {/* Se for Gestor, exibe os cards de acesso rápido aos Ecopontos e Lixeiras */}
      {isGestor && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-12">

          {/* Card Ecopontos */}
          <div className="bg-white border-2 border-emerald-100 rounded-3xl p-6 shadow-xs flex flex-col items-center justify-between text-left">
            <div className="w-full">
              <h3 className="text-xl font-bold text-emerald-900">Gerenciar Ecopontos</h3>
              <p className="text-gray-600 text-sm mt-2">Visualize os ecopontos cadastrados ou cadastre um novo ponto no sistema.</p>
            </div>
            <div className="flex gap-3 mt-6 w-full">
              <Link
                to="/ecopontos"
                className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold py-2.5 rounded-xl text-sm transition text-center no-underline"
              >
                Listar
              </Link>
              <Link
                to="/ecopontos/cadastrar"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-sm transition text-center no-underline"
              >
                Cadastrar
              </Link>
            </div>
          </div>

          {/* Card Lixeiras */}
          <div className="bg-white border-2 border-emerald-100 rounded-3xl p-6 shadow-xs flex flex-col items-center justify-between text-left">
            <div className="w-full">
              <h3 className="text-xl font-bold text-emerald-900">Gerenciar Lixeiras</h3>
              <p className="text-gray-600 text-sm mt-2">Monitore as lixeiras ativas ou adicione novos recipientes e sensores.</p>
            </div>
            <div className="flex gap-3 mt-6 w-full">
              <Link
                to="/lixeiras"
                className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold py-2.5 rounded-xl text-sm transition text-center no-underline"
              >
                Listar
              </Link>
              <Link
                to="/lixeiras/cadastrar"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-sm transition text-center no-underline"
              >
                Cadastrar
              </Link>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}