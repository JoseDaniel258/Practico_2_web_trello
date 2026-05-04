const db = require('./db');

const initDatabase = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      contrasena TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS proyectos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      creador_id INTEGER NOT NULL,
      FOREIGN KEY (creador_id) REFERENCES usuarios(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS miembros_proyecto (
      proyecto_id INTEGER NOT NULL,
      usuario_id INTEGER NOT NULL,
      PRIMARY KEY (proyecto_id, usuario_id),
      FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )`);

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

    db.run(`CREATE INDEX IF NOT EXISTS idx_tickets_proyecto ON tickets(proyecto_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_miembros_usuario ON miembros_proyecto(usuario_id)`);

    console.log("Tablas inicializadas correctamente.");
  });
};

module.exports = initDatabase;