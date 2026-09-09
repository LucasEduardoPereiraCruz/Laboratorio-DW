import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../api/Todo";

export default function Cadastro() {
    // Estados para armazenar o que o usuário digita nos inputs
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    // Estado de controle para evitar duplo clique enquanto envia os dados
    const [loading, setLoading] = useState(false);
    // Hook (Gancho) do React Router para redirecionar o usuário para outra tela (ex: login)
    const navigate = useNavigate();

    // Função executada quando o formulário é enviado
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que a página recarregue sozinha
        setLoading(true); // Ativa o estado de carregamento (trava os inputs/botão)
        try {
            // Chama a API de cadastro enviando os dados preenchidos
            await createUser({ nome, email, senha }); // Usando createUser
            alert("Usuário cadastrado com sucesso!");
            navigate("/login"); // Manda o usuário para a tela de login após o sucesso 
        } catch (error) {
            // Trata erros vindo do backend ou de rede
            alert("Erro ao cadastrar: " + (error.response?.data?.message || error.message || error));
        } finally {
            // Desativa o carregamento independentemente de dar certo ou errado
            setLoading(false);
        }
    };


    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-xl border border-gray-200 mt-10">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Criar Conta</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                        type="text"
                        required
                        disabled={loading} // Trava o input enquanto está enviando     
                        value={nome}
                        onChange={(e) => setNome(e.target.value)} // Atualiza o estado conforme o usuário digita 
                        placeholder="Seu Nome"
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
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

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                    <input
                        type="password"
                        required
                        disabled={loading}
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="••••••••"
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center mt-2"
                >
                    {loading ? "Cadastrando..." : "Cadastrar"}
                </button>
            </form>

            <div className="mt-5 text-center pt-2">
                <Link to="/login" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    Já tem uma conta? Entre aqui
                </Link>
            </div>
        </div>
    );

}

