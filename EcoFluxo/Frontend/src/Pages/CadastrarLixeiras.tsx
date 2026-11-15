import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

export default function CadastrarLixeira() {
  const [uuidSensor, setUuidSensor] = useState("");
  const [tipo, setTipo] = useState("PLASTICO");
  const [volumeMax, setVolumeMax] = useState("");
  const [nivelCheio, setNivelCheio] = useState("");
  const [ecopontoId, setEcopontoId] = useState("");
  const [ecopontos, setEcopontos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/ecoponto/getEcopontos")
      .then((res) => setEcopontos(res.data))
      .catch((err) => console.error("Erro ao carregar ecopontos:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/lixeira/createLixeira", {
        uuid_sensor: uuidSensor,
        tipo,
        volume_max: Number(volumeMax),
        nivel_cheio: Number(nivelCheio),
        ecoponto_id: Number(ecopontoId)
      });
      alert("Lixeira cadastrada com sucesso!");
      navigate("/lixeiras");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao cadastrar lixeira.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10 w-full">
      <Link to="/lixeiras" className="text-xs font-bold text-emerald-700 hover:text-emerald-500 mb-4 inline-block">
        ← Voltar para Lixeiras
      </Link>
      <div className="bg-white border-2 border-emerald-100 rounded-3xl p-8 shadow-xs">
        <h2 className="text-2xl font-black text-emerald-900 mb-6">Cadastrar Nova Lixeira</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-emerald-900 mb-1">UUID do Sensor</label>
            <input type="text" value={uuidSensor} onChange={(e) => setUuidSensor(e.target.value)} required className="w-full px-4 py-2 rounded-xl border-2 border-emerald-100 bg-gray-50 focus:outline-none focus:border-emerald-500" placeholder="Ex: sensor-abc-123" />
          </div>
          <div>
            <label className="block text-sm font-bold text-emerald-900 mb-1">Tipo de Resíduo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-emerald-100 bg-gray-50 focus:outline-none focus:border-emerald-500">
              <option value="PLASTICO">Plástico</option>
              <option value="VIDRO">Vidro</option>
              <option value="PAPEL">Papel</option>
              <option value="METAL">Metal</option>
              <option value="ORGANICO">Orgânico</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-emerald-900 mb-1">Volume Máximo (L)</label>
              <input type="number" min="1" step="any" value={volumeMax} onChange={(e) => setVolumeMax(e.target.value)} onKeyDown={(e) => { if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault(); }} required className="w-full px-4 py-2 rounded-xl border-2 border-emerald-100 bg-gray-50 focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-emerald-900 mb-1">Nível Cheio (%)</label>
              <input type="number" min="0" max="100" step="any" value={nivelCheio} onChange={(e) => setNivelCheio(e.target.value)} onKeyDown={(e) => { if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault(); }} required className="w-full px-4 py-2 rounded-xl border-2 border-emerald-100 bg-gray-50 focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-emerald-900 mb-1">Vincular ao Ecoponto</label>
            <select value={ecopontoId} onChange={(e) => setEcopontoId(e.target.value)} required className="w-full px-4 py-2 rounded-xl border-2 border-emerald-100 bg-gray-50 focus:outline-none focus:border-emerald-500">
              <option value="">Selecione um Ecoponto</option>
              {ecopontos.map((eco) => (
                <option key={eco.id} value={eco.id}>{eco.nome} (ID: {eco.id})</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition">
            {loading ? "Salvando..." : "Salvar Lixeira"}
          </button>
        </form>
      </div>
    </div>
  );
}