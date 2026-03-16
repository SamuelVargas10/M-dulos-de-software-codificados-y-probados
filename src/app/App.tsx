import { useState } from "react";
import { 
  LayoutDashboard, Package, History, Tag, Menu, AlertTriangle, LogOut,
  Building2, Users, ShoppingCart, FileText, TrendingUp
} from "lucide-react";
import { 
  categories, initialProducts, initialMovements, initialSuppliers, 
  initialCustomers, initialSales, initialSaleDetails, initialInvoices, 
  initialInvoiceDetails, Product, Movement, Supplier, Customer, Sale, 
  SaleDetail, Invoice, InvoiceDetail 
} from "./data/inventory";
import { Dashboard } from "./components/Dashboard";
import { ProductsTable } from "./components/ProductsTable";
import { MovementsLog } from "./components/MovementsLog";
import { Suppliers } from "./components/Suppliers";
import { Customers } from "./components/Customers";
import { Sales } from "./components/Sales";
import { Invoices } from "./components/Invoices";
import { ProductModal } from "./components/ProductModal";
import { MovementModal } from "./components/MovementModal";
import { SupplierModal } from "./components/SupplierModal";
import { CustomerModal } from "./components/CustomerModal";
import { SaleModal } from "./components/SaleModal";
import { SaleDetailModal } from "./components/SaleDetailModal";
import { Login } from "./components/Login";

type View = "dashboard" | "products" | "movements" | "suppliers" | "customers" | "sales" | "invoices";
type SessionUser = { name: string; role: string; initials: string };

