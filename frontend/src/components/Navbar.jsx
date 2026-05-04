import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
     localStorage.removeItem('token');
     navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#172b4d', color: 'white' }}>
      <h2 style={{ margin: 0 }}>Mini Issue Tracker</h2>
      <button 
        onClick={handleLogout} 
        style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Cerrar Sesión
      </button>
    </nav>
  );
};