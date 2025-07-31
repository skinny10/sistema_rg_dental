import React from 'react';
import InputField from './InputField';
import InfoDisplay from './InfoDisplay';

const ClinicalExamSection = ({ patient, isEditing, onChange }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">EXAMEN CLÍNICO</h3>
      {isEditing ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <InputField
              label="Estado General"
              type="textarea"
              value={patient.estadoGeneral}
              onChange={(e) => onChange('estadoGeneral', e.target.value)}
              rows={4}
            />
            <InputField
              label="Peso"
              value={patient.peso}
              onChange={(e) => onChange('peso', e.target.value)}
              placeholder="kg"
            />
            <InputField
              label="Talla"
              value={patient.talla}
              onChange={(e) => onChange('talla', e.target.value)}
              placeholder="cm"
            />
          </div>
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Evaluación Odontológica</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Examen Extraoral"
                type="textarea"
                value={patient.examenExtraoral}
                onChange={(e) => onChange('examenExtraoral', e.target.value)}
                rows={6}
              />
              <InputField
                label="Examen Intraoral"
                type="textarea"
                value={patient.examenIntraoral}
                onChange={(e) => onChange('examenIntraoral', e.target.value)}
                rows={6}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Estado General</label>
              <div className="p-3 bg-gray-50 rounded border min-h-[100px]">
                {patient.estadoGeneral || 'No especificado'}
              </div>
            </div>
            <InfoDisplay label="Peso" value={patient.peso ? `${patient.peso} kg` : ''} />
            <InfoDisplay label="Talla" value={patient.talla ? `${patient.talla} cm` : ''} />
          </div>
          <div>
            <h5 className="text-md font-semibold text-gray-600 mb-3">Evaluación Odontológica</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Examen Extraoral</label>
                <div className="p-3 bg-gray-50 rounded border min-h-[150px]">
                  {patient.examenExtraoral || 'No especificado'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Examen Intraoral</label>
                <div className="p-3 bg-gray-50 rounded border min-h-[150px]">
                  {patient.examenIntraoral || 'No especificado'}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClinicalExamSection;