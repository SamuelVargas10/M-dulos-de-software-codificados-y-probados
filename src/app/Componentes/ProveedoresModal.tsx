import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Supplier } from "../data/inventory";

type SupplierModalProps = {
  supplier: Supplier | null;
  onSave: (supplier: Supplier) => void;
  onClose: () => void;
};

export function SupplierModal({ supplier, onSave, onClose }: SupplierModalProps) {
  const [formData, setFormData] = useState<Supplier>({
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
    contactPerson: "",
    paymentTerms: "30 días",
    status: "activo",
    createdAt: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (supplier) {
      setFormData(supplier);
    }
  }, [supplier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSupplier = {
      ...formData,
      id: formData.id || `s${Date.now()}`,
    };
    onSave(newSupplier);
  };

  const handleChange = (field: keyof Supplier, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-gray-900">
            {supplier ? "Editar Proveedor" : "Nuevo Proveedor"}
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
            <div>
              <Label htmlFor="name">Nombre Comercial *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                placeholder="Ej: Truper"
              />
            </div>
            <div>
              <Label htmlFor="companyName">Razón Social *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                required
                placeholder="Ej: Herramientas Truper S.A."
              />
            </div>
            <div>
              <Label htmlFor="rfc">RFC *</Label>
              <Input
                id="rfc"
                value={formData.rfc}
                onChange={(e) => handleChange("rfc", e.target.value)}
                required
                placeholder="Ej: HTR850125A34"
              />
            </div>
            <div>
              <Label htmlFor="contactPerson">Persona de Contacto *</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => handleChange("contactPerson", e.target.value)}
                required
                placeholder="Ej: Juan Pérez"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                placeholder="correo@empresa.com"
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
              <Label htmlFor="paymentTerms">Términos de Pago *</Label>
              <select
                id="paymentTerms"
                value={formData.paymentTerms}
                onChange={(e) => handleChange("paymentTerms", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="15 días">15 días</option>
                <option value="30 días">30 días</option>
                <option value="45 días">45 días</option>
                <option value="60 días">60 días</option>
                <option value="90 días">90 días</option>
              </select>
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
            {supplier ? "Guardar Cambios" : "Crear Proveedor"}
          </Button>
        </div>
      </div>
    </div>
  );
}
