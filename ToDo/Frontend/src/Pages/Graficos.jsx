import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";
import { getTodos } from "../api/Todo.jsx";

export default function Graficos() {
    // Guarda todas as tarefas vindas do back 
    const [todos, setTodos] = useState([]);

    // Controla carregamento 
    const [loading, setLoading] = useState(true);

    // Guarda possiveis erros 
    const [error, setError] = useState(null)


    // Busca tarefas no backend 
    const fetchTodos = async () => {
        try {
            setLoading(true);
            const resposta = await getTodos();
            setTodos(resposta.data.tarefas || []);
        } catch (err) {
            setError(err.response?.data?.message || "Erro ao carregar as tarefas");
        } finally {
            setLoading(false);
        }
    };

    // Busca todos os dados quando a página é aberta 
    useEffect(() => {
        fetchTodos();
    }, []);

    // Conta as tarefas PENDENTES
    const quantidadePendente = todos.filter(
        (todo) => todo.situacao === "PENDENTE"
    ).length;

    // Conta as tarefas FINALIZADAS
    const quantidadeFinalizada = todos.filter(
        (todo) => todo.situacao === "FINALIZADA"
    ).length;

    // Conta as tarefas CANCELADAS
    const quantidadeCancelada = todos.filter(
        (todo) => todo.situacao === "CANCELADA"
    ).length;


    // CONFIGURAÇÕES DO GRÁFICO
    const options = {
        chart: {
            type: "bar",
            toolbar: { show: false },
        },
        title: {
            text: "Quantidade de tarefas por situação",
            align: "center",
        },
        xaxis: {
            categories: ["Pendente", "Finalizada", "Cancelada"],
        },
        yaxis: {
            title: { text: "Quantidade de tarefas" },
            min: 0,
            forceNiceScale: true,
            decimalsInFloat: 0,   // sem números quebrados
        },
        plotOptions: {
            bar: {
                borderRadius: 4,      // leve arredondamento
                columnWidth: "45%",
                distributed: true,    // uma cor para cada coluna
            },
        },
        colors: ["#f59e0b", "#22c55e", "#ef4444"], // pendente, finalizada, cancelada
        legend: { show: false },      // sem legenda, já que o eixo X mostra os nomes
        dataLabels: { enabled: true },
    };

    // Dados utilizados pelo ApexCharts
    const series = [
        {
            name: "Tarefas",
            data: [quantidadePendente, quantidadeFinalizada, quantidadeCancelada],
        },
    ];

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
                <p className="text-center text-gray-500"> Carregando gráficos... </p> </div>);
    }


    if (error) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
                <p className="text-center text-red-600"> {error} </p> </div>);
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
            {/* Título */}
            <div className="mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">
                    Gráficos
                </h2>
                <p className="text-sm text-gray-500">
                    Visualize a quantidade de tarefas em cada situação.
                </p>
            </div>
            <Link
                to="/todos"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
            >
                ← Voltar
            </Link>
            
            {/* Gráfico de barras */}
            <div className="w-full">
                <ReactApexChart options={options} series={series} type="bar" height={400} />
            </div>
        </div>
    );
}