import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Building2, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Supplier } from "../data/inventory";

type SuppliersProps = {
  suppliers: Supplier[];
  onAdd: () => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
};

export function Suppliers({ suppliers, onAdd, onEdit, onDelete }: SuppliersProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "activo" | "inactivo">("all");

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(search.toLowerCase()) ||
      supplier.companyName.toLowerCase().includes(search.toLowerCase()) ||
      supplier.rfc.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-gray-900">Proveedores</h2>
          <p className="text-sm text-gray-500 mt-1">{filteredSuppliers.length} proveedores encontrados</p>
        </div>
        <Button onClick={onAdd} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Proveedor
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, empresa o RFC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
            size="sm"
          >
            Todos
          </Button>
          <Button
            variant={statusFilter === "activo" ? "default" : "outline"}
            onClick={() => setStatusFilter("activo")}
            size="sm"
          >
            Activos
          </Button>
          <Button
            variant={statusFilter === "inactivo" ? "default" : "outline"}
            onClick={() => setStatusFilter("inactivo")}
            size="sm"
          >
            Inactivos
          </Button>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-900">{supplier.name}</h3>
                  <p className="text-xs text-gray-500">{supplier.companyName}</p>
                </div>
              </div>
              <Badge variant={supplier.status === "activo" ? "default" : "secondary"}>
                {supplier.status}
              </Badge>
            </div>

            <div className="space-y-2 text-xs text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">{supplier.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{supplier.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">{supplier.city}, {supplier.state}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-gray-500">Contacto: </span>
                <span className="text-gray-700">{supplier.contactPerson}</span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(supplier)}
                  className="h-8 w-8 p-0"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(supplier.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron proveedores</p>
        </div>
      )}
    </div>
  );
}
