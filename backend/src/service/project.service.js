const db = require("../models/db");

const projectService = {
     create: (nombre, descripcion, creadorId) => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                const queryProject = `INSERT INTO proyectos (nombre, descripcion, creador_id) VALUES (?, ?, ?)`;
                db.run(queryProject, [nombre, descripcion, creadorId], function(err) {
                    if (err) return reject(err);
                    const proyectoId = this.lastID;
                    const queryMember = `INSERT INTO miembros_proyecto (proyecto_id, usuario_id) VALUES (?, ?)`;
                    db.run(queryMember, [proyectoId, creadorId], (errMember) => {
                        if (errMember) return reject(errMember);
                        resolve({ id: proyectoId, nombre, descripcion });
                    });
                });
            });
        });
    },

     findAllByUserId: (userId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT p.* FROM proyectos p
                JOIN miembros_proyecto mp ON p.id = mp.proyecto_id
                WHERE mp.usuario_id = ?`;
            db.all(query, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

     findByIdAndUserId: (proyectoId, userId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT p.* FROM proyectos p
                JOIN miembros_proyecto mp ON p.id = mp.proyecto_id
                WHERE p.id = ? AND mp.usuario_id = ?`;
            db.get(query, [proyectoId, userId], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    },

     update: (id, data) => {
        return new Promise((resolve, reject) => {
            const { nombre, descripcion } = data;
            const query = `UPDATE proyectos SET nombre = ?, descripcion = ? WHERE id = ?`;
            db.run(query, [nombre, descripcion, id], function(err) {
                if (err) return reject(err);
                resolve(this.changes);
            });
        });
    },

     addMember: (proyectoId, usuarioId) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO miembros_proyecto (proyecto_id, usuario_id) VALUES (?, ?)`;
            db.run(query, [proyectoId, usuarioId], function(err) {
                if (err) return reject(err);
                resolve(this.lastID);
            });
        });
    },

     isMember: (proyectoId, usuarioId) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT 1 FROM miembros_proyecto WHERE proyecto_id = ? AND usuario_id = ?`;
            db.get(query, [proyectoId, usuarioId], (err, row) => {
                if (err) return reject(err);
                resolve(!!row);
            });
        });
    },

     getMembers: (proyectoId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT u.id, u.nombre, u.email
                FROM usuarios u
                JOIN miembros_proyecto mp ON u.id = mp.usuario_id
                WHERE mp.proyecto_id = ?
                ORDER BY u.nombre ASC`;
            db.all(query, [proyectoId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
};

module.exports = projectService;