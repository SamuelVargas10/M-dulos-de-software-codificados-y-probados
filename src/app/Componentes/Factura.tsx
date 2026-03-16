import { useState } from "react";
import { Search, FileText, Eye, Download, Calendar, DollarSign, CheckCircle, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Invoice, Customer, InvoiceDetail } from "../data/inventory";

type InvoicesProps = {
  invoices: Invoice[];
  customers: Customer[];
  invoiceDetails: InvoiceDetail[];
  onView: (invoice: Invoice) => void;
};

export function Invoices({ invoices, customers, invoiceDetails, onView }: InvoicesProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pagada" | "pendiente" | "vencida" | "cancelada">("all");

  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer?.name || "Cliente no encontrado";
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const customerName = getCustomerName(invoice.customerId);
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
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

  const totalInvoiced = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidInvoices = filteredInvoices.filter((i) => i.status === "pagada").length;
  const pendingInvoices = filteredInvoices.filter((i) => i.status === "pendiente").length;

  const statusColors = {
    pagada: "bg-green-100 text-green-700",
    pendiente: "bg-yellow-100 text-yellow-700",
    vencida: "bg-red-100 text-red-700",
    cancelada: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Facturado</p>
              <h3 className="text-gray-900 mt-1">{formatCurrency(totalInvoiced)}</h3>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Facturas Pagadas</p>
              <h3 className="text-gray-900 mt-1">{paidInvoices}</h3>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Facturas Pendientes</p>
              <h3 className="text-gray-900 mt-1">{pendingInvoices}</h3>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-gray-900">Facturas</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por número de factura o cliente..."
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
            Todas
          </Button>
          <Button
            variant={statusFilter === "pagada" ? "default" : "outline"}
            onClick={() => setStatusFilter("pagada")}
            size="sm"
          >
            Pagadas
          </Button>
          <Button
            variant={statusFilter === "pendiente" ? "default" : "outline"}
            onClick={() => setStatusFilter("pendiente")}
            size="sm"
          >
            Pendientes
          </Button>
          <Button
            variant={statusFilter === "vencida" ? "default" : "outline"}
            onClick={() => setStatusFilter("vencida")}
            size="sm"
          >
            Vencidas
          </Button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-gray-500">Número</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">Cliente</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">Emisión</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">Vencimiento</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500">Subtotal</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500">IVA</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500">Total</th>
                <th className="text-center px-4 py-3 text-xs text-gray-500">Estado</th>
                <th className="text-center px-4 py-3 text-xs text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{invoice.invoiceNumber}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {getCustomerName(invoice.customerId)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {formatDate(invoice.issueDate)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(invoice.dueDate)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">
                    {formatCurrency(invoice.subtotal)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">
                    {formatCurrency(invoice.tax)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatCurrency(invoice.total)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={statusColors[invoice.status]}>
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-1 justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(invoice)}
                        className="h-8"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron facturas</p>
        </div>
      )}
    </div>
  );
}
