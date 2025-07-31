import React, { useState, useEffect } from 'react';
import {
  User, Camera, Upload, Edit3, Save, FileText,
  Image as ImageIcon, UserPlus, ArrowLeft, Check
} from 'lucide-react';

import PersonalDataSection from './PersonalDataSection';
import MedicalHistorySection from './MedicalHistorySection';
import CurrentIllnessSection from './CurrentIllnessSection';
import ClinicalExamSection from './ClinicalExamSection';
import PatientsList from './PatientsList';
import ProgressImageCard from './ProgressImageCard';
import ImageModal from './ImageModal';

import Swal from 'sweetalert2';

const PatientHistoryManager = () => {
  const [activeTab, setActiveTab] = useState('medical');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingMedical, setEditingMedical] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [patients, setPatients] = useState([]);
  const [progressImages, setProgressImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [savingImages, setSavingImages] = useState({}); 

  const [newPatient, setNewPatient] = useState({
    nombreCompleto: '', correoElectronico: '', sexo: '', telefono: '', edad: '', tipoSangre: '',
    curp: '', dni: '', estadoCivil: '', lugarNacimiento: '', religion: '',
    generales: '', fisiologicos: '', inmunologicos: '', patologicos: '', familiares: '',
    epidemiologicos: '', ocupacionales: '', farmacologicos: '', especificacionAntecedentes: '',
    fecha: '', horaAtencion: '', motivo: '', tipoEnfermedad: '', sintomasPrincipales: '',
    relatoCronologico: '', funcionesBiologicas: '', estadoGeneral: '', peso: '', talla: '',
    examenExtraoral: '', examenIntraoral: ''
  });


  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/patients');
        const data = await res.json();

        if (res.ok) {
          const formatted = data.map(p => ({
            id: p._id,
            name: p.nombreCompleto || '',
            age: p.edad || '',
            telefono: p.telefono || '', 
            fullData: p
          }));
          setPatients(formatted);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar pacientes',
            confirmButtonColor: '#3B82F6'
          });
        }
      } catch (error) {
        console.error("Error cargando pacientes:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor',
          confirmButtonColor: '#3B82F6'
        });
      }
    };

    fetchPatients();
  }, []);

 
  useEffect(() => {
    if (selectedPatient?.id) {
      loadPatientImages(selectedPatient.id);
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
    if (editingMedical && selectedPatient?.fullData) {
      setSelectedPatient(prev => ({
        ...prev,
        fullData: {
          ...prev.fullData,
          [field]: value
        }
      }));
    } else {
      setNewPatient(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAddPatient = async () => {
    if (!newPatient.nombreCompleto) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'El nombre completo es requerido',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    Swal.fire({
      title: 'Guardando paciente...',
      text: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await fetch("http://localhost:4000/api/patients/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient)
      });

      const result = await response.json();

      if (response.ok) {
        const addedPatient = {
          id: result.patient._id,
          name: result.patient.nombreCompleto || '',
          age: result.patient.edad || '',
          telefono: result.patient.telefono || '', 
          fullData: result.patient
        };

        setPatients(prev => [...prev, addedPatient]);
        setSelectedPatient(addedPatient);
        setNewPatient({ 
          ...Object.keys(newPatient).reduce((acc, key) => ({ ...acc, [key]: '' }), {})
        });
        setShowAddPatient(false);

        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Paciente guardado correctamente',
          confirmButtonColor: '#3B82F6'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message || "Error al guardar los datos",
          confirmButtonColor: '#3B82F6'
        });
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor',
        confirmButtonColor: '#3B82F6'
      });
    }
  };

  const handleSaveMedicalHistory = async () => {
    if (!selectedPatient || !selectedPatient.fullData?._id) {
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
      const response = await fetch(`http://localhost:4000/api/patients/${selectedPatient.fullData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPatient.fullData)
      });

      const result = await response.json();

      if (response.ok) {
        setPatients(prev =>
          prev.map(p =>
            p.fullData._id === result.patient._id
              ? { 
                  ...p, 
                  fullData: result.patient, 
                  name: result.patient.nombreCompleto || '', 
                  age: result.patient.edad || '',
                  telefono: result.patient.telefono || ''
                }
              : p
          )
        );

        setSelectedPatient(prev => ({
          ...prev,
          fullData: result.patient,
          name: result.patient.nombreCompleto || '',
          age: result.patient.edad || '',
          telefono: result.patient.telefono || '' 
        }));

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
    
    if (!selectedPatient?.id) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe seleccionar un paciente primero',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    // Mostrar loading
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


      const response = await fetch(`http://localhost:4000/api/patients/${selectedPatient.id}/images/multiple`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: imagesData })
      });

      const result = await response.json();

      if (response.ok) {
 
        loadPatientImages(selectedPatient.id);
        
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
        loadPatientImages(selectedPatient.id);
        
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

  if (showAddPatient) {
    return (
      <div className="flex-1 bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <button
                  onClick={() => setShowAddPatient(false)}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-full"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Historial Clínico - Nuevo Paciente</h1>
              </div>
              <p className="text-sm text-gray-600">RG Dental</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <PersonalDataSection patient={newPatient} isEditing={true} onChange={handlePatientFieldChange} />
            <MedicalHistorySection patient={newPatient} isEditing={true} onChange={handlePatientFieldChange} />
            <CurrentIllnessSection patient={newPatient} isEditing={true} onChange={handlePatientFieldChange} />
            <ClinicalExamSection patient={newPatient} isEditing={true} onChange={handlePatientFieldChange} />

            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowAddPatient(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={handleAddPatient} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                Guardar Paciente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Pacientes</h1>
          <p className="text-gray-600">Historial médico y seguimiento de progreso</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <PatientsList
              patients={patients}
              selectedPatient={selectedPatient}
              onSelectPatient={setSelectedPatient}
              onAddPatientClick={() => setShowAddPatient(true)}
            />
          </div>

          <div className="lg:col-span-3">
            {selectedPatient ? (
              <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    <button
                      onClick={() => setActiveTab('medical')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'medical' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                      <FileText className="w-4 h-4 inline mr-2" />
                      Historial Médico
                    </button>
                    <button
                      onClick={() => setActiveTab('progress')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'progress' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                      <ImageIcon className="w-4 h-4 inline mr-2" />
                      Progreso Visual
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === 'medical' && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Historial Médico - {selectedPatient.name}
                        </h3>
                        <button
                          onClick={editingMedical ? handleSaveMedicalHistory : () => setEditingMedical(true)}
                          className={`px-4 py-2 rounded-lg font-medium ${editingMedical ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                        >
                          {editingMedical ? <><Save className="w-4 h-4 inline mr-2" />Guardar</> : <><Edit3 className="w-4 h-4 inline mr-2" />Editar</>}
                        </button>
                      </div>

                      <div className="space-y-8">
                        <PersonalDataSection patient={selectedPatient.fullData} isEditing={editingMedical} onChange={handlePatientFieldChange} />
                        <MedicalHistorySection patient={selectedPatient.fullData} isEditing={editingMedical} onChange={handlePatientFieldChange} />
                        <CurrentIllnessSection patient={selectedPatient.fullData} isEditing={editingMedical} onChange={handlePatientFieldChange} />
                        <ClinicalExamSection patient={selectedPatient.fullData} isEditing={editingMedical} onChange={handlePatientFieldChange} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'progress' && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-800">Progreso Visual - {selectedPatient.name}</h3>
                        <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer font-medium">
                          <Upload className="w-4 h-4 inline mr-2" /> Subir Imágenes
                          <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      </div>

                      {loadingImages ? (
                        <div className="text-center py-12">
                          <p className="text-gray-600">Cargando imágenes...</p>
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
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Selecciona un Paciente</h3>
                <p className="text-gray-500 mb-4">Elige un paciente de la lista para ver su historial médico y progreso visual</p>
                <button
                  onClick={() => setShowAddPatient(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-flex items-center"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Agregar Nuevo Paciente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={showImageModal}
        image={selectedImage}
        onClose={() => setShowImageModal(false)}
      />
    </div>
  );
};

export default PatientHistoryManager;