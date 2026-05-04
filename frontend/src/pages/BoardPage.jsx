import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ticketService from '../services/ticketService';
import axiosInstance from '../services/axiosInstance';
import { Navbar } from '../components/Navbar';

export const BoardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [miembros, setMiembros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [emailInvitacion, setEmailInvitacion] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [asignadoA, setAsignadoA] = useState('');

  const [ticketDetalle, setTicketDetalle] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editAsignadoA, setEditAsignadoA] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsData, miembrosData] = await Promise.all([
        ticketService.getByProject(id),
        axiosInstance.get(`/api/proyectos/${id}/miembros`)
      ]);
      setTickets(ticketsData);
      setMiembros(miembrosData.data);
    } catch (err) {
      setError('Error al cargar los datos del tablero');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleInvitarMiembro = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/api/proyectos/${id}/miembros`, { email: emailInvitacion });
      setEmailInvitacion('');
      fetchData();
      alert('Miembro agregado correctamente');
    } catch (err) {
      alert('Error al invitar al usuario. Verifica que el correo exista en el sistema.');
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      await ticketService.create({
        proyecto_id: parseInt(id),
        titulo,
        descripcion,
        estado: 1,
        asignado_a: asignadoA ? parseInt(asignadoA) : null
      });
      setShowModal(false);
      setTitulo('');
      setDescripcion('');
      setAsignadoA('');
      fetchData();
    } catch (err) {
      alert('Error al crear el ticket.');
    }
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    try {
      await ticketService.update(editId, {
        titulo: editTitulo,
        descripcion: editDescripcion,
        asignado_a: editAsignadoA ? parseInt(editAsignadoA) : null
      });
      setShowEditModal(false);
      setEditId(null);
      setEditTitulo('');
      setEditDescripcion('');
      setEditAsignadoA('');
      fetchData();
    } catch (err) {
      alert('Error al actualizar el ticket');
    }
  };

  const handleCambiarEstado = async (ticketId, nuevoEstado) => {
    try {
      await ticketService.updateEstado(ticketId, nuevoEstado);
      fetchData();
    } catch (err) {
      alert('Error: No puedes iniciar un ticket sin asignar un responsable.');
    }
  };

  const handleEliminarTicket = async (ticketId) => {
    const confirmar = window.confirm('¿Estás seguro de que quieres eliminar este ticket?');
    if (confirmar) {
      try {
        await ticketService.remove(ticketId);
        fetchData();
      } catch (err) {
        alert('Error al eliminar el ticket');
      }
    }
  };

  const ticketsPorEstado = (estado) => {
    return tickets.filter((ticket) => ticket.estado === estado);
  };

  const getEstadoTexto = (numero) => {
    if (numero === 1) return 'Pendiente';
    if (numero === 2) return 'En Progreso';
    if (numero === 3) return 'Completado';
    return 'Desconocido';
  };

  const obtenerNombreMiembro = (miembroId) => {
    if (!miembroId) return 'Sin asignar';
    const miembro = miembros.find(m => m.id === miembroId);
    return miembro ? (miembro.nombre || miembro.email) : 'Usuario desconocido';
  };

  const abrirModalEditar = (ticket) => {
    setTicketDetalle(null);
    setEditId(ticket.id);
    setEditTitulo(ticket.titulo);
    setEditDescripcion(ticket.descripcion);
    setEditAsignadoA(ticket.asignado_a || '');
    setShowEditModal(true);
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <button
          onClick={() => navigate('/proyectos')}
          style={{ marginBottom: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
        >
          &larr; Volver a Proyectos
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1>Tablero Kanban</h1>
          <form onSubmit={handleInvitarMiembro} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type='email'
              placeholder='Invitar correo...'
              value={emailInvitacion}
              onChange={(e) => setEmailInvitacion(e.target.value)}
              required
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button type='submit' style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
              Invitar
            </button>
          </form>
          <button
            onClick={() => setShowModal(true)}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer', height: 'fit-content' }}
          >
            + Nuevo Ticket
          </button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {showModal && (
          <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '2rem', borderRadius: '8px', background: '#f9f9f9', width: '300px' }}>
            <h3>Crear Tarea</h3>
            <form onSubmit={handleCreateTicket}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Título</label>
                <input
                  type='text'
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
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
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Asignar a</label>
                <select
                  value={asignadoA}
                  onChange={(e) => setAsignadoA(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem' }}
                >
                  <option value=''>Sin asignar</option>
                  {miembros.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre || m.email}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type='submit' style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Guardar</button>
                <button type='button' onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {showEditModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', width: '400px', maxWidth: '90%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, color: '#172b4d' }}>Editar Ticket</h2>
                <button onClick={() => setShowEditModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#666' }}>✖</button>
              </div>
              <form onSubmit={handleUpdateTicket}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Título</label>
                  <input
                    type='text'
                    value={editTitulo}
                    onChange={(e) => setEditTitulo(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.5rem' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Descripción</label>
                  <textarea
                    value={editDescripcion}
                    onChange={(e) => setEditDescripcion(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Asignar a</label>
                  <select
                    value={editAsignadoA}
                    onChange={(e) => setEditAsignadoA(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem' }}
                  >
                    <option value=''>Sin asignar</option>
                    {miembros.map(m => (
                      <option key={m.id} value={m.id}>{m.nombre || m.email}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button type='button' onClick={() => setShowEditModal(false)} style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#ebecf0', border: 'none', borderRadius: '4px' }}>Cancelar</button>
                  <button type='submit' style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#0052cc', color: 'white', border: 'none', borderRadius: '4px' }}>Actualizar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {ticketDetalle && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', width: '400px', maxWidth: '90%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, color: '#172b4d' }}>Detalles del Ticket</h2>
                <button onClick={() => setTicketDetalle(null)} style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#666' }}>✖</button>
              </div>
              
              <h3 style={{ marginTop: 0 }}>{ticketDetalle.titulo}</h3>
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f4f5f7', borderRadius: '4px' }}>
                <p style={{ margin: 0, color: '#333' }}>{ticketDetalle.descripcion}</p>
              </div>
              
              <p><strong>Estado Actual:</strong> <span style={{ padding: '0.2rem 0.5rem', background: '#e3fcef', color: '#006644', borderRadius: '4px', fontWeight: 'bold' }}>{getEstadoTexto(ticketDetalle.estado)}</span></p>
              <p><strong>Responsable:</strong> {obtenerNombreMiembro(ticketDetalle.asignado_a)}</p>
              
              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button onClick={() => abrirModalEditar(ticketDetalle)} style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#ffc107', border: 'none', borderRadius: '4px', color: '#000' }}>Editar</button>
                <button onClick={() => setTicketDetalle(null)} style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#ebecf0', border: 'none', borderRadius: '4px' }}>Cerrar</button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <p>Cargando tablero...</p>
        ) : (
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
  
            <div style={{ flex: 1, minWidth: '300px', background: '#ebecf0', padding: '1rem', borderRadius: '8px', minHeight: '60vh' }}>
              <h3 style={{ marginTop: 0, color: '#172b4d' }}>Pendiente</h3>
              {ticketsPorEstado(1).map((t) => (
                <div key={t.id} style={{ background: '#fff', padding: '1rem', marginBottom: '1rem', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{t.titulo}</h4>
                    <button onClick={() => handleEliminarTicket(t.id)} style={{ background: 'transparent', border: 'none', color: '#dc3545', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                  </div>
                  <button onClick={() => setTicketDetalle(t)} style={{ background: 'transparent', border: 'none', color: '#0052cc', cursor: 'pointer', padding: 0, marginBottom: '1rem', textDecoration: 'underline' }}>Ver detalles</button>
                  
                  {/* BOTÓN HACIA ADELANTE */}
                  <button
                    onClick={() => handleCambiarEstado(t.id, 2)}
                    style={{ width: '100%', padding: '0.5rem', cursor: 'pointer', background: '#0052cc', color: 'white', border: 'none', borderRadius: '4px' }}
                  >
                    Iniciar (A En Progreso) &rarr;
                  </button>
                </div>
              ))}
            </div>

            <div style={{ flex: 1, minWidth: '300px', background: '#ebecf0', padding: '1rem', borderRadius: '8px', minHeight: '60vh' }}>
              <h3 style={{ marginTop: 0, color: '#172b4d' }}>En Progreso</h3>
              {ticketsPorEstado(2).map((t) => (
                <div key={t.id} style={{ background: '#fff', padding: '1rem', marginBottom: '1rem', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{t.titulo}</h4>
                    <button onClick={() => handleEliminarTicket(t.id)} style={{ background: 'transparent', border: 'none', color: '#dc3545', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                  </div>
                  <button onClick={() => setTicketDetalle(t)} style={{ background: 'transparent', border: 'none', color: '#0052cc', cursor: 'pointer', padding: 0, marginBottom: '1rem', textDecoration: 'underline' }}>Ver detalles</button>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {/* BOTÓN HACIA ATRÁS */}
                    <button onClick={() => handleCambiarEstado(t.id, 1)} style={{ flex: 1, padding: '0.5rem', cursor: 'pointer', borderRadius: '4px' }}>
                      &larr; Pausar
                    </button>
                    {/* BOTÓN HACIA ADELANTE */}
                    <button onClick={() => handleCambiarEstado(t.id, 3)} style={{ flex: 1, padding: '0.5rem', cursor: 'pointer', background: '#00875a', color: 'white', border: 'none', borderRadius: '4px' }}>
                      Finalizar &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>

=            <div style={{ flex: 1, minWidth: '300px', background: '#ebecf0', padding: '1rem', borderRadius: '8px', minHeight: '60vh' }}>
              <h3 style={{ marginTop: 0, color: '#172b4d' }}>Completado</h3>
              {ticketsPorEstado(3).map((t) => (
                <div key={t.id} style={{ background: '#fff', padding: '1rem', marginBottom: '1rem', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{t.titulo}</h4>
                    <button onClick={() => handleEliminarTicket(t.id)} style={{ background: 'transparent', border: 'none', color: '#dc3545', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                  </div>
                  <button onClick={() => setTicketDetalle(t)} style={{ background: 'transparent', border: 'none', color: '#0052cc', cursor: 'pointer', padding: 0, marginBottom: '1rem', textDecoration: 'underline' }}>Ver detalles</button>
                  
                  <button
                    onClick={() => handleCambiarEstado(t.id, 2)}
                    style={{ width: '100%', padding: '0.5rem', cursor: 'pointer', background: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
                  >
                    &larr; Reabrir Tarea
                  </button>
                </div>
              ))}
            </div>

            <div style={{ flex: 1, minWidth: '300px', background: '#ebecf0', padding: '1rem', borderRadius: '8px', minHeight: '60vh' }}>
              <h3 style={{ marginTop: 0, color: '#172b4d' }}>Completado</h3>
              {ticketsPorEstado(3).map((t) => (
                <div key={t.id} style={{ background: '#fff', padding: '1rem', marginBottom: '1rem', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{t.titulo}</h4>
                    <button onClick={() => handleEliminarTicket(t.id)} style={{ background: 'transparent', border: 'none', color: '#dc3545', cursor: 'pointer', fontWeight: 'bold' }} title='Eliminar'>X</button>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#666', margin: '0 0 1rem 0' }}>{t.descripcion}</p>
                  
                  <button onClick={() => setTicketDetalle(t)} style={{ background: 'transparent', border: 'none', color: '#0052cc', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Ver detalles</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};