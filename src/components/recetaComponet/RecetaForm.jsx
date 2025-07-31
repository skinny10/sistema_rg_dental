import React from 'react';

const RecetaForm = ({ 
  formData, 
  handleInputChange, 
  handleSubmit, 
  loading 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Nueva Receta Médica</h2>
        <p className="text-sm text-gray-600">Complete los datos del paciente y la prescripción</p>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Información del doctor */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Información del Doctor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Doctor *
              </label>
              <input
                type="text"
                name="nombreDoctor"
                value={formData.nombreDoctor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dr. Juan Pérez"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cédula Profesional *
              </label>
              <input
                type="text"
                name="cedulaDoctor"
                value={formData.cedulaDoctor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1234567"
                required
              />
            </div>
          </div>
        </div>

        {/* Información del paciente */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Información del Paciente</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Paciente *
              </label>
              <input
                type="text"
                name="nombrePaciente"
                value={formData.nombrePaciente}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="María García López"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edad
                </label>
                <input
                  type="number"
                  name="edadPaciente"
                  value={formData.edadPaciente}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="25"
                  min="0"
                  max="120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnóstico
              </label>
              <input
                type="text"
                name="diagnostico"
                value={formData.diagnostico}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Diagnóstico médico"
              />
            </div>
          </div>
        </div>

        {/* Prescripción médica */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Prescripción Médica</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medicamentos y Dosis *
              </label>
              <textarea
                name="medicamentos"
                value={formData.medicamentos}
                onChange={handleInputChange}
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ejemplo:&#10;• Amoxicilina 500mg - 1 cápsula cada 8 horas por 7 días&#10;• Ibuprofeno 400mg - 1 tableta cada 12 horas por 3 días&#10;• Omeprazol 20mg - 1 cápsula en ayunas por 5 días"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Escriba cada medicamento en una línea separada</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Indicaciones Adicionales
              </label>
              <textarea
                name="indicaciones"
                value={formData.indicaciones}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Recomendaciones especiales, cuidados, próxima cita, etc."
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            </div>
          ) : (
            'Guardar Receta'
          )}
        </button>
      </div>
    </div>
  );
};

export default RecetaForm;