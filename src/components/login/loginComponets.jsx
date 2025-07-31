import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Shield } from 'lucide-react';
import Swal from 'sweetalert2';

export default function LoginComponents() {
 const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        Swal.fire({
          title: '¡Bienvenido Doctor!',
          text: 'Has iniciado sesión correctamente.',
          icon: 'success',
          confirmButtonColor: '#3b82f6'
        }).then(() => {
          navigate("/home");
        });
      } else {
        Swal.fire({
          title: 'Error de autenticación',
          text: data.msg || 'Credenciales inválidas.',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Error del servidor',
        text: 'No se pudo conectar con el backend.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-cyan-100 rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-blue-200 rounded-full opacity-50 animate-bounce delay-500"></div>
      </div>

      <div className="relative w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 transition-all duration-300 hover:shadow-3xl">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4 flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
              <div className="text-white text-3xl font-bold">🦷</div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">RG Dental</h1>
            <p className="text-gray-600">Sistema de Gestión Clínica</p>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mt-3"></div>
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800"
                  placeholder="doctor@dentalcare.com"
                />
              </div>
            </div>

            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 px-6 rounded-2xl hover:scale-105 hover:shadow-xl disabled:opacity-70 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <User size={20} />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>
          </div>

          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-gray-500 text-sm">o</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              ¿Necesitas acceso? 
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium ml-1 hover:underline">
                Contacta al administrador
              </a>
            </p>
          </div>
        </form>

        <div className="mt-6 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Sistema Online</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield size={16} />
                <span>Seguro SSL</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>24/7 Disponible</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
