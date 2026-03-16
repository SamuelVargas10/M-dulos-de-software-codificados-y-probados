import { useState } from "react";
import { X } from "lucide-react";
import { Product, Movement } from "../data/inventory";

type Props = {
  product: Product;
  onSave: (movement: Movement) => void;
  onClose: () => void;
};

export function MovementModal({ product, onSave, onClose }: Props) {
  const [type, setType] = useState<"entrada" | "salida" | "ajuste">("entrada");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");

  const reasons = {
    entrada: ["Reabastecimiento", "Compra a proveedor", "Devolución de cliente", "Transferencia interna"],
    salida: ["Venta a cliente", "Uso en proyecto", "Merma / Daño", "Transferencia interna"],
    ajuste: ["Ajuste por inventario físico", "Corrección de error", "Otro"],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalQty = type === "salida" ? -Math.abs(quantity) : type === "ajuste" ? quantity : quantity;
    onSave({
      id: `m${Date.now()}`,
      productId: product.id,
      type,
      quantity: finalQty,
      date: new Date().toISOString().split("T")[0],
      reason: reason || reasons[type][0],
      user: "Usuario",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-gray-900">Registrar Movimiento</h2>
            <p className="text-sm text-gray-500 mt-0.5">{product.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type selector */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Tipo de Movimiento</label>
            <div className="grid grid-cols-3 gap-2">
              {(["entrada", "salida", "ajuste"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 rounded-lg text-sm capitalize transition-colors border ${
                    type === t
                      ? t === "entrada"
                        ? "bg-green-500 text-white border-green-500"
                        : t === "salida"
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-blue-500 text-white border-blue-500"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Cantidad {type === "ajuste" && "(puede ser negativo)"}
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={type === "ajuste" ? undefined : 1}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
            />
            <p className="text-xs text-gray-400 mt-1">Stock actual: {product.stock} {product.unit}</p>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Motivo</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
            >
              {reasons[type].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2.5 text-sm hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2.5 text-sm transition-colors">
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
