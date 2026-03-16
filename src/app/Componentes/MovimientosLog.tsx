import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, Sliders } from "lucide-react";
import { Movement, Product } from "../data/inventory";

type Props = {
  movements: Movement[];
  products: Product[];
};

export function MovementsLog({ movements, products }: Props) {
  const [filterType, setFilterType] = useState("all");

  const getProduct = (id: string) => products.find((p) => p.id === id);

  const filtered = [...movements]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((m) => filterType === "all" || m.type === filterType);

  const typeConfig = {
    entrada: { label: "Entrada", color: "text-green-600 bg-green-100", icon: <ArrowUpRight className="w-4 h-4" /> },
    salida: { label: "Salida", color: "text-red-600 bg-red-100", icon: <ArrowDownRight className="w-4 h-4" /> },
    ajuste: { label: "Ajuste", color: "text-blue-600 bg-blue-100", icon: <Sliders className="w-4 h-4" /> },
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-800">Historial de Movimientos</h2>
        <div className="flex gap-2">
          {(["all", "entrada", "salida", "ajuste"] as const).map((t) => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filterType === t ? "bg-orange-500 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {t === "all" ? "Todos" : typeConfig[t].label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-gray-500">Fecha</th>
                <th className="text-left px-4 py-3 text-gray-500">Tipo</th>
                <th className="text-left px-4 py-3 text-gray-500">Producto</th>
                <th className="text-left px-4 py-3 text-gray-500">Cantidad</th>
                <th className="text-left px-4 py-3 text-gray-500">Motivo</th>
                <th className="text-left px-4 py-3 text-gray-500">Usuario</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">No hay movimientos registrados</td>
                </tr>
              ) : (
                filtered.map((m) => {
                  const product = getProduct(m.productId);
                  const cfg = typeConfig[m.type];
                  return (
                    <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 text-gray-500">{m.date}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${cfg.color}`}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-gray-800">{product?.name ?? "—"}</p>
                          <p className="text-xs text-gray-400">{product?.sku}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`${m.quantity > 0 ? "text-green-600" : "text-red-600"}`} style={{ fontWeight: 600 }}>
                          {m.quantity > 0 ? "+" : ""}{m.quantity}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">{product?.unit}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{m.reason}</td>
                      <td className="px-4 py-3 text-gray-500">{m.user}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
          {filtered.length} movimiento(s) encontrados
        </div>
      </div>
    </div>
  );
}
