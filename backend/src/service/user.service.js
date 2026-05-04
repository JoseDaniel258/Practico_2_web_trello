const db = require("../models/db");

const userService = {
     findUserById: (id) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT id, nombre, email FROM usuarios WHERE id = ?`;
            db.get(query, [id], (err, row) => {
                if (err) reject(err);
                resolve(row); 
            });
        });
    },

     findUserByEmail: (email) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM usuarios WHERE email = ?`;
            db.get(query, [email], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    },

     createUser: (nombre, email, contrasena) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)`;
            db.run(query, [nombre, email, contrasena], function(err) {
                if (err) reject(err);
                 resolve({ id: this.lastID, nombre, email });
            });
        });
    }
};

exports.findByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
};
module.exports = userService;