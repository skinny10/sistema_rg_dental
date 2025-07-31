import React from 'react';

const RecetaList = ({ 
  recetas, 
  generatePDF, 
  deleteReceta, 
  viewReceta,
  showPreview,
  selectedReceta,
  setShowPreview
}) => {
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recetas Guardadas</h2>
          <p className="text-sm text-gray-600">Historial de recetas generadas</p>
        </div>
        
        <div className="p-6">
          {recetas.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recetas guardadas</h3>
              <p className="text-gray-500">Las recetas que genere aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recetas.map((receta, index) => (
                <div key={receta.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          #{recetas.length - index}
                        </span>
                        <h3 className="font-semibold text-gray-900">{receta.nombrePaciente}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Dr. {receta.nombreDoctor}</p>
                      <p className="text-xs text-gray-500">{receta.fechaGeneracion}</p>
                      {receta.diagnostico && (
                        <p className="text-xs text-gray-500 mt-1">Diagnóstico: {receta.diagnostico}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewReceta(receta)}
                        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors border border-blue-200"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => generatePDF(receta)}
                        className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors border border-green-200"
                      >
                        PDF
                      </button>
                      <button
                        onClick={() => deleteReceta(receta.id)}
                        className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors border border-red-200"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de vista previa profesional */}
      {showPreview && selectedReceta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Vista Previa - Receta Médica</h2>
                <p className="text-sm text-gray-600">{selectedReceta.nombrePaciente}</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {/* Vista previa de la receta profesional */}
              <div className="bg-white border-2 border-gray-300 rounded-lg p-8 mb-6" style={{aspectRatio: '1.414/1'}}>
                {/* Header profesional */}
                <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">RG DENTAL</h1>
                  <p className="text-gray-600">CLÍNICA ODONTOLÓGICA</p>
                  <div className="mt-3">
                    <p className="font-semibold text-gray-700">Dr. {selectedReceta.nombreDoctor}</p>
                    <p className="text-sm text-gray-600">Cédula Profesional: {selectedReceta.cedulaDoctor}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                  {/* Información del paciente */}
                  <div className="col-span-2">
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm border-b border-gray-300 pb-1">
                      INFORMACIÓN DEL PACIENTE
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Nombre:</span> {selectedReceta.nombrePaciente}</p>
                      {selectedReceta.edadPaciente && (
                        <p><span className="font-medium">Edad:</span> {selectedReceta.edadPaciente} años</p>
                      )}
                      {selectedReceta.fechaNacimiento && (
                        <p><span className="font-medium">Fecha de Nacimiento:</span> {new Date(selectedReceta.fechaNacimiento).toLocaleDateString('es-ES')}</p>
                      )}
                      {selectedReceta.diagnostico && (
                        <p><span className="font-medium">Diagnóstico:</span> {selectedReceta.diagnostico}</p>
                      )}
                    </div>
                  </div>

                  {/* Fecha */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm border-b border-gray-300 pb-1">
                      FECHA
                    </h3>
                    <p className="text-sm">{selectedReceta.fechaGeneracion}</p>
                  </div>
                </div>

                {/* Prescripción */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-3xl font-bold text-gray-800">℞</span>
                    <h3 className="font-semibold text-gray-800 text-lg">PRESCRIPCIÓN</h3>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border">
                    <div className="space-y-2 text-sm">
                      {selectedReceta.medicamentos.split('\n').map((med, index) => (
                        med.trim() && (
                          <p key={index} className="border-b border-gray-200 pb-1 last:border-b-0">
                            {med.trim()}
                          </p>
                        )
                      ))}
                    </div>
                  </div>
                </div>

                {/* Indicaciones */}
                {selectedReceta.indicaciones && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm">INDICACIONES:</h3>
                    <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                      <p className="text-sm text-gray-700">{selectedReceta.indicaciones}</p>
                    </div>
                  </div>
                )}

                {/* Firma */}
                <div className="mt-8 pt-6 border-t border-gray-300">
                  <div className="flex justify-end">
                    <div className="text-center">
                      <div className="w-48 border-t border-gray-800 mb-2"></div>
                      <p className="font-semibold text-sm text-gray-800">Dr. {selectedReceta.nombreDoctor}</p>
                      <p className="text-xs text-gray-600">Cédula: {selectedReceta.cedulaDoctor}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4">
                <button
                  onClick={() => generatePDF(selectedReceta)}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Generar PDF
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecetaList;