import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { reset } from "../api/Todo";


export default function ResetarSenha() {
    const { token } = useParams(); // Pega o token da URL
    const [novaSenha, setNovaSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await reset({ token, novaSenha });
            alert("Senha redefinida com sucesso!");
            navigate("/login");
        } catch (error) {
            alert("Erro ao redefinir senha: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-xl border border-gray-200 mt-10">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Nova Senha</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Digite a nova senha</label>
                    <input
                        type="password"
                        required
                        disabled={loading}
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        placeholder="••••••••"
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center mt-2"
                >
                    {loading ? "Salvando..." : "Alterar Senha"}
                </button>
            </form>
        </div>
    );
}