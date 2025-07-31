import React from 'react';
import { Heart } from 'lucide-react';
import InputField from './InputField';
import InfoDisplay from './InfoDisplay';

const PersonalDataSection = ({ patient, isEditing, onChange }) => {
  const sexOptions = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Femenino', label: 'Femenino' }
  ];

  const bloodTypeOptions = [
    { value: 'A+', label: 'A+' }, { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' }, { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' }, { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' }, { value: 'O-', label: 'O-' }
  ];

  const maritalStatusOptions = [
    { value: 'Soltero', label: 'Soltero' },
    { value: 'Casado', label: 'Casado' },
    { value: 'Divorciado', label: 'Divorciado' },
    { value: 'Viudo', label: 'Viudo' }
  ];

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Datos Personales</h3>
      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <InputField
            label="Nombre Completo"
            value={patient.nombreCompleto}
            onChange={(e) => onChange('nombreCompleto', e.target.value)}
            required
          />
          <InputField
            label="Correo Electrónico"
            type="email"
            value={patient.correoElectronico}
            onChange={(e) => onChange('correoElectronico', e.target.value)}
          />
          <InputField
            label="Telefono"
            type="number"
            value={patient.telefono}
            onChange={(e) => onChange('telefono', e.target.value)}
          />
          <InputField
            label="Sexo"
            type="select"
            value={patient.sexo}
            onChange={(e) => onChange('sexo', e.target.value)}
            options={sexOptions}
          />
          <InputField
            label="Edad"
            type="number"
            value={patient.edad}
            onChange={(e) => onChange('edad', e.target.value)}
          />
          <InputField
            label="Tipo de Sangre"
            type="select"
            value={patient.tipoSangre}
            onChange={(e) => onChange('tipoSangre', e.target.value)}
            options={bloodTypeOptions}
          />
          <InputField
            label="CURP"
            value={patient.curp}
            onChange={(e) => onChange('curp', e.target.value)}
          />
          <InputField
            label="DNI"
            value={patient.dni}
            onChange={(e) => onChange('dni', e.target.value)}
          />
          <InputField
            label="Estado Civil"
            type="select"
            value={patient.estadoCivil}
            onChange={(e) => onChange('estadoCivil', e.target.value)}
            options={maritalStatusOptions}
          />
          <InputField
            label="Lugar Nacimiento"
            value={patient.lugarNacimiento}
            onChange={(e) => onChange('lugarNacimiento', e.target.value)}
          />
          <InputField
            label="Religión"
            value={patient.religion}
            onChange={(e) => onChange('religion', e.target.value)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoDisplay label="Nombre Completo" value={patient.nombreCompleto} />
          <InfoDisplay label="Correo Electrónico" value={patient.correoElectronico} />
          <InfoDisplay label="Telefono" value={patient.telefono} />
          <InfoDisplay label="Sexo" value={patient.sexo} />
          <InfoDisplay label="Edad" value={patient.edad} />
          <InfoDisplay 
            label="Tipo de Sangre" 
            value={patient.tipoSangre} 
            icon={<Heart className="w-4 h-4 text-red-500" />}
          />
          <InfoDisplay label="CURP" value={patient.curp} />
          <InfoDisplay label="DNI" value={patient.dni} />
          <InfoDisplay label="Estado Civil" value={patient.estadoCivil} />
          <InfoDisplay label="Lugar de Nacimiento" value={patient.lugarNacimiento} />
          <InfoDisplay label="Religión" value={patient.religion} />
        </div>
      )}
    </div>
  );
};

export default PersonalDataSection;