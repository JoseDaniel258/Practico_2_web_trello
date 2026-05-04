const requireAuth = require('../middlewares/user.middleware');
const schemaValidation = require('../middlewares/schemaValidation.middleware');
const { isJsonRequestValid } = require('../middlewares/isJsonRequestValid.middleware');
const { ticketSchema, ticketEstadoSchema } = require('../schemas/ticket.schema');
const controller = require('../controllers/ticket.controller');

module.exports = (app) => {
  let router = require('express').Router();

   router.use(requireAuth);

   router.get('/proyecto/:proyectoId', controller.getTicketsByProject);

   router.post(
    '/',
    isJsonRequestValid,
    schemaValidation(ticketSchema),
    controller.postCreate
  );
  
  router.get('/:id', controller.getTicketById);
  router.put('/:id', isJsonRequestValid, controller.updateTicket);
  router.delete('/:id', controller.deleteTicket);

   router.patch(
    '/:id/estado',
    isJsonRequestValid,
    schemaValidation(ticketEstadoSchema),
    controller.updateStatus
  );

  app.use('/api/tickets', router);
};