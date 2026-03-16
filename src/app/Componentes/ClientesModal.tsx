import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Customer } from "../data/inventory";

type CustomerModalProps = {
  customer: Customer | null;
  onSave: (customer: Customer) => void;
  onClose: () => void;
};

export function CustomerModal({ customer, onSave, onClose }: CustomerModalProps) {
  const [formData, setFormData] = useState<Customer>({
    id: "",
    name: "",
    companyName: "",
    rfc: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    customerType: "particular",
    creditLimit: 5000,
    status: "activo",
    createdAt: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (customer) {
      setFormData(customer);
    }
  }, [customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer = {
      ...formData,
      id: formData.id || `c${Date.now()}`,
    };
    onSave(newCustomer);
  };

  const handleChange = (field: keyof Customer, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-gray-900">
            {customer ? "Editar Cliente" : "Nuevo Cliente"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="customerType">Tipo de Cliente *</Label>
              <select
                id="customerType"
                value={formData.customerType}
                onChange={(e) => handleChange("customerType", e.target.value as "particular" | "empresa")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="particular">Particular</option>
                <option value="empresa">Empresa</option>
              </select>
            </div>
            <div>
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                placeholder="Ej: Juan Pérez García"
              />
            </div>
            {formData.customerType === "empresa" && (
              <>
                <div>
                  <Label htmlFor="companyName">Razón Social</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName || ""}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                    placeholder="Ej: Construcciones SA"
                  />
                </div>
                <div>
                  <Label htmlFor="rfc">RFC</Label>
                  <Input
                    id="rfc"
                    value={formData.rfc || ""}
                    onChange={(e) => handleChange("rfc", e.target.value)}
                    placeholder="Ej: CRA850315ABC"
                  />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
                placeholder="555-1234-567"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Dirección *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                required
                placeholder="Calle, Número, Colonia"
              />
            </div>
            <div>
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                required
                placeholder="Ej: Ciudad de México"
              />
            </div>
            <div>
              <Label htmlFor="state">Estado *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
                required
                placeholder="Ej: CDMX"
              />
            </div>
            <div>
              <Label htmlFor="zipCode">Código Postal *</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleChange("zipCode", e.target.value)}
                required
                placeholder="12345"
              />
            </div>
            <div>
              <Label htmlFor="creditLimit">Límite de Crédito *</Label>
              <Input
                id="creditLimit"
                type="number"
                value={formData.creditLimit}
                onChange={(e) => handleChange("creditLimit", parseFloat(e.target.value))}
                required
                min="0"
                step="100"
              />
            </div>
            <div>
              <Label htmlFor="status">Estado *</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value as "activo" | "inactivo")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
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
          >
            {customer ? "Guardar Cambios" : "Crear Cliente"}
          </Button>
        </div>
      </div>
    </div>
  );
}
