const db = require("../models/db");

const ticketService = {
    // 1. Crear ticket
    create: (ticketData) => {
        return new Promise((resolve, reject) => {
            const { titulo, descripcion, proyecto_id, asignado_a } = ticketData;
            const query = `INSERT INTO tickets (titulo, descripcion, proyecto_id, asignado_a) VALUES (?, ?, ?, ?)`;
            db.run(query, [titulo, descripcion, proyecto_id, asignado_a || null], function(err) {
                if (err) return reject(err);
                resolve({ id: this.lastID, ...ticketData, estado: 1 });
            });
        });
    },

    // 2. Buscar ticket por ID
    findById: (id) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM tickets WHERE id = ?`;
            db.get(query, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    },

    // 3. Listar tickets de un proyecto ordenados por estado (para el tablero)
    findAllByProjectId: (projectId) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM tickets WHERE proyecto_id = ? ORDER BY estado ASC`;
            db.all(query, [projectId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    // 4. Actualizar campos del ticket dinámicamente
    update: (id, updateData) => {
        return new Promise((resolve, reject) => {
            const keys = Object.keys(updateData);
            const values = Object.values(updateData);
            const setClause = keys.map(key => `${key} = ?`).join(', ');
            const query = `UPDATE tickets SET ${setClause} WHERE id = ?`;
            db.run(query, [...values, id], function(err) {
                if (err) return reject(err);
                resolve(this.changes);
            });
        });
    },

    // 5. Eliminar ticket
    remove: (id) => {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM tickets WHERE id = ?`;
            db.run(query, [id], function(err) {
                if (err) return reject(err);
                resolve(this.changes);
            });
        });
    }
};

module.exports = ticketService;