import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import projectService from '../services/projectService';
import { Navbar } from '../components/Navbar';

export const ProjectsPage = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');

  const fetchProyectos = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAll();
      setProyectos(data);
    } catch (err) {
      setError('Error al cargar los proyectos');
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
      setShowModal(false);
      setNombre('');
      setDescripcion('');
      fetchProyectos();
    } catch (err) {
      alert('Error al crear el proyecto.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await projectService.update(editId, { nombre: editNombre, descripcion: editDescripcion });
      setShowEditModal(false);
      setEditId(null);
      setEditNombre('');
      setEditDescripcion('');
      fetchProyectos();
    } catch (err) {
      alert('Error al actualizar el proyecto.');
    }
  };

  const abrirModalEditar = (proyecto) => {
    setEditId(proyecto.id);
    setEditNombre(proyecto.nombre);
    setEditDescripcion(proyecto.descripcion || '');
    setShowEditModal(true);
  };

  return (
    <div>
      <Navbar />
      
      <div style={{ padding: '2rem' }}>
        <h1>Mis Proyectos</h1>
        
        <button 
          style={{ marginBottom: '1rem', padding: '0.5rem 1rem', cursor: 'pointer', background: '#0052cc', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
          onClick={() => setShowModal(true)}
        >
          + Crear Nuevo Proyecto
        </button>

        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', width: '350px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0, color: '#172b4d' }}>Nuevo Proyecto</h3>
              <form onSubmit={handleCreate}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nombre</label>
                  <input 
                    type='text' 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                    required 
                    minLength='3'
                    style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Descripción</label>
                  <textarea 
                    value={descripcion} 
                    onChange={(e) => setDescripcion(e.target.value)} 
                    style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button 
                    type='button' 
                    onClick={() => setShowModal(false)}
                    style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#ebecf0', border: 'none', borderRadius: '4px' }}
                  >
                    Cancelar
                  </button>
                  <button type='submit' style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#0052cc', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', width: '350px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0, color: '#172b4d' }}>Editar Proyecto</h3>
              <form onSubmit={handleUpdate}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nombre</label>
                  <input 
                    type='text' 
                    value={editNombre} 
                    onChange={(e) => setEditNombre(e.target.value)} 
                    required 
                    minLength='3'
                    style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Descripción</label>
                  <textarea 
                    value={editDescripcion} 
                    onChange={(e) => setEditDescripcion(e.target.value)} 
                    style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button 
                    type='button' 
                    onClick={() => setShowEditModal(false)}
                    style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#ebecf0', border: 'none', borderRadius: '4px' }}
                  >
                    Cancelar
                  </button>
                  <button type='submit' style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                    Actualizar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {loading ? (
          <p>Cargando proyectos...</p>
        ) : (
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {proyectos.length === 0 ? (
              <p>No tienes proyectos aún. ¡Crea el primero!</p>
            ) : (
              proyectos.map((proyecto) => (
                <div 
                  key={proyecto.id} 
                  style={{ border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px', width: '280px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                >
                  <h3 style={{ marginTop: 0, color: '#172b4d', marginBottom: '0.5rem' }}>{proyecto.nombre}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem', minHeight: '40px' }}>{proyecto.descripcion}</p>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      style={{ flex: 2, padding: '0.5rem', cursor: 'pointer', background: '#0052cc', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
                      onClick={() => navigate(`/proyectos/${proyecto.id}/tablero`)}
                    >
                      Ver Tablero
                    </button>
                    <button 
                      style={{ flex: 1, padding: '0.5rem', cursor: 'pointer', background: '#ebecf0', color: '#172b4d', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
                      onClick={() => abrirModalEditar(proyecto)}
                    >
                      Editar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};