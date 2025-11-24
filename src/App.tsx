import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import VehicleSearch from "@/pages/VehicleSearch";
import VehicleDetail from "@/pages/VehicleDetail";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminVehicles from "@/pages/admin/Vehicles";
import AdminVehicleForm from "@/pages/admin/VehicleForm";
import Layout from "@/components/Layout";
import AdminLayout from "@/components/admin/AdminLayout";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
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
  );
}
