import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Chamada para a rota de login do backend (email e senha)
      await api.post("/login", { 
        email, 
        senha: password 
      });
      
      // Se o login/senha estiverem corretos, o backend envia o código por e-mail 
      // e redirecionamos para a tela de verificação 2FA, levando o e-mail junto.
      navigate("/verify-2fa", { state: { email } });
      
    } catch (err: any) {
      setError(err.response?.data?.message || "Credenciais inválidas ou erro no servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-2 px-2">
      <div className="w-full max-w-md bg-white rounded-3xl p-10 border-2 border-emerald-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-emerald-900">Bem-vindo</h2>
          <p className="text-emerald-600 font-medium mt-2">Conecte-se ao fluxo sustentável</p>
        </div>

        {/* Mensagem de Erro Dinâmica */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center font-bold">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Campo de E-mail */}
          <div>
            <label className="block text-sm font-bold text-emerald-900 mb-2 ml-1">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-2 rounded-2xl border-2 border-emerald-100 focus:border-emerald-500 focus:outline-none transition-all bg-gray-50"
              placeholder="exemplo@email.com"
              required
            />
          </div>

          {/* Campo de Senha */}
          <div>
            <label className="block text-sm font-bold text-emerald-900 mb-2 ml-1">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-2 rounded-2xl border-2 border-emerald-100 focus:border-emerald-500 focus:outline-none transition-all bg-gray-50"
              placeholder="••••••••"
              required
            />
            <div className="flex justify-start mt-2 ml-1">
              <a href="#" className="text-xs font-semibold text-emerald-700 hover:text-emerald-500 transition-colors">
                Esqueceu a senha?
              </a>
            </div>
          </div>

          {/* Botão de Entrar */}
          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors active:scale-[0.98] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Enviando código..." : "Entrar no Sistema"}
          </button>
        </form>
      </div>
    </div>
  );
}