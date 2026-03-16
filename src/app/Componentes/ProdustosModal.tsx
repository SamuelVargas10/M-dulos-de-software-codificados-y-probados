import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Product, Category } from "../data/inventory";

type Props = {
  product?: Product | null;
  categories: Category[];
  onSave: (product: Product) => void;
  onClose: () => void;
};

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  sku: "",
  categoryId: "c1",
  price: 0,
  cost: 0,
  stock: 0,
  minStock: 5,
  unit: "pieza",
  location: "",
  supplier: "",
  description: "",
  lastUpdated: new Date().toISOString().split("T")[0],
};

export function ProductModal({ product, categories, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Product, "id">>(product ? { ...product } : { ...emptyProduct });

  useEffect(() => {
    setForm(product ? { ...product } : { ...emptyProduct });
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["price", "cost", "stock", "minStock"].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = product?.id ?? `p${Date.now()}`;
    onSave({ ...form, id, lastUpdated: new Date().toISOString().split("T")[0] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-gray-900">{product ? "Editar Producto" : "Nuevo Producto"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">Nombre del Producto *</label>
              <input name="name" value={form.name} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
                placeholder="Ej: Martillo Carpintero 16oz" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">SKU / Código *</label>
              <input name="sku" value={form.sku} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
                placeholder="Ej: HER-001" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Categoría *</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50">
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Precio de Venta ($) *</label>
              <input name="price" type="number" min={0} step={0.01} value={form.price} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Costo ($) *</label>
              <input name="cost" type="number" min={0} step={0.01} value={form.cost} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Stock Actual *</label>
              <input name="stock" type="number" min={0} value={form.stock} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Stock Mínimo *</label>
              <input name="minStock" type="number" min={0} value={form.minStock} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Unidad de Medida</label>
              <select name="unit" value={form.unit} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50">
                {["pieza", "caja", "bolsa", "rollo", "litro", "kg", "metro", "cuñete", "par"].map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Ubicación en Bodega</label>
              <input name="location" value={form.location} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
                placeholder="Ej: A1-01" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Proveedor</label>
              <input name="supplier" value={form.supplier} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
                placeholder="Ej: Truper" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">Descripción</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 resize-none"
                placeholder="Descripción del producto..." />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2.5 text-sm hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2.5 text-sm transition-colors">
              {product ? "Guardar Cambios" : "Agregar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
