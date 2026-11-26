import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../utils/api";

// Corrige os ícones padrão do Marker do Leaflet no Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function Mapa() {
  const [ecopontos, setEcopontos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/ecoponto/getEcopontos")
      .then((res) => setEcopontos(res.data))
      .catch((err) => console.error("Erro ao buscar ecopontos:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filtra apenas ecopontos com coordenadas numéricas válidas
  const ecopontosValidos = ecopontos.filter(
    (eco) => !isNaN(Number(eco.latitude)) && !isNaN(Number(eco.longitude))
  );

  // Centraliza no primeiro ecoponto cadastrado ou em Jaú-SP por padrão
  const centroMapa: [number, number] =
    ecopontosValidos.length > 0
      ? [Number(ecopontosValidos[0].latitude), Number(ecopontosValidos[0].longitude)]
      : [-22.2958, -48.5561];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-emerald-900">Mapa de Ecopontos</h1>
        <p className="text-emerald-600 font-medium text-sm mt-1">
          Clique em um ecoponto no mapa para visualizar a situação e a taxa de ocupação das lixeiras
        </p>
      </div>

      {loading ? (
        <p className="text-center text-emerald-700 font-medium py-10">
          Carregando mapa e ecopontos...
        </p>
      ) : (
        <div className="bg-white border-2 border-emerald-100 rounded-3xl overflow-hidden shadow-xs">
          <MapContainer
            center={centroMapa}
            zoom={14}
            style={{ height: "520px", width: "100%", zIndex: 1 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {ecopontosValidos.map((eco) => (
              <Marker
                key={eco.id}
                position={[Number(eco.latitude), Number(eco.longitude)]}
              >
                <Popup minWidth={250}>
                  <div className="p-1">
                    <h3 className="text-base font-bold text-emerald-900 mb-1">
                      {eco.nome}
                    </h3>
                    {eco.logradouro && (
                      <p className="text-xs text-gray-600 mb-2">
                        {eco.logradouro}
                        {eco.numero ? `, ${eco.numero}` : ""}
                        {eco.bairro ? ` - ${eco.bairro}` : ""}
                      </p>
                    )}

                    <div className="border-t border-emerald-100 pt-2 mt-2">
                      <p className="text-xs font-bold text-emerald-800 mb-2">
                        Situação das Lixeiras:
                      </p>

                      {!eco.lixeiras || eco.lixeiras.length === 0 ? (
                        <p className="text-xs text-gray-500">
                          Nenhuma lixeira vinculada a este ecoponto.
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {eco.lixeiras.map((lix: any) => {
                            const taxaOcupacao =
                              lix.volume_max > 0
                                ? Number(
                                    ((lix.nivel_cheio / lix.volume_max) * 100).toFixed(1)
                                  )
                                : 0;

                            const corBadge =
                              taxaOcupacao >= 80
                                ? "bg-red-100 text-red-700"
                                : taxaOcupacao >= 50
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800";

                            return (
                              <li
                                key={lix.id}
                                className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg border border-gray-100"
                              >
                                <div>
                                  <span className="font-bold text-gray-800 block">
                                    {lix.tipo}
                                  </span>
                                  <span className="text-[11px] text-gray-500">
                                    Sensor: {lix.uuid_sensor}
                                  </span>
                                </div>
                                <span
                                  className={`font-bold px-2 py-1 rounded-md ${corBadge}`}
                                >
                                  {taxaOcupacao}%
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}