import React, { useState, useEffect } from 'react';

const HomeComponents = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    pacienteNombre: '',
    telefono: '',
    fecha: '',
    hora: '',
    motivo: '',
    duracion: 30,
    estado: 'pendiente'
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/appointments');
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error('Error al obtener citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/appointments/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setAppointments(appointments.filter(apt => apt._id !== id));
        } else {
          alert('Error al eliminar la cita');
        }
      } catch (error) {
        console.error('Error al eliminar cita:', error);
        alert('Error al eliminar la cita');
      }
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment._id);
    setFormData({
      pacienteNombre: appointment.pacienteNombre,
      telefono: appointment.telefono || '',
      fecha: new Date(appointment.fecha).toISOString().split('T')[0],
      hora: appointment.hora,
      motivo: appointment.motivo || '',
      duracion: appointment.duracion || 30,
      estado: appointment.estado
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/appointments/${editingAppointment}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setAppointments(appointments.map(apt => 
          apt._id === editingAppointment ? updatedData.appointment : apt
        ));
        setEditingAppointment(null);
        setFormData({
          pacienteNombre: '',
          telefono: '',
          fecha: '',
          hora: '',
          motivo: '',
          duracion: 30,
          estado: 'pendiente'
        });
      } else {
        alert('Error al actualizar la cita');
      }
    } catch (error) {
      console.error('Error al actualizar cita:', error);
      alert('Error al actualizar la cita');
    }
  };

  const handleCancel = () => {
    setEditingAppointment(null);
    setFormData({
      pacienteNombre: '',
      telefono: '',
      fecha: '',
      hora: '',
      motivo: '',
      duracion: 30,
      estado: 'pendiente'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (estado) => {
    const colors = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'confirmada': 'bg-blue-100 text-blue-800',
      'completada': 'bg-green-100 text-green-800',
      'cancelada': 'bg-red-100 text-red-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-lg">Cargando citas...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Home</h1>
          <p className="text-gray-600">Gestión de citas médicas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Citas</h3>
            <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Pendientes</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {appointments.filter(apt => apt.estado === 'pendiente').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Confirmadas</h3>
            <p className="text-2xl font-bold text-blue-600">
              {appointments.filter(apt => apt.estado === 'confirmada').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Completadas</h3>
            <p className="text-2xl font-bold text-green-600">
              {appointments.filter(apt => apt.estado === 'completada').length}
            </p>
          </div>
        </div>

        {/* Lista de citas */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Citas Programadas</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No hay citas programadas
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingAppointment === appointment._id ? (
                          <input
                            type="text"
                            value={formData.pacienteNombre}
                            onChange={(e) => setFormData({...formData, pacienteNombre: e.target.value})}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        ) : (
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.pacienteNombre}
                            </div>
                            {appointment.telefono && (
                              <div className="text-sm text-gray-500">
                                {appointment.telefono}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingAppointment === appointment._id ? (
                          <input
                            type="date"
                            value={formData.fecha}
                            onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        ) : (
                          formatDate(appointment.fecha)
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingAppointment === appointment._id ? (
                          <input
                            type="time"
                            value={formData.hora}
                            onChange={(e) => setFormData({...formData, hora: e.target.value})}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        ) : (
                          appointment.hora
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingAppointment === appointment._id ? (
                          <select
                            value={formData.estado}
                            onChange={(e) => setFormData({...formData, estado: e.target.value})}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmada">Confirmada</option>
                            <option value="completada">Completada</option>
                            <option value="cancelada">Cancelada</option>
                          </select>
                        ) : (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.estado)}`}>
                            {appointment.estado}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {editingAppointment === appointment._id ? (
                          <input
                            type="text"
                            value={formData.motivo}
                            onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Motivo de la cita"
                          />
                        ) : (
                          appointment.motivo || 'Sin especificar'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {editingAppointment === appointment._id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSave}
                              className="text-green-600 hover:text-green-900"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={handleCancel}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(appointment)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(appointment._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeComponents;