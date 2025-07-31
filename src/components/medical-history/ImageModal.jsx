import React from 'react';
import { X } from 'lucide-react';

const ImageModal = ({ isOpen, image, onClose }) => {
  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Vista Completa</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <img
            src={image.url}
            alt={image.name}
            className="w-full max-h-96 object-contain mb-4"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Fecha:</strong> {image.date}
            </div>
            <div>
              <strong>Categoría:</strong> {image.category}
            </div>
          </div>
          {image.doctorObservations && (
            <div className="mt-4">
              <strong className="text-sm">Observaciones del Doctor:</strong>
              <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded">{image.doctorObservations}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;