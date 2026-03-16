import { useState } from "react";
import { Search, Plus, Pencil, Trash2, User, Users, Mail, Phone, MapPin, CreditCard } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Customer } from "../data/inventory";

type CustomersProps = {
  customers: Customer[];
  onAdd: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
};

export function Customers({ customers, onAdd, onEdit, onDelete }: CustomersProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "particular" | "empresa">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "activo" | "inactivo">("all");

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      (customer.companyName?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesType = typeFilter === "all" || customer.customerType === typeFilter;
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-gray-900">Clientes</h2>
          <p className="text-sm text-gray-500 mt-1">{filteredCustomers.length} clientes encontrados</p>
        </div>
        <Button onClick={onAdd} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, empresa o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={typeFilter === "all" ? "default" : "outline"}
            onClick={() => setTypeFilter("all")}
            size="sm"
          >
            Todos
          </Button>
          <Button
            variant={typeFilter === "particular" ? "default" : "outline"}
            onClick={() => setTypeFilter("particular")}
            size="sm"
          >
            Particulares
          </Button>
          <Button
            variant={typeFilter === "empresa" ? "default" : "outline"}
            onClick={() => setTypeFilter("empresa")}
            size="sm"
          >
            Empresas
          </Button>
          <div className="w-px bg-gray-300 mx-1"></div>
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
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  customer.customerType === "empresa" ? "bg-blue-100" : "bg-green-100"
                }`}>
                  {customer.customerType === "empresa" ? (
                    <Users className="w-5 h-5 text-blue-600" />
                  ) : (
                    <User className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm text-gray-900 truncate">{customer.name}</h3>
                  {customer.companyName && (
                    <p className="text-xs text-gray-500 truncate">{customer.companyName}</p>
                  )}
                </div>
              </div>
              <Badge variant={customer.status === "activo" ? "default" : "secondary"}>
                {customer.status}
              </Badge>
            </div>

            <div className="space-y-2 text-xs text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">{customer.city}, {customer.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                <span>Límite: {formatCurrency(customer.creditLimit)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {customer.customerType}
              </Badge>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(customer)}
                  className="h-8 w-8 p-0"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(customer.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron clientes</p>
        </div>
      )}
    </div>
  );
}
