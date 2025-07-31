import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/pages/login';
import MainLayout from './components/mainLayout/MainLayout';
import Home from './components/pages/Home';
import HistoryMedical from './components/pages/HistoryMedical';
import PatientSearch from './components/pages/PatientSearch';
import GenerateReceta from './components/pages/GenerateReceta';


function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="historyMedical" element={<HistoryMedical />} />
          <Route path="pacientes" element={<PatientSearch />} />
          {/* <Route path="receta" element={<GenerateReceta />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;