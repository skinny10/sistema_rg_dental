import React from 'react';
import { Trash2, Save } from 'lucide-react';

const ProgressImageCard = ({ 
  image, 
  onDelete, 
  onUpdateDate, 
  onUpdateObservations, 
  onUpdateCategory, 
  onViewImage,
  onSaveImage,
  isSaving 
}) => {
  const categoryOptions = [
    { value: 'general', label: 'General' },
    { value: 'antes', label: 'Antes' },
    { value: 'durante', label: 'Durante' },
    { value: 'despues', label: 'Después' },
    { value: 'radiografia', label: 'Radiografía' },
    { value: 'intraoral', label: 'Intraoral' },
    { value: 'extraoral', label: 'Extraoral' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="relative">
        <img
          src={image.url}
          alt={image.name}
          className="w-full h-48 object-cover cursor-pointer"
          onClick={() => onViewImage(image)}
        />
        <button
          onClick={() => onDelete(image.id)}
          className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Fecha</label>
            <input
              type="date"
              value={image.date}
              onChange={(e) => onUpdateDate(image.id, e.target.value)}
              className="text-sm px-2 py-1 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="ml-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Categoría</label>
            <select
              value={image.category}
              onChange={(e) => onUpdateCategory(image.id, e.target.value)}
              className="text-xs px-2 py-1 border border-gray-300 rounded"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Observaciones del Doctor</label>
          <textarea
            value={image.doctorObservations}
            onChange={(e) => onUpdateObservations(image.id, e.target.value)}
            placeholder="Observaciones médicas, diagnóstico, tratamiento aplicado..."
            className="w-full text-sm p-2 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
          />
        </div>
        
        <div className="pt-2">
          <button
            onClick={() => onSaveImage(image.id)}
            disabled={isSaving}
            className={`w-full px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
              isSaving 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isSaving ? (
              <>
                <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 inline mr-2" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressImageCard;