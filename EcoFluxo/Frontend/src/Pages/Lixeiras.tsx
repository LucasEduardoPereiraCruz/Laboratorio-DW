import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
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

  // Calcula taxa de ocupação, ordena do maior para o menor e limita a 5
  const top5Criticas = [...lixeiras]
    .map((lix) => {
      const taxaOcupacao =
        lix.volume_max > 0
          ? Number(((lix.nivel_cheio / lix.volume_max) * 100).toFixed(1))
          : 0;
      return {
        ...lix,
        taxaOcupacao,
      };
    })
    .sort((a, b) => b.taxaOcupacao - a.taxaOcupacao)
    .slice(0, 5);

  const maiorTaxa =
    top5Criticas.length > 0
      ? Math.max(...top5Criticas.map((item) => item.taxaOcupacao))
      : 100;

  const tetoEixoY = Math.max(100, Math.ceil((maiorTaxa + 15) / 10) * 10);

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: false,
        columnWidth: top5Criticas.length <= 2 ? "25%" : "40%",
        distributed: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    colors: top5Criticas.map((item) =>
      item.taxaOcupacao >= 80
        ? "#dc2626"
        : item.taxaOcupacao >= 50
        ? "#f59e0b"
        : "#059669"
    ),
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}%`,
      offsetY: -22,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["#064e3b"],
      },
    },
    legend: { show: false },
    grid: {
      borderColor: "#d1fae5",
      strokeDashArray: 4,
    },
    xaxis: {
      categories: top5Criticas.map(
        (lix) => `${lix.uuid_sensor} (${lix.tipo})`
      ),
      labels: {
        trim: false,
        style: {
          colors: "#064e3b",
          fontWeight: 600,
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      min: 0,
      max: tetoEixoY,
      title: {
        text: "Taxa de Ocupação (%)",
        style: {
          color: "#064e3b",
          fontWeight: 700,
        },
      },
      labels: {
        formatter: (val: number) => `${Math.round(val)}%`,
        style: {
          colors: "#065f46",
          fontWeight: 600,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}% de ocupação`,
      },
    },
  };

  const chartSeries = [
    {
      name: "Taxa de Ocupação",
      data: top5Criticas.map((lix) => lix.taxaOcupacao),
    },
  ];

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
        <>
          <div className="bg-white border-2 border-emerald-100 rounded-2xl p-6 shadow-xs mb-8">
            <h2 className="text-xl font-bold text-emerald-900 mb-1">
              Top 5 Lixeiras com Capacidade Crítica
            </h2>
            <p className="text-xs text-emerald-600 font-medium mb-4">
              Taxa de ocupação calculada por (nível cheio / volume máximo) × 100
            </p>
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height={340}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lixeiras.map((lix) => {
              const ocupacao =
                lix.volume_max > 0
                  ? ((lix.nivel_cheio / lix.volume_max) * 100).toFixed(1)
                  : "0";

              return (
                <div key={lix.id} className="bg-white border-2 border-emerald-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                      {lix.tipo}
                    </span>
                    <h3 className="text-lg font-bold text-emerald-900 mt-3">Sensor: {lix.uuid_sensor}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Volume Máximo: {lix.volume_max}L | Nível Cheio: {lix.nivel_cheio}L ({ocupacao}%)
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-emerald-50 text-xs text-emerald-700 font-semibold">
                    Ecoponto Vinculado: {lix.ecoponto?.nome || "Não vinculado"}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}