import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgot } from "../api/Todo";

export default function EsqueceuSenha() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem("");
        try {
            const response = await forgot({ email });
            setMensagem(response.data.message || "Se o e-mail estiver cadastrado, um link será enviado.");
        } catch (error) {
            alert("Erro ao processar solicitação: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-xl border border-gray-200 mt-10">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Recuperar Senha</h2>

            {mensagem ? (
                <div className="text-center space-y-4">
                    <p className="text-sm text-green-600 font-medium">{mensagem}</p>
                    <Link to="/login" className="block text-sm text-blue-600 hover:underline">
                        Voltar para o Login
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail cadastrado</label>
                        <input
                            type="email"
                            required
                            disabled={loading}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center mt-2"
                    >
                        {loading ? "Enviando..." : "Enviar instruções"}
                    </button>

                    <div className="mt-5 text-center pt-2">
                        <Link to="/login" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                            Lembrou a senha? Entrar
                        </Link>
                    </div>
                </form>
            )}
        </div>
    );


}