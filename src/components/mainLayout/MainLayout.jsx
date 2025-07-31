import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import { Outlet, useLocation } from "react-router-dom";

export default function MainLayout() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/home') {
      setActiveSection('dashboard');
    } else if (path === '/pacientes') {
      setActiveSection('pacientes');
    } else if (path === '/generar-receta') {
      setActiveSection('generar-receta');
    } else if (path === '/historyMedical') {
      setActiveSection('historial-medico');
    } else if (path === '/configuracion') {
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