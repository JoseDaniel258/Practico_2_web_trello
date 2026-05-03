const requireAuth = require("../middlewares/user.middleware");
const schemaValidation = require("../middlewares/schemaValidation.middleware");
const { isJsonRequestValid } = require("../middlewares/isJsonRequestValid.middleware");
const { ticketSchema } = require("../schemas/ticket.schema");
const controller = require("../controllers/ticket.controller");

module.exports = app => {
    let router = require("express").Router();

    // Todas las rutas requieren token
    router.use(requireAuth);

    // Listar tickets de un proyecto (para el tablero)
    router.get('/proyecto/:proyectoId', controller.getTicketsByProject);

    // CRUD de tickets
    router.post('/', isJsonRequestValid, schemaValidation(ticketSchema), controller.postCreate);
    router.get('/:id', controller.getTicketById);
    router.put('/:id', isJsonRequestValid, controller.updateTicket);
    router.delete('/:id', controller.deleteTicket);

    // Cambio de estado (reglas de flujo)
    router.patch('/:id/estado', isJsonRequestValid, controller.updateStatus);

    app.use('/api/tickets', router);
};