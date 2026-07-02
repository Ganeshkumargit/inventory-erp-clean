import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Suppliers from "./pages/Suppliers";
import Documents from "./pages/Documents";
import Purchases from "./pages/Purchases";
import Stock from "./pages/Stock";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Users from "./pages/Users";

import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;