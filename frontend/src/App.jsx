import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Importación de las páginas
import { LoginPage } from './pages/LoginPage.jsx';
import { ProjectsPage } from './pages/ProjectsPage.jsx';
import { BoardPage } from './pages/BoardPage.jsx';
import { TicketDetailPage } from './pages/TicketDetailPage.jsx';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path='/login' element={<LoginPage />} />

          {/* Rutas principales del Issue Tracker */}
          <Route path='/proyectos' element={<ProjectsPage />} />
          <Route path='/proyectos/:id/tablero' element={<BoardPage />} />
          <Route path='/tickets/:id' element={<TicketDetailPage />} />

          {/* Redirección por defecto si la ruta no existe */}
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;