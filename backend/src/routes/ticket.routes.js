const requireAuth = require('../middlewares/user.middleware');
const schemaValidation = require('../middlewares/schemaValidation.middleware');
const { isJsonRequestValid } = require('../middlewares/isJsonRequestValid.middleware');
const { ticketSchema, ticketEstadoSchema } = require('../schemas/ticket.schema');
const controller = require('../controllers/ticket.controller');

module.exports = (app) => {
  let router = require('express').Router();

  // Todas las rutas requieren token
  router.use(requireAuth);

  // Listar tickets de un proyecto (para el tablero)
  router.get('/proyecto/:proyectoId', controller.getTicketsByProject);

  // CRUD de tickets
  router.post(
    '/',
    isJsonRequestValid,
    schemaValidation(ticketSchema),
    controller.postCreate
  );
  
  router.get('/:id', controller.getTicketById);
  router.put('/:id', isJsonRequestValid, controller.updateTicket);
  router.delete('/:id', controller.deleteTicket);

  // Cambio de estado (Fusionado y limpio)
  router.patch(
    '/:id/estado',
    isJsonRequestValid,
    schemaValidation(ticketEstadoSchema),
    controller.updateStatus
  );

  app.use('/api/tickets', router);
};