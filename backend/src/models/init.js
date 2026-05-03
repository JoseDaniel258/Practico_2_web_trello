const db = require('./db');

const initDatabase = () => {
  db.serialize(() => {
    // 1. Tabla de Usuarios
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      contrasena TEXT NOT NULL
    )`);

    // 2. Tabla de Proyectos
    db.run(`CREATE TABLE IF NOT EXISTS proyectos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      creador_id INTEGER NOT NULL,
      FOREIGN KEY (creador_id) REFERENCES usuarios(id)
    )`);

    // 3. Tabla Intermedia para Miembros del Proyecto
    db.run(`CREATE TABLE IF NOT EXISTS miembros_proyecto (
      proyecto_id INTEGER NOT NULL,
      usuario_id INTEGER NOT NULL,
      PRIMARY KEY (proyecto_id, usuario_id),
      FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )`);

    // 4. Tabla de Tickets
    db.run(`CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      estado INTEGER DEFAULT 1 CHECK(estado IN (1, 2, 3)),
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      asignado_a INTEGER,
      proyecto_id INTEGER NOT NULL,
      FOREIGN KEY (asignado_a) REFERENCES usuarios(id),
      FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
    )`);

    // 5. Índices para performance
    db.run(`CREATE INDEX IF NOT EXISTS idx_tickets_proyecto ON tickets(proyecto_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_miembros_usuario ON miembros_proyecto(usuario_id)`);

    console.log("Tablas inicializadas correctamente.");
  });
};

module.exports = initDatabase;