export default function App() {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [view, setView] = useState<View>("dashboard");
  const [products, setProducts] = useState(initialProducts);
  const [movements, setMovements] = useState(initialMovements);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [customers, setCustomers] = useState(initialCustomers);
  const [sales, setSales] = useState(initialSales);
  const [saleDetails, setSaleDetails] = useState(initialSaleDetails);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [invoiceDetails, setInvoiceDetails] = useState(initialInvoiceDetails);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals
  const [productModal, setProductModal] = useState<{ open: boolean; product?: Product | null }>({ open: false });
  const [movementModal, setMovementModal] = useState<{ open: boolean; product?: Product }>({ open: false });
  const [supplierModal, setSupplierModal] = useState<{ open: boolean; supplier?: Supplier | null }>({ open: false });
  const [customerModal, setCustomerModal] = useState<{ open: boolean; customer?: Customer | null }>({ open: false });
  const [saleModal, setSaleModal] = useState(false);
  const [saleDetailModal, setSaleDetailModal] = useState<{ open: boolean; sale?: Sale }>({ open: false });

  const handleSaveProduct = (product: Product) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      return exists ? prev.map((p) => (p.id === product.id ? product : p)) : [...prev, product];
    });
    setProductModal({ open: false });
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("¿Eliminar este producto del inventario?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSaveMovement = (movement: Movement) => {
    setMovements((prev) => [movement, ...prev]);
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== movement.productId) return p;
        const newStock = Math.max(0, p.stock + movement.quantity);
        return { ...p, stock: newStock, lastUpdated: movement.date };
      })
    );
    setMovementModal({ open: false });
  };

  const handleSaveSupplier = (supplier: Supplier) => {
    setSuppliers((prev) => {
      const exists = prev.find((s) => s.id === supplier.id);
      return exists ? prev.map((s) => (s.id === supplier.id ? supplier : s)) : [...prev, supplier];
    });
    setSupplierModal({ open: false });
  };

  const handleDeleteSupplier = (id: string) => {
    if (confirm("¿Eliminar este proveedor?")) {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleSaveCustomer = (customer: Customer) => {
    setCustomers((prev) => {
      const exists = prev.find((c) => c.id === customer.id);
      return exists ? prev.map((c) => (c.id === customer.id ? customer : c)) : [...prev, customer];
    });
    setCustomerModal({ open: false });
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm("¿Eliminar este cliente?")) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleSaveSale = (sale: Sale, details: SaleDetail[]) => {
    setSales((prev) => [...prev, sale]);
    setSaleDetails((prev) => [...prev, ...details]);
    
    // Update product stock
    setProducts((prev) =>
      prev.map((p) => {
        const soldItem = details.find((d) => d.productId === p.id);
        if (!soldItem) return p;
        return { ...p, stock: p.stock - soldItem.quantity, lastUpdated: sale.date };
      })
    );

    // Create invoice
    const invoice: Invoice = {
      id: `f${Date.now()}`,
      saleId: sale.id,
      invoiceNumber: `FAC-2026-${String(invoices.length + 1).padStart(3, "0")}`,
      customerId: sale.customerId,
      issueDate: sale.date,
      dueDate: sale.date,
      subtotal: sale.subtotal,
      tax: sale.tax,
      total: sale.total,
      status: sale.status === "completada" ? "pagada" : "pendiente",
      paymentMethod: sale.paymentMethod,
      notes: sale.notes,
    };
    setInvoices((prev) => [...prev, invoice]);

    // Create invoice details
    const invDetails: InvoiceDetail[] = details.map((d, index) => {
      const product = products.find((p) => p.id === d.productId);
      return {
        id: `fd${Date.now()}-${index}`,
        invoiceId: invoice.id,
        productId: d.productId,
        description: product?.name || "",
        quantity: d.quantity,
        unitPrice: d.unitPrice,
        discount: d.discount,
        subtotal: d.subtotal,
      };
    });
    setInvoiceDetails((prev) => [...prev, ...invDetails]);

    // Create movement
    details.forEach((d) => {
      const movement: Movement = {
        id: `m${Date.now()}-${d.productId}`,
        productId: d.productId,
        type: "salida",
        quantity: -d.quantity,
        date: sale.date,
        reason: "Venta a cliente",
        user: sale.userId,
      };
      setMovements((prev) => [movement, ...prev]);
    });

    setSaleModal(false);
  };

  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;

  if (!session) {
    return <Login onLogin={(user) => setSession(user)} />;
  }

  const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "products", label: "Productos", icon: <Package className="w-5 h-5" /> },
    { id: "movements", label: "Movimientos", icon: <History className="w-5 h-5" /> },
    { id: "suppliers", label: "Proveedores", icon: <Building2 className="w-5 h-5" /> },
    { id: "customers", label: "Clientes", icon: <Users className="w-5 h-5" /> },
    { id: "sales", label: "Ventas", icon: <ShoppingCart className="w-5 h-5" /> },
    { id: "invoices", label: "Facturas", icon: <FileText className="w-5 h-5" /> },
  ];

  const viewTitles = {
    dashboard: "Dashboard",
    products: "Productos",
    movements: "Movimientos de Inventario",
    suppliers: "Proveedores",
    customers: "Clientes",
    sales: "Ventas",
    invoices: "Facturas",
  };

  const viewSubtitles = {
    dashboard: "Resumen general del inventario",
    products: `${products.length} productos registrados`,
    movements: `${movements.length} movimientos registrados`,
    suppliers: `${suppliers.length} proveedores registrados`,
    customers: `${customers.length} clientes registrados`,
    sales: `${sales.length} ventas registradas`,
    invoices: `${invoices.length} facturas emitidas`,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white" style={{ fontSize: "1rem", lineHeight: 1.2 }}>FerroStock</h1>
              <p className="text-gray-400" style={{ fontSize: "0.7rem" }}>Gestión de Inventario</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setView(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${view === item.id ? "bg-orange-500 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
            >
              {item.icon}
              {item.label}
              {item.id === "products" && lowStockCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{lowStockCount}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Low stock warning */}
        {lowStockCount > 0 && (
          <div className="m-4 p-3 bg-red-900/50 rounded-lg border border-red-800">
            <div className="flex items-center gap-2 text-red-300">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs">{lowStockCount} producto(s) con stock bajo</span>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
              <span className="text-orange-400 text-xs">{session.initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{session.name}</p>
              <p className="text-xs text-gray-500">{session.role}</p>
            </div>
            <button onClick={() => setSession(null)} title="Cerrar sesión"
              className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-gray-900">{viewTitles[view]}</h1>
              <p className="text-xs text-gray-400 mt-0.5">{viewSubtitles[view]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="hidden sm:block">FerroStock Pro</span>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {view === "dashboard" && (
            <Dashboard products={products} categories={categories} movements={movements} />
          )}
          {view === "products" && (
            <ProductsTable
              products={products}
              categories={categories}
              onAdd={() => setProductModal({ open: true, product: null })}
              onEdit={(p) => setProductModal({ open: true, product: p })}
              onDelete={handleDeleteProduct}
              onMovement={(p) => setMovementModal({ open: true, product: p })}
            />
          )}
          {view === "movements" && (
            <MovementsLog movements={movements} products={products} />
          )}
          {view === "suppliers" && (
            <Suppliers
              suppliers={suppliers}
              onAdd={() => setSupplierModal({ open: true, supplier: null })}
              onEdit={(s) => setSupplierModal({ open: true, supplier: s })}
              onDelete={handleDeleteSupplier}
            />
          )}
          {view === "customers" && (
            <Customers
              customers={customers}
              onAdd={() => setCustomerModal({ open: true, customer: null })}
              onEdit={(c) => setCustomerModal({ open: true, customer: c })}
              onDelete={handleDeleteCustomer}
            />
          )}
          {view === "sales" && (
            <Sales
              sales={sales}
              customers={customers}
              saleDetails={saleDetails}
              onAdd={() => setSaleModal(true)}
              onView={(s) => setSaleDetailModal({ open: true, sale: s })}
            />
          )}
          {view === "invoices" && (
            <Invoices
              invoices={invoices}
              customers={customers}
              invoiceDetails={invoiceDetails}
              onView={(i) => {
                const sale = sales.find((s) => s.id === i.saleId);
                if (sale) setSaleDetailModal({ open: true, sale });
              }}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {productModal.open && (
        <ProductModal
          product={productModal.product}
          categories={categories}
          onSave={handleSaveProduct}
          onClose={() => setProductModal({ open: false })}
        />
      )}
      {movementModal.open && movementModal.product && (
        <MovementModal
          product={movementModal.product}
          onSave={handleSaveMovement}
          onClose={() => setMovementModal({ open: false })}
        />
      )}
      {supplierModal.open && (
        <SupplierModal
          supplier={supplierModal.supplier || null}
          onSave={handleSaveSupplier}
          onClose={() => setSupplierModal({ open: false })}
        />
      )}
      {customerModal.open && (
        <CustomerModal
          customer={customerModal.customer || null}
          onSave={handleSaveCustomer}
          onClose={() => setCustomerModal({ open: false })}
        />
      )}
      {saleModal && (
        <SaleModal
          customers={customers}
          products={products}
          onSave={handleSaveSale}
          onClose={() => setSaleModal(false)}
          currentUser={session.name}
        />
      )}
      {saleDetailModal.open && saleDetailModal.sale && (
        <SaleDetailModal
          sale={saleDetailModal.sale}
          saleDetails={saleDetails}
          customer={customers.find((c) => c.id === saleDetailModal.sale?.customerId)}
          products={products}
          onClose={() => setSaleDetailModal({ open: false })}
        />
      )}
    </div>
  );
}
