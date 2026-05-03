const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// El archivo se guardará en la raíz del backend como 'database.sqlite'
const dbPath = path.resolve(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con SQLite:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

module.exports = db;