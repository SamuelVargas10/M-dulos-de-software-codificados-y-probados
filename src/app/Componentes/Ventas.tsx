import { useState } from "react";
import { Search, Plus, Eye, CreditCard, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Sale, Customer, SaleDetail } from "../data/inventory";

type SalesProps = {
  sales: Sale[];
  customers: Customer[];
  saleDetails: SaleDetail[];
  onAdd: () => void;
  onView: (sale: Sale) => void;
};

export function Sales({ sales, customers, saleDetails, onAdd, onView }: SalesProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completada" | "pendiente" | "cancelada">("all");
  const [paymentFilter, setPaymentFilter] = useState<"all" | "efectivo" | "tarjeta" | "transferencia" | "credito">("all");

  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer?.name || "Cliente no encontrado";
  };

  const filteredSales = sales.filter((sale) => {
    const customerName = getCustomerName(sale.customerId);
    const matchesSearch =
      sale.id.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || sale.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || sale.paymentMethod === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const completedSales = filteredSales.filter((s) => s.status === "completada").length;

  const statusColors = {
    completada: "bg-green-100 text-green-700",
    pendiente: "bg-yellow-100 text-yellow-700",
    cancelada: "bg-red-100 text-red-700",
  };

  const paymentIcons = {
    efectivo: "💵",
    tarjeta: "💳",
    transferencia: "🏦",
    credito: "📝",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Ventas</p>
              <h3 className="text-gray-900 mt-1">{formatCurrency(totalSales)}</h3>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ventas Completadas</p>
              <h3 className="text-gray-900 mt-1">{completedSales}</h3>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Registros</p>
              <h3 className="text-gray-900 mt-1">{filteredSales.length}</h3>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-gray-900">Ventas</h2>
        <Button onClick={onAdd} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Venta
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por ID o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
            size="sm"
          >
            Todos
          </Button>
          <Button
            variant={statusFilter === "completada" ? "default" : "outline"}
            onClick={() => setStatusFilter("completada")}
            size="sm"
          >
            Completadas
          </Button>
          <Button
            variant={statusFilter === "pendiente" ? "default" : "outline"}
            onClick={() => setStatusFilter("pendiente")}
            size="sm"
          >
            Pendientes
          </Button>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-gray-500">ID Venta</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">Cliente</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">Fecha</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500">Subtotal</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500">IVA</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500">Total</th>
                <th className="text-center px-4 py-3 text-xs text-gray-500">Pago</th>
                <th className="text-center px-4 py-3 text-xs text-gray-500">Estado</th>
                <th className="text-center px-4 py-3 text-xs text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{sale.id.toUpperCase()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {getCustomerName(sale.customerId)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {formatDate(sale.date)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">
                    {formatCurrency(sale.subtotal)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">
                    {formatCurrency(sale.tax)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatCurrency(sale.total)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm">
                      {paymentIcons[sale.paymentMethod]} {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={statusColors[sale.status]}>
                      {sale.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(sale)}
                      className="h-8"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredSales.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron ventas</p>
        </div>
      )}
    </div>
  );
}
