import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, contrasena);

    if (result.success) {
      // Login exitoso, vamos al listado de proyectos
      navigate('/proyectos');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className='login-container'>
      <h2>Ingresar al Mini Issue Tracker</h2>
      
      {error && <div className='error-message'>{error}</div>}
      
      <form onSubmit={handleSubmit} className='login-form'>
        <div className='form-group'>
          <label htmlFor='email'>Correo electrónico</label>
          <input 
            type='email' 
            id='email'
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className='form-group'>
          <label htmlFor='contrasena'>Contraseña</label>
          <input 
            type='password' 
            id='contrasena'
            value={contrasena} 
            onChange={(e) => setContrasena(e.target.value)} 
            required 
          />
        </div>

        <button type='submit' disabled={loading}>
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};