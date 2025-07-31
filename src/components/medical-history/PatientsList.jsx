import React from 'react';
import { User, UserPlus } from 'lucide-react';

const PatientsList = ({ patients, selectedPatient, onSelectPatient, onAddPatientClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Pacientes
        </h2>
        <button
          onClick={onAddPatientClick}
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          title="Agregar nuevo paciente"
        >
          <UserPlus className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        {patients.map(patient => (
          <div
            key={patient.id}
            onClick={() => onSelectPatient(patient)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedPatient?.id === patient.id
                ? 'bg-blue-100 border-2 border-blue-300'
                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
            }`}
          >
            <div className="font-medium text-gray-800">{patient.name}</div>
            <div className="text-sm text-gray-600">{patient.age} años</div>
            <div className="text-sm text-gray-500">{patient.phone}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientsList;