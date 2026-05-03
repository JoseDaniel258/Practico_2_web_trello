import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import projectService from '../services/projectService';
import { Navbar } from '../components/Navbar';

export const ProjectsPage = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Estados para el formulario de creación
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const fetchProyectos = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAll();
      setProyectos(data);
    } catch (err) {
      setError('Error al cargar los proyectos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProyectos();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await projectService.create({ nombre, descripcion });
      setShowModal(false); // Cerramos el modal
      setNombre('');       // Limpiamos los inputs
      setDescripcion('');
      fetchProyectos();    // Volvemos a cargar la lista para ver el nuevo proyecto
    } catch (err) {
      console.error(err);
      alert('Error al crear el proyecto. Verifica la consola.');
    }
  };

  return (
    <div>
      <Navbar />
      
      <div style={{ padding: '2rem' }}>
        <h1>Mis Proyectos</h1>
        
        <button 
          style={{ marginBottom: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
          onClick={() => setShowModal(true)}
        >
          + Crear Nuevo Proyecto
        </button>

        {/* Mini Modal para crear proyecto */}
        {showModal && (
          <div style={{
            border: '1px solid #ccc', padding: '1rem', marginBottom: '2rem', 
            borderRadius: '8px', background: '#f9f9f9', width: '300px'
          }}>
            <h3>Nuevo Proyecto</h3>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nombre</label>
                <input 
                  type='text' 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Descripción</label>
                <textarea 
                  value={descripcion} 
                  onChange={(e) => setDescripcion(e.target.value)} 
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type='submit' style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Guardar</button>
                <button 
                  type='button' 
                  onClick={() => setShowModal(false)}
                  style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {loading ? (
          <p>Cargando proyectos...</p>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {proyectos.length === 0 ? (
              <p>No tienes proyectos aún. ¡Crea el primero!</p>
            ) : (
              proyectos.map((proyecto) => (
                <div 
                  key={proyecto.id} 
                  style={{ border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px', width: '250px', background: '#fff' }}
                >
                  <h3 style={{ marginTop: 0 }}>{proyecto.nombre}</h3>
                  <p style={{ color: '#666' }}>{proyecto.descripcion}</p>
                  <button 
                    style={{ padding: '0.5rem 1rem', cursor: 'pointer', width: '100%' }}
                    onClick={() => navigate(`/proyectos/${proyecto.id}/tablero`)}
                  >
                    Ver Tablero
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};