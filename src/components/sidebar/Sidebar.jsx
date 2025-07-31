import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  Users,
  FileText,
  FolderOpen,
  Settings,
  LogOut,
  Activity,
  Plus,
  Calendar,
  User,
  Phone,
  Mail,
  Clock,
  X,
  Save,
  Check
} from 'lucide-react';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const handleNavigation = (path) => {
    window.location.href = path;
  };
  
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [isLoadingPatient, setIsLoadingPatient] = useState(false);
  const [isLoadingAppointment, setIsLoadingAppointment] = useState(false);
  
  const patientButtonRef = useRef(null);
  const appointmentButtonRef = useRef(null);
  
  const [patientData, setPatientData] = useState({
    nombreCompleto: '',
    telefono: '',
    correoElectronico: ''
  });
  
  const [appointmentData, setAppointmentData] = useState({
    pacienteNombre: '',
    telefono: '',
    fecha: '',
    hora: '',
    motivo: ''
  });

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Home', path: '/home' },
    { id: 'pacientes', icon: Users, label: 'Pacientes', path: '/pacientes' },
    { id: 'historial-medico', icon: FolderOpen, label: 'Historial Médico', path: '/historyMedical' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPatientModal && !event.target.closest('.patient-modal') && !event.target.closest('.patient-button')) {
        setShowPatientModal(false);
      }
      if (showAppointmentModal && !event.target.closest('.appointment-modal') && !event.target.closest('.appointment-button')) {
        setShowAppointmentModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPatientModal, showAppointmentModal]);

  const handleCreateQuickPatient = async () => {
    if (!patientData.nombreCompleto.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    setIsLoadingPatient(true);
    try {
      const response = await fetch('http://localhost:4000/api/patients/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });

      if (response.ok) {
        setTimeout(() => {
          setPatientData({ nombreCompleto: '', telefono: '', correoElectronico: '' });
          setShowPatientModal(false);
          setIsLoadingPatient(false);
          
          showSuccessMessage('Paciente creado exitosamente', 'green');
        }, 1000);
      } else {
        setIsLoadingPatient(false);
        alert('Error al crear paciente');
      }
    } catch (error) {
      setIsLoadingPatient(false);
      alert('Error de conexión');
    }
  };

  const handleCreateQuickAppointment = async () => {
    console.log('=== FRONTEND: Creando cita ===');
    console.log('Datos a enviar:', appointmentData);


    if (!appointmentData.pacienteNombre.trim() || !appointmentData.fecha || !appointmentData.hora) {
      alert('Nombre, fecha y hora son obligatorios');
      return;
    }

    setIsLoadingAppointment(true);
    
    try {
      console.log('📡 Enviando petición a API...');
      
      const response = await fetch('http://localhost:4000/api/appointments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          pacienteNombre: appointmentData.pacienteNombre.trim(),
          telefono: appointmentData.telefono.trim(),
          fecha: appointmentData.fecha,
          hora: appointmentData.hora,
          motivo: appointmentData.motivo.trim(),
          duracion: 30
        })
      });

      console.log('📨 Respuesta recibida:', response.status);
      
      const result = await response.json();
      console.log('📋 Datos de respuesta:', result);

      if (response.ok) {
        console.log('✅ Cita creada exitosamente');
        
        setAppointmentData({ 
          pacienteNombre: '', 
          telefono: '', 
          fecha: '', 
          hora: '', 
          motivo: '' 
        });
        setShowAppointmentModal(false);
        setIsLoadingAppointment(false);
        
        showSuccessMessage('Cita agendada exitosamente', 'blue');
        
        console.log('🎉 Proceso completado exitosamente');
        
      } else {
        console.error('❌ Error del servidor:', result);
        setIsLoadingAppointment(false);
        alert(`Error al crear cita: ${result.message || 'Error desconocido'}`);
      }
      
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      setIsLoadingAppointment(false);
      alert('Error de conexión con el servidor');
    }
  };

  const showSuccessMessage = (message, color) => {
    const successDiv = document.createElement('div');
    successDiv.className = `fixed top-4 right-4 bg-${color}-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center z-50`;
    successDiv.innerHTML = `
      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
      </svg>
      ${message}
    `;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-64 h-screen bg-white shadow-sm border-r border-gray-200 flex flex-col relative">
      <div className="flex items-center px-6 py-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-gray-800 block">RG Dental</span>
            <span className="text-xs text-gray-500">Sistema de Gestión</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map(({ id, icon: Icon, label, count, path }) => (
            <div
              key={id}
              onClick={() => {
                onSectionChange(id);
                handleNavigation(path);
              }}
              className={`flex items-center justify-between px-4 py-4 rounded-xl cursor-pointer transition-all duration-200 group ${
                activeSection === id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center">
                <Icon className={`w-5 h-5 mr-4 ${activeSection === id ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                <span className="font-medium text-sm">{label}</span>
              </div>
              {count && (
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  activeSection === id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                }`}>
                  {count}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-2">
          <button 
            ref={patientButtonRef}
            onClick={() => setShowPatientModal(!showPatientModal)}
            className="patient-button w-full flex items-center px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition relative"
          >
            <Plus className="w-4 h-4 text-blue-600 mr-3" />
            <span className="text-sm font-medium text-blue-700">Nuevo Paciente</span>
          </button>

          <button 
            ref={appointmentButtonRef}
            onClick={() => setShowAppointmentModal(!showAppointmentModal)}
            className="appointment-button w-full flex items-center px-4 py-3 bg-green-50 hover:bg-green-100 rounded-xl transition"
          >
            <Calendar className="w-4 h-4 text-green-600 mr-3" />
            <span className="text-sm font-medium text-green-700">Agendar Cita</span>
          </button>
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-gray-200">
        <div className="space-y-2">
          <div
            onClick={() => {
              localStorage.removeItem('token');
              console.log('Cerrando sesión...');
            }}
            className="flex items-center px-4 py-3 rounded-xl cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition"
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span className="font-medium text-sm">Cerrar Sesión</span>
          </div>
        </div>
      </div>

      {showPatientModal && (
        <div className="patient-modal absolute left-full top-0 ml-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-50" style={{ top: '280px' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Nuevo Paciente
            </h3>
            <button 
              onClick={() => setShowPatientModal(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={patientData.nombreCompleto}
                onChange={(e) => setPatientData(prev => ({ ...prev, nombreCompleto: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Carlos García"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={patientData.telefono}
                onChange={(e) => setPatientData(prev => ({ ...prev, telefono: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 123-456-7890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={patientData.correoElectronico}
                onChange={(e) => setPatientData(prev => ({ ...prev, correoElectronico: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: carlos@email.com"
              />
            </div>

            <button
              onClick={handleCreateQuickPatient}
              disabled={isLoadingPatient}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition flex items-center justify-center disabled:opacity-70"
            >
              {isLoadingPatient ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Crear Paciente
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            * Puedes completar el resto de información después en la sección de Pacientes
          </p>
        </div>
      )}

      {showAppointmentModal && (
        <div className="appointment-modal absolute left-full top-0 ml-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-50" style={{ top: '320px' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Agendar Cita
            </h3>
            <button 
              onClick={() => setShowAppointmentModal(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Paciente *
              </label>
              <input
                type="text"
                value={appointmentData.pacienteNombre}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, pacienteNombre: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: María López"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={appointmentData.telefono}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, telefono: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: 123-456-7890"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={appointmentData.fecha}
                  onChange={(e) => setAppointmentData(prev => ({ ...prev, fecha: e.target.value }))}
                  min={today}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora *
                </label>
                <input
                  type="time"
                  value={appointmentData.hora}
                  onChange={(e) => setAppointmentData(prev => ({ ...prev, hora: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo de la Cita
              </label>
              <textarea
                value={appointmentData.motivo}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, motivo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows="2"
                placeholder="Ej: Limpieza dental, revisión..."
              />
            </div>

            <button
              onClick={handleCreateQuickAppointment}
              disabled={isLoadingAppointment}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition flex items-center justify-center disabled:opacity-70"
            >
              {isLoadingAppointment ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Agendando...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Cita
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            * La cita aparecerá en tu dashboard principal
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;