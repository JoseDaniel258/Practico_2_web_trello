const db = require("../models/db");

const userService = {
    // Busca un usuario por ID (usado en el middleware requireAuth)
    findUserById: (id) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT id, nombre, email FROM usuarios WHERE id = ?`;
            db.get(query, [id], (err, row) => {
                if (err) reject(err);
                resolve(row); // Retorna el usuario o undefined
            });
        });
    },

    // Busca un usuario por Email (usado en Login y Registro)
    findUserByEmail: (email) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM usuarios WHERE email = ?`;
            db.get(query, [email], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    },

    // Crea un nuevo usuario
    createUser: (nombre, email, contrasena) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)`;
            db.run(query, [nombre, email, contrasena], function(err) {
                if (err) reject(err);
                // Retornamos el ID y los datos básicos
                resolve({ id: this.lastID, nombre, email });
            });
        });
    }
};

module.exports = userService;