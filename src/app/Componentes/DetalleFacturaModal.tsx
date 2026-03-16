import { X, User, Calendar, CreditCard, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sale, SaleDetail, Customer, Product } from "../data/inventory";

type SaleDetailModalProps = {
  sale: Sale;
  saleDetails: SaleDetail[];
  customer: Customer | undefined;
  products: Product[];
  onClose: () => void;
};

export function SaleDetailModal({ sale, saleDetails, customer, products, onClose }: SaleDetailModalProps) {
  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || "Producto no encontrado";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const saleItems = saleDetails.filter((d) => d.saleId === sale.id);

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-gray-900">Detalle de Venta</h2>
              <p className="text-sm text-gray-500">{sale.id.toUpperCase()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Sale Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Cliente:</span>
                <span className="text-gray-900">{customer?.name || "No encontrado"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Fecha:</span>
                <span className="text-gray-900">{formatDate(sale.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Método de Pago:</span>
                <span className="text-gray-900">
                  {paymentIcons[sale.paymentMethod]} {sale.paymentMethod}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Estado:</span>
                <Badge className={statusColors[sale.status]}>
                  {sale.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Usuario:</span>
                <span className="text-gray-900">{sale.userId}</span>
              </div>
              {sale.notes && (
                <div className="text-sm">
                  <span className="text-gray-600">Notas:</span>
                  <p className="text-gray-900 mt-1">{sale.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Products Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="text-sm text-gray-700">Productos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs text-gray-500">Producto</th>
                    <th className="text-center px-4 py-3 text-xs text-gray-500">Cantidad</th>
                    <th className="text-right px-4 py-3 text-xs text-gray-500">Precio Unit.</th>
                    <th className="text-right px-4 py-3 text-xs text-gray-500">Descuento</th>
                    <th className="text-right px-4 py-3 text-xs text-gray-500">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {saleItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {getProductName(item.productId)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-center">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-right">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-right">
                        {item.discount > 0 ? `-${formatCurrency(item.discount)}` : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {formatCurrency(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">{formatCurrency(sale.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">IVA (16%):</span>
              <span className="text-gray-900">{formatCurrency(sale.tax)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-900">Total:</span>
              <span className="text-gray-900">{formatCurrency(sale.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            Imprimir
          </Button>
        </div>
      </div>
    </div>
  );
}
