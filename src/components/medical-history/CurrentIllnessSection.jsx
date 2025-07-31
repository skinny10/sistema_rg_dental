import React from 'react';
import { Calendar } from 'lucide-react';
import InputField from './InputField';
import InfoDisplay from './InfoDisplay';

const CurrentIllnessSection = ({ patient, isEditing, onChange }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">ENFERMEDAD ACTUAL</h3>
      {isEditing ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <InputField
              label="Fecha"
              type="date"
              value={patient.fecha}
              onChange={(e) => onChange('fecha', e.target.value)}
            />
            <InputField
              label="Hora de Atención"
              type="time"
              value={patient.horaAtencion}
              onChange={(e) => onChange('horaAtencion', e.target.value)}
            />
            <InputField
              label="Motivo"
              value={patient.motivo}
              onChange={(e) => onChange('motivo', e.target.value)}
            />
            <InputField
              label="Tipo de Enfermedad"
              value={patient.tipoEnfermedad}
              onChange={(e) => onChange('tipoEnfermedad', e.target.value)}
            />
            <InputField
              label="Síntomas Principales"
              value={patient.sintomasPrincipales}
              onChange={(e) => onChange('sintomasPrincipales', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Relato Cronológico"
              type="textarea"
              value={patient.relatoCronologico}
              onChange={(e) => onChange('relatoCronologico', e.target.value)}
              rows={4}
            />
            <InputField
              label="Funciones Biológicas"
              type="textarea"
              value={patient.funcionesBiologicas}
              onChange={(e) => onChange('funcionesBiologicas', e.target.value)}
              rows={4}
            />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <InfoDisplay 
              label="Fecha" 
              value={patient.fecha} 
              icon={<Calendar className="w-4 h-4 text-blue-500" />}
            />
            <InfoDisplay label="Hora de Atención" value={patient.horaAtencion} />
            <InfoDisplay label="Motivo" value={patient.motivo} />
            <InfoDisplay label="Tipo de Enfermedad" value={patient.tipoEnfermedad} />
            <InfoDisplay label="Síntomas Principales" value={patient.sintomasPrincipales} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Relato Cronológico</label>
              <div className="p-3 bg-gray-50 rounded border min-h-[100px]">
                {patient.relatoCronologico || 'No especificado'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Funciones Biológicas</label>
              <div className="p-3 bg-gray-50 rounded border min-h-[100px]">
                {patient.funcionesBiologicas || 'No especificado'}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CurrentIllnessSection;