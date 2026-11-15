import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

export default function Lixeiras() {
  const [lixeiras, setLixeiras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/lixeira/getLixeiras")
      .then((res) => setLixeiras(res.data))
      .catch((err) => console.error("Erro ao buscar lixeiras:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-emerald-900">Lixeiras Cadastradas</h1>
          <p className="text-emerald-600 font-medium text-sm mt-1">Monitoramento e controle de sensores</p>
        </div>
        <Link 
          to="/lixeiras/cadastrar"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-xs transition"
        >
          + Cadastrar Lixeira
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-emerald-700 font-medium py-10">Carregando lixeiras...</p>
      ) : lixeiras.length === 0 ? (
        <div className="bg-white border-2 border-emerald-100 rounded-2xl p-8 text-center">
          <p className="text-emerald-800 font-medium">Nenhuma lixeira cadastrada até o momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lixeiras.map((lix) => (
            <div key={lix.id} className="bg-white border-2 border-emerald-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {lix.tipo}
                </span>
                <h3 className="text-lg font-bold text-emerald-900 mt-3">Sensor: {lix.uuid_sensor}</h3>
                <p className="text-gray-600 text-sm mt-1">Volume Máximo: {lix.volume_max}L | Nível Cheio: {lix.nivel_cheio}%</p>
              </div>
              <div className="mt-6 pt-4 border-t border-emerald-50 text-xs text-emerald-700 font-semibold">
                Ecoponto Vinculado: {lix.ecoponto?.nome || "Não vinculado"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}