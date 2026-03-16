import { createBrowserRouter } from "react-router";
import { MainLayout } from "./layouts/MainLayout";
import { Dashboard } from "./components/Dashboard";
import { ProductsTable } from "./components/ProductsTable";
import { MovementsLog } from "./components/MovementsLog";
import { Suppliers } from "./components/Suppliers";
import { Customers } from "./components/Customers";
import { Sales } from "./components/Sales";
import { Invoices } from "./components/Invoices";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <div>Dashboard</div> },
      { path: "products", element: <div>Products</div> },
      { path: "movements", element: <div>Movements</div> },
      { path: "suppliers", element: <div>Suppliers</div> },
      { path: "customers", element: <div>Customers</div> },
      { path: "sales", element: <div>Sales</div> },
      { path: "invoices", element: <div>Invoices</div> },
    ],
  },
]);
