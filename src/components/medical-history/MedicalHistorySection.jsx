import React from 'react';
import InputField from './InputField';

const MedicalHistorySection = ({ patient, isEditing, onChange }) => {
  const historyFields = [
    { field: 'generales', label: 'Generales' },
    { field: 'fisiologicos', label: 'Fisiológicos' },
    { field: 'inmunologicos', label: 'Inmunológicos' },
    { field: 'patologicos', label: 'Patológicos' },
    { field: 'familiares', label: 'Familiares' },
    { field: 'epidemiologicos', label: 'Epidemiológicos' },
    { field: 'ocupacionales', label: 'Ocupacionales' },
    { field: 'farmacologicos', label: 'Farmacológicos' }
  ];

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">ANTECEDENTES</h3>
      {isEditing ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {historyFields.map(({ field, label }) => (
              <InputField
                key={field}
                label={label}
                type="textarea"
                value={patient[field]}
                onChange={(e) => onChange(field, e.target.value)}
                rows={3}
              />
            ))}
          </div>
          <InputField
            label="Especificación de Antecedentes"
            type="textarea"
            value={patient.especificacionAntecedentes}
            onChange={(e) => onChange('especificacionAntecedentes', e.target.value)}
            rows={4}
          />
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {historyFields.map(({ field, label }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
                <div className="p-3 bg-gray-50 rounded border min-h-[80px]">
                  {patient[field] || 'No especificado'}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Especificación de Antecedentes</label>
            <div className="p-3 bg-gray-50 rounded border min-h-[100px]">
              {patient.especificacionAntecedentes || 'No especificado'}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MedicalHistorySection;