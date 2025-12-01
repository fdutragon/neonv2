import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Maintenance from "@/pages/Maintenance";
import VehicleSearch from "@/pages/VehicleSearch";
import VehicleDetail from "@/pages/VehicleDetail";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminVehicles from "@/pages/admin/Vehicles";
import AdminVehicleForm from "@/pages/admin/VehicleForm";
import Layout from "@/components/Layout";
import AdminLayout from "@/components/admin/AdminLayout";
import { PWAUpdatePrompt } from "@/components/PWAUpdatePrompt";
import { InstallPWA } from "@/components/InstallPWA";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/stores/appStore";

export default function App() {
  const { setAuth } = useAppStore();

  useEffect(() => {
    // Verificar sessão existente ao carregar o app
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAuth(true, session.user);
      }
    });

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(true, session.user);
      } else {
        setAuth(false, null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setAuth]);

  return (
    <>
      <OfflineIndicator />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Maintenance />} />
            <Route path="search" element={<VehicleSearch />} />
            <Route path="vehicle/:id" element={<VehicleDetail />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="vehicles" element={<AdminVehicles />} />
            <Route path="vehicles/new" element={<AdminVehicleForm />} />
            <Route path="vehicles/edit/:id" element={<AdminVehicleForm />} />
          </Route>
        </Routes>
      </Router>
      <PWAUpdatePrompt />
      <InstallPWA />
    </>
  );
}
