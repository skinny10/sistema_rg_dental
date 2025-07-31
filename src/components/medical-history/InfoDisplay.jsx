import React from 'react';

const InfoDisplay = ({ label, value, icon, className = "" }) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <div className="p-2 bg-gray-50 rounded border flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {value || 'No especificado'}
      </div>
    </div>
  );
};

export default InfoDisplay;