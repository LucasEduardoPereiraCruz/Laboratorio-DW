import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

interface Verify2FAProps {
  onLoginSuccess: (usuario: any) => void;
}

const Verify2FA: React.FC<Verify2FAProps> = ({ onLoginSuccess }) => {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Pega o e-mail passado via state pelo Login
  const stateEmail = location.state?.email || '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (codigo.length !== 6) {
      setMessage('O código deve conter 6 dígitos.');
      setLoading(false);
      return;
    }

    try {
      // Chamada para a rota do backend que valida o código 2FA
      const response = await api.post("/verify-2fa", {
        email: stateEmail,
        codigo: codigo
      });

      // Salva o token no localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Salva os dados do usuário no localStorage
      if (response.data.usuario) {
        localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
      }

      const usuarioLogado = response.data.usuario;

      // Notifica o App.tsx que o login/2FA foi concluído com sucesso
      onLoginSuccess(usuarioLogado);

      // Redireciona para a Home
      navigate('/');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Código inválido ou expirado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-2 px-2">
      <div className="w-full max-w-md bg-white rounded-3xl p-10 border-2 border-emerald-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-emerald-900">Segurança</h2>
          <p className="text-emerald-600 font-medium mt-2 text-sm">
            Insira o código de 6 dígitos enviado para o seu dispositivo.
            {stateEmail && (
              <span className="block font-bold text-emerald-900 mt-1">
                {stateEmail}
              </span>
            )}
          </p>
        </div>

        {/* Mensagem de Erro Dinâmica */}
        {message && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center font-bold">
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Campo do Código */}
          <div>
            <label className="block text-sm font-bold text-emerald-900 mb-2 ml-1">
              Código de Acesso
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
              className="w-full px-5 py-2 rounded-2xl border-2 border-emerald-100 focus:border-emerald-500 focus:outline-none transition-all bg-gray-50 text-center text-2xl font-bold tracking-widest text-emerald-950"
              required
              disabled={loading}
            />
          </div>

          {/* Botão de Confirmar */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors active:scale-[0.98] ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Verificando...' : 'Confirmar Código'}
          </button>

          {/* Voltar */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-500 transition-colors"
            >
              Voltar para o login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Verify2FA;