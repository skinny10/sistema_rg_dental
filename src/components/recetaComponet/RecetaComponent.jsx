import React, { useState, useEffect } from 'react';
import RecetaForm from './RecetaForm';
import RecetaList from './RecetaList';

const RecetaComponent = () => {
  const [formData, setFormData] = useState({
    nombreClinica: 'RG Dental',
    nombreDoctor: '',
    cedulaDoctor: '',
    nombrePaciente: '',
    edadPaciente: '',
    fechaNacimiento: '',
    diagnostico: '',
    medicamentos: '',
    indicaciones: ''
  });

  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReceta, setSelectedReceta] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // TODO: Reemplazar con llamada a la API
  useEffect(() => {
    // const fetchRecetas = async () => {
    //   try {
    //     const response = await fetch('/api/recetas');
    //     const data = await response.json();
    //     setRecetas(data);
    //   } catch (error) {
    //     console.error('Error fetching recetas:', error);
    //   }
    // };
    // fetchRecetas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    // Validaciones
    if (!formData.nombreDoctor || !formData.cedulaDoctor || 
        !formData.nombrePaciente || !formData.medicamentos) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    setLoading(true);

    try {
      // TODO: Reemplazar con llamada a la API
      const nuevaReceta = {
        ...formData,
        id: Date.now(), // En la API esto lo generará el backend
        fechaCreacion: new Date().toISOString(),
        fechaGeneracion: new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      // const response = await fetch('/api/recetas', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(nuevaReceta)
      // });
      
      // if (!response.ok) {
      //   throw new Error('Error al guardar la receta');
      // }
      
      // const recetaGuardada = await response.json();

      // Simular guardado exitoso
      setRecetas(prev => [...prev, nuevaReceta]);

      // Limpiar formulario
      setFormData({
        nombreClinica: 'RG Dental',
        nombreDoctor: '',
        cedulaDoctor: '',
        nombrePaciente: '',
        edadPaciente: '',
        fechaNacimiento: '',
        diagnostico: '',
        medicamentos: '',
        indicaciones: ''
      });

      alert('Receta guardada exitosamente');

    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la receta. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (receta) => {
    const printWindow = window.open('', '_blank');
    const htmlContent = generatePDFContent(receta);
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const deleteReceta = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
      return;
    }

    try {
      // TODO: Reemplazar con llamada a la API
      // const response = await fetch(`/api/recetas/${id}`, {
      //   method: 'DELETE'
      // });
      
      // if (!response.ok) {
      //   throw new Error('Error al eliminar la receta');
      // }

      // Simular eliminación exitosa
      setRecetas(prev => prev.filter(receta => receta.id !== id));
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar la receta. Por favor intente nuevamente.');
    }
  };

  const viewReceta = (receta) => {
    setSelectedReceta(receta);
    setShowPreview(true);
  };

  const generatePDFContent = (receta) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Receta Médica - ${receta.nombrePaciente}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          @page {
            size: A4 landscape;
            margin: 1.5cm;
          }
          
          body {
            font-family: 'Times New Roman', serif;
            line-height: 1.4;
            color: #000;
            background: white;
            font-size: 12pt;
          }
          
          .prescription-container {
            width: 100%;
            height: 100vh;
            padding: 20px;
            background: white;
            display: flex;
            flex-direction: column;
          }
          
          .header {
            text-align: center;
            border-bottom: 3px solid #000;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          
          .clinic-name {
            font-size: 24pt;
            font-weight: bold;
            letter-spacing: 2px;
            margin-bottom: 5px;
          }
          
          .clinic-subtitle {
            font-size: 14pt;
            color: #333;
            margin-bottom: 10px;
          }
          
          .doctor-info {
            font-size: 12pt;
            margin-top: 10px;
          }
          
          .doctor-name {
            font-weight: bold;
            margin-bottom: 3px;
          }
          
          .content-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 30px;
            flex: 1;
          }
          
          .patient-section {
            border: 1px solid #000;
            padding: 15px;
            margin-bottom: 20px;
          }
          
          .section-title {
            font-weight: bold;
            font-size: 11pt;
            border-bottom: 1px solid #333;
            padding-bottom: 5px;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .patient-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            font-size: 11pt;
          }
          
          .patient-info p {
            margin: 5px 0;
            border-bottom: 1px dotted #ccc;
            padding-bottom: 3px;
          }
          
          .date-section {
            border: 1px solid #000;
            padding: 15px;
            margin-bottom: 20px;
            text-align: center;
          }
          
          .prescription-section {
            border: 2px solid #000;
            padding: 20px;
            margin-bottom: 20px;
            flex: 1;
          }
          
          .rx-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
            font-size: 16pt;
            font-weight: bold;
          }
          
          .rx-symbol {
            font-size: 28pt;
            font-weight: bold;
          }
          
          .medications {
            background: #f9f9f9;
            padding: 15px;
            border: 1px solid #ddd;
            min-height: 120px;
          }
          
          .medication-item {
            margin: 8px 0;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
            font-size: 11pt;
          }
          
          .medication-item:last-child {
            border-bottom: none;
          }
          
          .indications {
            border: 1px solid #000;
            padding: 15px;
            margin-bottom: 20px;
            background: #fffacd;
          }
          
          .footer {
            margin-top: auto;
            padding-top: 20px;
            border-top: 1px solid #ccc;
            display: flex;
            justify-content: space-between;
            align-items: end;
          }
          
          .signature-section {
            text-align: center;
            min-width: 200px;
          }
          
          .signature-line {
            width: 200px;
            border-top: 2px solid #000;
            margin: 30px auto 10px;
          }
          
          .signature-text {
            font-size: 11pt;
            font-weight: bold;
          }
          
          .date-generated {
            font-size: 10pt;
            color: #666;
            text-align: right;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .prescription-container {
              height: 100%;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="prescription-container">
          <div class="header">
            <div class="clinic-name">RG DENTAL</div>
            <div class="clinic-subtitle">CLÍNICA ODONTOLÓGICA</div>
            <div class="doctor-info">
              <div class="doctor-name">Dr. ${receta.nombreDoctor}</div>
              <div>Cédula Profesional: ${receta.cedulaDoctor}</div>
            </div>
          </div>

          <div class="content-grid">
            <div>
              <div class="patient-section">
                <div class="section-title">Información del Paciente</div>
                <div class="patient-info">
                  <p><strong>Nombre:</strong> ${receta.nombrePaciente}</p>
                  ${receta.edadPaciente ? `<p><strong>Edad:</strong> ${receta.edadPaciente} años</p>` : '<p><strong>Edad:</strong> _____</p>'}
                  ${receta.fechaNacimiento ? `<p><strong>Fecha de Nacimiento:</strong> ${new Date(receta.fechaNacimiento).toLocaleDateString('es-ES')}</p>` : '<p><strong>Fecha de Nacimiento:</strong> _____</p>'}
                  ${receta.diagnostico ? `<p><strong>Diagnóstico:</strong> ${receta.diagnostico}</p>` : '<p><strong>Diagnóstico:</strong> _____</p>'}
                </div>
              </div>

              <div class="prescription-section">
                <div class="rx-header">
                  <span class="rx-symbol">℞</span>
                  <span>PRESCRIPCIÓN</span>
                </div>
                <div class="medications">
                  ${receta.medicamentos.split('\n').map(med => 
                    med.trim() ? `<div class="medication-item">${med.trim()}</div>` : ''
                  ).join('')}
                </div>
              </div>

              ${receta.indicaciones ? `
                <div class="indications">
                  <div class="section-title">Indicaciones Especiales</div>
                  <p>${receta.indicaciones}</p>
                </div>
              ` : ''}
            </div>

            <div>
              <div class="date-section">
                <div class="section-title">Fecha</div>
                <p>${receta.fechaGeneracion}</p>
              </div>
            </div>
          </div>

          <div class="footer">
            <div class="date-generated">
              Receta generada el: ${receta.fechaGeneracion}
            </div>
            <div class="signature-section">
              <div class="signature-line"></div>
              <div class="signature-text">
                Dr. ${receta.nombreDoctor}<br>
                Cédula: ${receta.cedulaDoctor}
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header simplificado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Recetas Médicas</h1>
          <p className="text-gray-600">RG Dental - Gestión de prescripciones</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <RecetaForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            loading={loading}
          />

          <RecetaList
            recetas={recetas}
            generatePDF={generatePDF}
            deleteReceta={deleteReceta}
            viewReceta={viewReceta}
            showPreview={showPreview}
            selectedReceta={selectedReceta}
            setShowPreview={setShowPreview}
          />
        </div>
      </div>
    </div>
  );
};

export default RecetaComponent;