import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

export default function Ecopontos() {
  const [ecopontos, setEcopontos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/ecoponto/getEcopontos")
      .then((res) => setEcopontos(res.data))
      .catch((err) => console.error("Erro ao buscar ecopontos:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-emerald-900">Ecopontos Cadastrados</h1>
          <p className="text-emerald-600 font-medium text-sm mt-1">Gerencie os pontos de coleta do EcoFluxo</p>
        </div>
        <Link 
          to="/ecopontos/cadastrar"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-xs transition"
        >
          + Cadastrar Ecoponto
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-emerald-700 font-medium py-10">Carregando ecopontos...</p>
      ) : ecopontos.length === 0 ? (
        <div className="bg-white border-2 border-emerald-100 rounded-2xl p-8 text-center">
          <p className="text-emerald-800 font-medium">Nenhum ecoponto cadastrado até o momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ecopontos.map((eco) => (
            <div key={eco.id} className="bg-white border-2 border-emerald-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-emerald-900">{eco.nome}</h3>
                  {eco.nota !== null && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                      ⭐ {eco.nota}
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-emerald-600 mt-1">
                  Lat: {eco.latitude} | Long: {eco.longitude}
                </p>
                <p className="text-gray-600 text-sm mt-3">{eco.descricao || "Sem descrição informada."}</p>
                
                <div className="mt-4 text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p><strong>Endereço:</strong> {eco.logradouro ? `${eco.logradouro}, ${eco.numero || 'S/N'} - ${eco.bairro || ''}` : 'Não informado'}</p>
                  <p><strong>Cidade/UF:</strong> {eco.cidade || '-'} / {eco.uf || '-'}</p>
                  <p><strong>CEP:</strong> {eco.cep || 'Não informado'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}