const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

 app.use(cors());
app.use(express.json());

 const initDatabase = require('./src/models/init');
initDatabase();

 require('./src/routes/auth.routes')(app);
require('./src/routes/project.routes')(app);
require('./src/routes/ticket.routes')(app);

 app.get('/', (req, res) => {
    res.json({ message: "Servidor del Issue Tracker funcionando" });
});

 app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});