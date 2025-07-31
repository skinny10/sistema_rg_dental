import React, { useState, useEffect } from 'react';
import {
  Search, User, Calendar, Phone, Mail, Edit3, Save, 
  FileText, Image as ImageIcon, Upload, Camera, Trash2,
  Eye, ArrowLeft, UserCheck, Users
} from 'lucide-react';
import PersonalDataSection from '../medical-history/PersonalDataSection';
import MedicalHistorySection from '../medical-history/MedicalHistorySection';
import CurrentIllnessSection from '../medical-history/CurrentIllnessSection';
import ClinicalExamSection from '../medical-history/ClinicalExamSection';
import ProgressImageCard from '../medical-history/ProgressImageCard';
import ImageModal from '../medical-history/ImageModal';
import Swal from 'sweetalert2';

export default function PatientSearchView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('medical');
  const [editingMedical, setEditingMedical] = useState(false);
  const [progressImages, setProgressImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [savingImages, setSavingImages] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

const searchPatients = async (term) => {
  if (!term.trim()) {
    setSearchResults([]);
    return;
  }

  setIsSearching(true);
  try {
    const response = await fetch(
      `http://localhost:4000/api/patients/search?q=${encodeURIComponent(term)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setSearchResults(data.patients || []);

  } catch (error) {
    console.error('Error en búsqueda:', error);
    
    if (error.message.includes('Failed to fetch')) {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se puede conectar al servidor. Verifica que esté corriendo en puerto 4000.',
        confirmButtonColor: '#3B82F6'
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al buscar pacientes. Intenta de nuevo.',
        confirmButtonColor: '#3B82F6'
      });
    }
    
    setSearchResults([]);
  } finally {
    setIsSearching(false);
  }
};

  useEffect(() => {
    const timer = setTimeout(() => {
      searchPatients(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (selectedPatient?._id) {
      loadPatientImages(selectedPatient._id);
    } else {
      setProgressImages([]);
    }
  }, [selectedPatient]);

  const loadPatientImages = async (patientId) => {
    setLoadingImages(true);
    try {
      const response = await fetch(`http://localhost:4000/api/patients/${patientId}/images`);
      const data = await response.json();

      if (response.ok) {
        const formattedImages = data.images.map(img => ({
          id: img._id,
          url: img.url,
          name: img.name,
          date: img.date.split('T')[0],
          category: img.category,
          doctorObservations: img.doctorObservations || ''
        }));
        setProgressImages(formattedImages);
      } else {
        console.error('Error al cargar imágenes:', data.message);
      }
    } catch (error) {
      console.error('Error cargando imágenes:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  const handlePatientFieldChange = (field, value) => {
    if (selectedPatient) {
      setSelectedPatient(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSaveMedicalHistory = async () => {
    if (!selectedPatient?._id) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'No hay paciente seleccionado',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    Swal.fire({
      title: 'Guardando cambios...',
      text: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await fetch(`http://localhost:4000/api/patients/${selectedPatient._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPatient)
      });

      const result = await response.json();

      if (response.ok) {
        setSelectedPatient(result.patient);
        setEditingMedical(false);

        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Cambios guardados correctamente',
          confirmButtonColor: '#3B82F6'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message || "Error al actualizar el paciente",
          confirmButtonColor: '#3B82F6'
        });
      }
    } catch (error) {
      console.error("Error al actualizar paciente:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor',
        confirmButtonColor: '#3B82F6'
      });
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    if (!selectedPatient?._id) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe seleccionar un paciente primero',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    Swal.fire({
      title: 'Subiendo imágenes...',
      text: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            name: file.name,
            url: e.target.result,
            date: new Date().toISOString().split('T')[0],
            category: 'general',
            doctorObservations: ''
          });
        };
        reader.readAsDataURL(file);
      });
    });

    try {
      const imagesData = await Promise.all(imagePromises);

      const response = await fetch(`http://localhost:4000/api/patients/${selectedPatient._id}/images/multiple`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: imagesData })
      });

      const result = await response.json();

      if (response.ok) {
        loadPatientImages(selectedPatient._id);
        
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Imágenes guardadas correctamente',
          confirmButtonColor: '#3B82F6'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message || "Error al guardar las imágenes",
          confirmButtonColor: '#3B82F6'
        });
      }
    } catch (error) {
      console.error("Error al subir imágenes:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al subir las imágenes',
        confirmButtonColor: '#3B82F6'
      });
    }
  };

  const handleDeleteImage = async (imageId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: 'Eliminando imagen...',
      text: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await fetch(`http://localhost:4000/api/images/${imageId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok) {
        loadPatientImages(selectedPatient._id);
        
        Swal.fire({
          icon: 'success',
          title: '¡Eliminada!',
          text: 'Imagen eliminada correctamente',
          confirmButtonColor: '#3B82F6'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message || "Error al eliminar la imagen",
          confirmButtonColor: '#3B82F6'
        });
      }
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al eliminar la imagen',
        confirmButtonColor: '#3B82F6'
      });
    }
  };

  const updateImageDate = async (imageId, date) => {
    try {
      const response = await fetch(`http://localhost:4000/api/images/${imageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date })
      });

      if (response.ok) {
        setProgressImages(prev =>
          prev.map(img => img.id === imageId ? { ...img, date } : img)
        );
      }
    } catch (error) {
      console.error("Error al actualizar fecha:", error);
    }
  };

  const updateImageObservations = async (imageId, doctorObservations) => {
    try {
      const response = await fetch(`http://localhost:4000/api/images/${imageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorObservations })
      });

      if (response.ok) {
        setProgressImages(prev =>
          prev.map(img => img.id === imageId ? { ...img, doctorObservations } : img)
        );
      }
    } catch (error) {
      console.error("Error al actualizar observaciones:", error);
    }
  };

  const updateImageCategory = async (imageId, category) => {
    try {
      const response = await fetch(`http://localhost:4000/api/images/${imageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category })
      });

      if (response.ok) {
        setProgressImages(prev =>
          prev.map(img => img.id === imageId ? { ...img, category } : img)
        );
      }
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
    }
  };

  const handleSaveImage = async (imageId) => {
    setSavingImages(prev => ({ ...prev, [imageId]: true }));

    try {
      const image = progressImages.find(img => img.id === imageId);
      if (!image) return;

      const response = await fetch(`http://localhost:4000/api/images/${imageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: image.date,
          doctorObservations: image.doctorObservations,
          category: image.category
        })
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Guardado!',
          text: 'Cambios guardados correctamente',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message || "Error al guardar los cambios",
          confirmButtonColor: '#3B82F6'
        });
      }
    } catch (error) {
      console.error("Error al guardar imagen:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar los cambios',
        confirmButtonColor: '#3B82F6'
      });
    } finally {
      setSavingImages(prev => ({ ...prev, [imageId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Buscar Pacientes</h1>
                <p className="text-sm text-gray-600">Encuentra y gestiona la información de tus pacientes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {!selectedPatient ? (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar paciente por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                />
              </div>
              
              {isSearching && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Buscando...
                  </div>
                </div>
              )}
            </div>

            {searchTerm && (
              <div className="bg-white rounded-lg shadow-sm">
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Resultados ({searchResults.length})
                      </h3>
                    </div>
                    {searchResults.map((patient) => (
                      <div
                        key={patient._id}
                        onClick={() => setSelectedPatient(patient)}
                        className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{patient.nombreCompleto}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                {patient.edad && (
                                  <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {patient.edad} años
                                  </span>
                                )}
                                {patient.telefono && (
                                  <span className="flex items-center">
                                    <Phone className="w-4 h-4 mr-1" />
                                    {patient.telefono}
                                  </span>
                                )}
                                {patient.correoElectronico && (
                                  <span className="flex items-center">
                                    <Mail className="w-4 h-4 mr-1" />
                                    {patient.correoElectronico}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center text-blue-600">
                            <span className="text-sm font-medium mr-2">Ver paciente</span>
                            <Eye className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchTerm && !isSearching ? (
                  <div className="px-6 py-12 text-center">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron pacientes</h3>
                    <p className="text-gray-500">Intenta con un nombre diferente o verifica la ortografía</p>
                  </div>
                ) : null}
              </div>
            )}

            {!searchTerm && (
              <div className="bg-white rounded-lg shadow-sm py-12 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Busca un paciente</h3>
                <p className="text-gray-500">Escribe el nombre del paciente en la barra de búsqueda</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      setSelectedPatient(null);
                      setActiveTab('medical');
                      setEditingMedical(false);
                    }}
                    className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <UserCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedPatient.nombreCompleto}</h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        {selectedPatient.edad && (
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {selectedPatient.edad} años
                          </span>
                        )}
                        {selectedPatient.telefono && (
                          <span className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {selectedPatient.telefono}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('medical')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'medical' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FileText className="w-4 h-4 inline mr-2" />
                    Historial Médico
                  </button>
                  <button
                    onClick={() => setActiveTab('progress')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'progress' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 inline mr-2" />
                    Progreso Visual
                  </button>
                </nav>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === 'medical' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Historial Médico
                    </h3>
                    <button
                      onClick={editingMedical ? handleSaveMedicalHistory : () => setEditingMedical(true)}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        editingMedical 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white transition-colors`}
                    >
                      {editingMedical ? (
                        <><Save className="w-4 h-4 inline mr-2" />Guardar</>
                      ) : (
                        <><Edit3 className="w-4 h-4 inline mr-2" />Editar</>
                      )}
                    </button>
                  </div>

                  <div className="space-y-8">
                    <PersonalDataSection 
                      patient={selectedPatient} 
                      isEditing={editingMedical} 
                      onChange={handlePatientFieldChange} 
                    />
                    <MedicalHistorySection 
                      patient={selectedPatient} 
                      isEditing={editingMedical} 
                      onChange={handlePatientFieldChange} 
                    />
                    <CurrentIllnessSection 
                      patient={selectedPatient} 
                      isEditing={editingMedical} 
                      onChange={handlePatientFieldChange} 
                    />
                    <ClinicalExamSection 
                      patient={selectedPatient} 
                      isEditing={editingMedical} 
                      onChange={handlePatientFieldChange} 
                    />
                  </div>
                </div>
              )}

              {activeTab === 'progress' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Progreso Visual</h3>
                    <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer font-medium transition-colors">
                      <Upload className="w-4 h-4 inline mr-2" /> Subir Imágenes
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>

                  {loadingImages ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center text-blue-600">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                        Cargando imágenes...
                      </div>
                    </div>
                  ) : progressImages.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">No hay imágenes de progreso</p>
                      <p className="text-sm text-gray-500">Sube las primeras imágenes para comenzar el seguimiento</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {progressImages.map(image => (
                        <ProgressImageCard
                          key={image.id}
                          image={image}
                          onDelete={handleDeleteImage}
                          onUpdateDate={updateImageDate}
                          onUpdateObservations={updateImageObservations}
                          onUpdateCategory={updateImageCategory}
                          onSaveImage={handleSaveImage}
                          isSaving={savingImages[image.id] || false}
                          onViewImage={(img) => {
                            setSelectedImage(img);
                            setShowImageModal(true);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ImageModal
        isOpen={showImageModal}
        image={selectedImage}
        onClose={() => setShowImageModal(false)}
      />
    </div>
  );
}