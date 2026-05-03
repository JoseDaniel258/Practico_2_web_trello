import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ticketService from "../services/ticketService";
import { Navbar } from "../components/Navbar";

export const BoardPage = () => {
  const { id } = useParams(); // Rescata el ID del proyecto desde la URL
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para el modal de nuevo ticket
  const [showModal, setShowModal] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getByProject(id);
      setTickets(data);
    } catch (err) {
      setError("Error al cargar los tickets del proyecto");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [id]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      await ticketService.create({
        proyecto_id: parseInt(id),
        titulo,
        descripcion,
        estado: 1,
      });
      setShowModal(false);
      setTitulo("");
      setDescripcion("");
      fetchTickets(); // Recargamos el tablero para ver la tarjeta nueva
    } catch (err) {
      console.error(err);
      alert("Error al crear el ticket. Revisa la consola.");
    }
  };

  const handleCambiarEstado = async (ticketId, nuevoEstado) => {
    try {
      await ticketService.updateEstado(ticketId, nuevoEstado);
      fetchTickets(); // Recargamos el tablero para ver el movimiento
    } catch (err) {
      console.error(err);
      alert("Error al mover el ticket");
    }
  };
  const handleEliminarTicket = async (ticketId) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que quieres eliminar este ticket?",
    );
    if (confirmar) {
      try {
        await ticketService.remove(ticketId);
        fetchTickets(); // Recargamos para que desaparezca la tarjeta
      } catch (err) {
        console.error(err);
        alert("Error al eliminar el ticket");
      }
    }
  };

  // Pequeña función para filtrar las tarjetas en sus respectivas columnas
  const ticketsPorEstado = (estado) => {
    return tickets.filter((ticket) => ticket.estado === estado);
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem" }}>
        <button
          onClick={() => navigate("/proyectos")}
          style={{
            marginBottom: "1rem",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          &larr; Volver a Proyectos
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Tablero Kanban</h1>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: "0.5rem 1rem",
              cursor: "pointer",
              height: "fit-content",
            }}
          >
            + Nuevo Ticket
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Modal para crear ticket */}
        {showModal && (
          <div
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "2rem",
              borderRadius: "8px",
              background: "#f9f9f9",
              width: "300px",
            }}
          >
            <h3>Crear Tarea</h3>
            <form onSubmit={handleCreateTicket}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Título
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  style={{ width: "100%", padding: "0.5rem" }}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Descripción
                </label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  style={{ width: "100%", padding: "0.5rem" }}
                />
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="submit"
                  style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p>Cargando tablero...</p>
        ) : (
          <div
            style={{
              display: "flex",
              gap: "2rem",
              marginTop: "1rem",
              overflowX: "auto",
              paddingBottom: "1rem",
            }}
          >
            {/* Columna Pendientes */}
            <div
              style={{
                flex: 1,
                minWidth: "300px",
                background: "#ebecf0",
                padding: "1rem",
                borderRadius: "8px",
                minHeight: "60vh",
              }}
            >
              <h3 style={{ marginTop: 0, color: "#172b4d" }}>Pendiente</h3>
              {ticketsPorEstado(1).map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: "#fff",
                    padding: "1rem",
                    marginBottom: "1rem",
                    borderRadius: "4px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  <h4 style={{ margin: "0 0 0.5rem 0" }}>{t.titulo}</h4>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#666",
                      margin: "0 0 1rem 0",
                    }}
                  >
                    {t.descripcion}
                  </p>
                  <button
                    onClick={() => handleCambiarEstado(t.id, 2)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      cursor: "pointer",
                      background: "#0052cc",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Iniciar (A En Progreso) &rarr;
                  </button>

                  <button 
      onClick={() => handleEliminarTicket(t.id)}
      style={{ background: 'transparent', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' }}
      title='Eliminar'
    >
      X
    </button>
                </div>
              ))}
            </div>

            {/* Columna En Progreso */}
            <div
              style={{
                flex: 1,
                minWidth: "300px",
                background: "#ebecf0",
                padding: "1rem",
                borderRadius: "8px",
                minHeight: "60vh",
              }}
            >
              <h3 style={{ marginTop: 0, color: "#172b4d" }}>En Progreso</h3>
              {ticketsPorEstado(2).map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: "#fff",
                    padding: "1rem",
                    marginBottom: "1rem",
                    borderRadius: "4px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  <h4 style={{ margin: "0 0 0.5rem 0" }}>{t.titulo}</h4>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#666",
                      margin: "0 0 1rem 0",
                    }}
                  >
                    {t.descripcion}
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleCambiarEstado(t.id, 1)}
                      style={{ flex: 1, padding: "0.5rem", cursor: "pointer" }}
                    >
                      &larr; Pausar
                    </button>
                    <button
                      onClick={() => handleCambiarEstado(t.id, 3)}
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        cursor: "pointer",
                        background: "#00875a",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                      }}
                    >
                      Finalizar &rarr;
                    </button>
                    <button 
      onClick={() => handleEliminarTicket(t.id)}
      style={{ background: 'transparent', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' }}
      title='Eliminar'
    >
      X
    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Columna Completado */}
            <div
              style={{
                flex: 1,
                minWidth: "300px",
                background: "#ebecf0",
                padding: "1rem",
                borderRadius: "8px",
                minHeight: "60vh",
              }}
            >
              <h3 style={{ marginTop: 0, color: "#172b4d" }}>Completado</h3>
              {ticketsPorEstado(3).map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: "#fff",
                    padding: "1rem",
                    marginBottom: "1rem",
                    borderRadius: "4px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  <h4 style={{ margin: "0 0 0.5rem 0" }}>{t.titulo}</h4>

                  <p style={{ fontSize: "0.9rem", color: "#666", margin: 0 }}>
                    {t.descripcion}
                  </p>
                  <button 
      onClick={() => handleEliminarTicket(t.id)}
      style={{ background: 'transparent', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' }}
      title='Eliminar'
    >
      X
    </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
