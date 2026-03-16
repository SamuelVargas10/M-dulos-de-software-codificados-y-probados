import { useState } from "react";
import { Search, Plus, Edit2, Trash2, ArrowUpDown, Filter, RefreshCw } from "lucide-react";
import { Product, Category } from "../data/inventory";

type Props = {
  products: Product[];
  categories: Category[];
  onAdd: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onMovement: (product: Product) => void;
};

export function ProductsTable({ products, categories, onAdd, onEdit, onDelete, onMovement }: Props) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterStock, setFilterStock] = useState("all");
  const [sortField, setSortField] = useState<keyof Product>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const getCat = (id: string) => categories.find((c) => c.id === id);

  const filtered = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCat === "all" || p.categoryId === filterCat;
      const matchStock = filterStock === "all" || (filterStock === "low" && p.stock <= p.minStock) || (filterStock === "ok" && p.stock > p.minStock);
      return matchSearch && matchCat && matchStock;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = typeof aVal === "number" && typeof bVal === "number" ? aVal - bVal : String(aVal).localeCompare(String(bVal));
      return sortDir === "asc" ? cmp : -cmp;
    });

  const toggleSort = (field: keyof Product) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  return (
    <div className="p-6 space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o SKU..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option value="all">Todas las categorías</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400">
            <option value="all">Todo el stock</option>
            <option value="low">⚠️ Stock bajo</option>
            <option value="ok">✅ Stock normal</option>
          </select>
        </div>
        <button onClick={onAdd}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          <Plus className="w-4 h-4" />
          Agregar Producto
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {[
                  { label: "SKU", field: "sku" },
                  { label: "Producto", field: "name" },
                  { label: "Categoría", field: "categoryId" },
                  { label: "Stock", field: "stock" },
                  { label: "Costo", field: "cost" },
                  { label: "Precio", field: "price" },
                  { label: "Ubicación", field: "location" },
                  { label: "Acciones", field: null },
                ].map(({ label, field }) => (
                  <th key={label} className="text-left px-4 py-3 text-gray-500 whitespace-nowrap">
                    {field ? (
                      <button className="flex items-center gap-1 hover:text-gray-700" onClick={() => toggleSort(field as keyof Product)}>
                        {label} <ArrowUpDown className="w-3 h-3" />
                      </button>
                    ) : label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">No se encontraron productos</td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const cat = getCat(p.categoryId);
                  const isLow = p.stock <= p.minStock;
                  const margin = p.cost > 0 ? Math.round(((p.price - p.cost) / p.price) * 100) : 0;
                  return (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors">
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{p.sku}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-gray-800">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.supplier}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {cat && (
                          <span className={`text-xs px-2 py-1 rounded-full ${cat.color}`}>
                            {cat.icon} {cat.name.split(" ")[0]}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`${isLow ? "text-red-600" : "text-gray-800"}`} style={{ fontWeight: isLow ? 600 : 400 }}>
                            {p.stock}
                          </span>
                          <span className="text-xs text-gray-400">{p.unit}</span>
                          {isLow && (
                            <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">⚠️</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">mín: {p.minStock}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">${p.cost.toLocaleString("es-MX")}</td>
                      <td className="px-4 py-3">
                        <div className="text-gray-800">${p.price.toLocaleString("es-MX")}</div>
                        <div className="text-xs text-green-600">{margin}% margen</div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{p.location}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => onMovement(p)} title="Movimiento"
                            className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-500 transition-colors">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button onClick={() => onEdit(p)} title="Editar"
                            className="p-1.5 rounded-lg hover:bg-orange-100 text-orange-500 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => onDelete(p.id)} title="Eliminar"
                            className="p-1.5 rounded-lg hover:bg-red-100 text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
          Mostrando {filtered.length} de {products.length} productos
        </div>
      </div>
    </div>
  );
}
