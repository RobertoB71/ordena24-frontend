import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "../hooks/Auth/useAuth";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Public/Home";
import Menu from "../pages/Public/Menu";
import ProductDetail from "../pages/Public/ProductDetail";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import NotFound from "../pages/Error/NotFound";
import Admin from "../pages/Admin/Admin";
import RoleRoute from "./RoleRoute";

const AppRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg text-gray-600">Cargando sesion...</span>
      </div>
    );
  }

  const isAuthenticated = !!user;

  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:id" element={<ProductDetail />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <Register />
            }
          />

          <Route element={<RoleRoute />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/products" element={<Admin />} />
            <Route path="/admin/categories" element={<Admin />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
