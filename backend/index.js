const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales (van ANTES que las rutas)
app.use(cors());
app.use(express.json());

// Base de datos
const initDatabase = require('./src/models/init');
initDatabase();

// Rutas
require('./src/routes/auth.routes')(app);
require('./src/routes/project.routes')(app);
require('./src/routes/ticket.routes')(app);

// Ruta de salud
app.get('/', (req, res) => {
    res.json({ message: "Servidor del Issue Tracker funcionando" });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});