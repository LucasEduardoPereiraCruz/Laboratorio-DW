import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

export default function CadastrarEcoponto() {
  const [nome, setNome] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [nota, setNota] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Pega o token de autenticação salvo no login
      const token = localStorage.getItem("token");

      await api.post("/ecoponto/createEcoponto", {
        nome,
        latitude,
        longitude,
        descricao,
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        uf,
        nota: nota !== "" ? Number(nota) : null
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Ecoponto cadastrado com sucesso!");
      navigate("/ecopontos");
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || "Erro ao cadastrar ecoponto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 w-full">
      <Link to="/ecopontos" className="text-xs font-bold text-emerald-700 hover:text-emerald-500 mb-4 inline-block">
        ← Voltar para Ecopontos
      </Link>
      <div className="bg-white border-2 border-emerald-100 rounded-3xl p-8 shadow-xs">
        <h2 className="text-2xl font-black text-emerald-900 mb-6">Cadastrar Novo Ecoponto</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-emerald-900 mb-1">Nome *</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full px-4 py-2 rounded-xl border-2 border-emerald-100 bg-gray-50 focus:outline-none focus:border-emerald-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-emerald-900 mb-1">Latitude *</label>
              <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} required className="w-full px-4 py-2 rounded-xl border-2 border-emerald-100 bg-gray-50 focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-emerald-900 mb-1">Longitude *</label>
              <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} required className="w-full px-4 py-2 rounded-xl border-2 border-emerald-100 bg-gray-50 focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-emerald-900 mb-1">CEP</label>
              <input type="text" value={cep} onChange={(e) => setCep(e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-emerald-100 bg-gray-50 focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-emerald-900 mb-1">Logradouro</label>
              <input type="text" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-emerald-100 bg-gray-50 focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-emerald-900 mb-1">Número</label>
              <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-emerald-100 bg-gray-50 focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-emerald-900 mb-1">Bairro</label>
              <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-emerald-100 bg-gray-50 focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-emerald-900 mb-1">Cidade</label>
              <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-emerald-100 bg-gray-50 focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-emerald-900 mb-1">UF</label>
              <input type="text" maxLength={2} value={uf} onChange={(e) => setUf(e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-emerald-100 bg-gray-50 focus:outline-none focus:border-emerald-500 uppercase" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-emerald-900 mb-1">Nota (0 a 5)</label>
              <input type="number" min="0" max="5" value={nota} onChange={(e) => setNota(e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-emerald-100 bg-gray-50 focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-emerald-900 mb-1">Descrição</label>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-emerald-100 bg-gray-50 focus:outline-none focus:border-emerald-500" rows={3}></textarea>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition">
            {loading ? "Salvando..." : "Salvar Ecoponto"}
          </button>
        </form>
      </div>
    </div>
  );
}