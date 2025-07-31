import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import { Outlet, useLocation } from "react-router-dom";

export default function MainLayout() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const path = location.pathname;
    
    // Actualizar las rutas para que coincidan con la nueva configuración
    if (path === '/dashboard') {
      setActiveSection('dashboard');
    } else if (path === '/dashboard/pacientes') {
      setActiveSection('pacientes');
    } else if (path === '/dashboard/receta') {
      setActiveSection('generar-receta');
    } else if (path === '/dashboard/historyMedical') {
      setActiveSection('historial-medico');
    } else if (path === '/dashboard/configuracion') {
      setActiveSection('settings');
    }
  }, [location.pathname]);

  const hideSidebar = location.pathname === "/";

  return (
    <div className="flex min-h-screen">
      {!hideSidebar && (
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
      )}
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
}