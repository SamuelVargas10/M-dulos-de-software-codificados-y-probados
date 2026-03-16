import { useState } from "react";
import { X, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Sale, SaleDetail, Customer, Product } from "../data/inventory";

type SaleModalProps = {
  customers: Customer[];
  products: Product[];
  onSave: (sale: Sale, saleDetails: SaleDetail[]) => void;
  onClose: () => void;
  currentUser: string;
};

type CartItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
};

export function SaleModal({ customers, products, onSave, onClose, currentUser }: SaleModalProps) {
  const [customerId, setCustomerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"efectivo" | "tarjeta" | "transferencia" | "credito">("efectivo");
  const [notes, setNotes] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  const handleAddToCart = () => {
    if (!selectedProductId) return;
    
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    const existingItem = cart.find((item) => item.productId === selectedProductId);
    if (existingItem) {
      setCart(cart.map((item) =>
        item.productId === selectedProductId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: selectedProductId,
        quantity: 1,
        unitPrice: product.price,
        discount: 0,
      }]);
    }
    setSelectedProductId("");
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(cart.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    ));
  };

  const handleUpdateDiscount = (productId: string, discount: number) => {
    setCart(cart.map((item) =>
      item.productId === productId ? { ...item, discount } : item
    ));
  };

  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || "";
  };

  const calculateSubtotal = (item: CartItem) => {
    return item.quantity * item.unitPrice - item.discount;
  };

  const subtotal = cart.reduce((sum, item) => sum + calculateSubtotal(item), 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerId || cart.length === 0) {
      alert("Seleccione un cliente y agregue al menos un producto");
      return;
    }

    const saleId = `v${Date.now()}`;
    const sale: Sale = {
      id: saleId,
      customerId,
      date: new Date().toISOString().split("T")[0],
      subtotal,
      tax,
      total,
      paymentMethod,
      status: "completada",
      userId: currentUser,
      notes: notes || undefined,
    };

    const saleDetails: SaleDetail[] = cart.map((item, index) => ({
      id: `vd${Date.now()}-${index}`,
      saleId,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount,
      subtotal: calculateSubtotal(item),
    }));

    onSave(sale, saleDetails);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-gray-900">Nueva Venta</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Customer Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer">Cliente *</Label>
              <select
                id="customer"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Seleccione un cliente</option>
                {customers.filter((c) => c.status === "activo").map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} {customer.companyName ? `(${customer.companyName})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="paymentMethod">Método de Pago *</Label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="credito">Crédito</option>
              </select>
            </div>
          </div>

          {/* Add Product */}
          <div>
            <Label>Agregar Productos</Label>
            <div className="flex gap-2 mt-1">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Seleccione un producto</option>
                {products.filter((p) => p.stock > 0).map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {formatCurrency(product.price)} (Stock: {product.stock})
                  </option>
                ))}
              </select>
              <Button
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedProductId}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                Agregar
              </Button>
            </div>
          </div>

          {/* Cart */}
          {cart.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm text-gray-700">Productos en la venta</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-2 text-xs text-gray-500">Producto</th>
                      <th className="text-center px-4 py-2 text-xs text-gray-500">Cantidad</th>
                      <th className="text-right px-4 py-2 text-xs text-gray-500">Precio Unit.</th>
                      <th className="text-right px-4 py-2 text-xs text-gray-500">Descuento</th>
                      <th className="text-right px-4 py-2 text-xs text-gray-500">Subtotal</th>
                      <th className="text-center px-4 py-2 text-xs text-gray-500">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cart.map((item) => (
                      <tr key={item.productId}>
                        <td className="px-4 py-2 text-sm">{getProductName(item.productId)}</td>
                        <td className="px-4 py-2 text-center">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value))}
                            min="1"
                            className="w-20 text-center"
                          />
                        </td>
                        <td className="px-4 py-2 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-4 py-2 text-right">
                          <Input
                            type="number"
                            value={item.discount}
                            onChange={(e) => handleUpdateDiscount(item.productId, parseFloat(e.target.value))}
                            min="0"
                            step="0.01"
                            className="w-24 text-right"
                          />
                        </td>
                        <td className="px-4 py-2 text-sm text-right">{formatCurrency(calculateSubtotal(item))}</td>
                        <td className="px-4 py-2 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFromCart(item.productId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Totals */}
          {cart.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IVA (16%):</span>
                <span className="text-gray-900">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total:</span>
                <span className="text-gray-900">{formatCurrency(total)}</span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notas</Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
              placeholder="Notas adicionales sobre la venta..."
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600"
            onClick={handleSubmit}
            disabled={cart.length === 0 || !customerId}
          >
            Completar Venta
          </Button>
        </div>
      </div>
    </div>
  );
}
