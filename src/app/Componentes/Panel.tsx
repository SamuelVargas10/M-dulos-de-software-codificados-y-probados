import { useMemo } from "react";
import { Package, AlertTriangle, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Product, Category, Movement } from "../data/inventory";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type Props = {
  products: Product[];
  categories: Category[];
  movements: Movement[];
};

const COLORS = ["#f97316", "#eab308", "#3b82f6", "#a855f7", "#06b6d4", "#22c55e", "#ef4444", "#ec4899"];

export function Dashboard({ products, categories, movements }: Props) {
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const lowStock = products.filter((p) => p.stock <= p.minStock).length;
    const totalValue = products.reduce((sum, p) => sum + p.stock * p.cost, 0);
    const totalSaleValue = products.reduce((sum, p) => sum + p.stock * p.price, 0);

    return { totalProducts, lowStock, totalValue, totalSaleValue };
  }, [products]);

  const categoryData = useMemo(() => {
    return categories.map((cat) => {
      const count = products.filter((p) => p.categoryId === cat.id).length;
      const value = products
        .filter((p) => p.categoryId === cat.id)
        .reduce((sum, p) => sum + p.stock * p.cost, 0);
      return { name: cat.name.split(" ")[0], count, value, fullName: cat.name };
    }).filter((d) => d.count > 0);
  }, [products, categories]);

  const stockAlerts = useMemo(() => {
    return products.filter((p) => p.stock <= p.minStock).sort((a, b) => (a.stock / a.minStock) - (b.stock / b.minStock));
  }, [products]);

  const recentMovements = useMemo(() => {
    return [...movements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);
  }, [movements]);

  const getProduct = (id: string) => products.find((p) => p.id === id);

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Productos</p>
            <p className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>{stats.totalProducts}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Stock Bajo</p>
            <p className="text-2xl text-red-600" style={{ fontWeight: 700 }}>{stats.lowStock}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Valor en Costo</p>
            <p className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>
              ${stats.totalValue.toLocaleString("es-MX")}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Valor en Venta</p>
            <p className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>
              ${stats.totalSaleValue.toLocaleString("es-MX")}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="mb-4 text-gray-800">Productos por Categoría</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val, name) => [val, name === "count" ? "Productos" : "Valor"]}
                contentStyle={{ borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="mb-4 text-gray-800">Distribución por Valor</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="60%" height={220}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                  {categoryData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => [`$${val.toLocaleString("es-MX")}`, "Valor"]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 text-xs">
              {categoryData.map((d, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-gray-600 truncate max-w-[100px]">{d.fullName.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts + Recent Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h3 className="text-gray-800">Alertas de Stock</h3>
          </div>
          {stockAlerts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">¡Sin alertas! El inventario está en buen estado.</p>
          ) : (
            <div className="space-y-3">
              {stockAlerts.map((p) => {
                const pct = Math.round((p.stock / p.minStock) * 100);
                return (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${Math.min(pct, 100)}%`,
                              backgroundColor: pct <= 30 ? "#ef4444" : pct <= 60 ? "#f97316" : "#eab308",
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{p.stock}/{p.minStock} {p.unit}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.stock === 0 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
                      {p.stock === 0 ? "Sin stock" : "Bajo"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Movements */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="mb-4 text-gray-800">Movimientos Recientes</h3>
          <div className="space-y-3">
            {recentMovements.map((m) => {
              const product = getProduct(m.productId);
              return (
                <div key={m.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.type === "entrada" ? "bg-green-100" : m.type === "salida" ? "bg-red-100" : "bg-blue-100"}`}>
                    {m.type === "entrada" ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : m.type === "salida" ? (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    ) : (
                      <span className="text-xs text-blue-600">~</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{product?.name ?? "Producto"}</p>
                    <p className="text-xs text-gray-400">{m.reason} · {m.user}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${m.type === "entrada" ? "text-green-600" : m.type === "salida" ? "text-red-600" : "text-blue-600"}`} style={{ fontWeight: 600 }}>
                      {m.type === "entrada" ? "+" : ""}{m.quantity}
                    </p>
                    <p className="text-xs text-gray-400">{m.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
