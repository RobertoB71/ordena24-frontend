import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "../hooks/Auth/useAuth";

import Home from "../pages/Public/Home";
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
        <span className="text-lg text-gray-600">Cargando sesión...</span>
      </div>
    );
  }

  const isAuthenticated = !!user;

  return (
    <Router>
      <Routes>
        {/* Página pública */}
        <Route path="/" element={<Home />} />

        {/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          }
        />

        {/* Register */}
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Register />
          }
        />

        {/* Admin */}
        <Route element={<RoleRoute />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/categories" element={<Admin />} />
        </Route>

        {/* Not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
