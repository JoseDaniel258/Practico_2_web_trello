const requireAuth = require("../middlewares/user.middleware");
const schemaValidation = require("../middlewares/schemaValidation.middleware");
const { isJsonRequestValid } = require("../middlewares/isJsonRequestValid.middleware");
const { proyectoSchema, addMemberSchema } = require("../schemas/proyecto.schema");
const controller = require("../controllers/project.controller");

module.exports = app => {
    let router = require("express").Router();

     router.use(requireAuth);

    router.post('/', isJsonRequestValid, schemaValidation(proyectoSchema), controller.postCreate);
    router.get('/', controller.getProjects);
    router.get('/:id', controller.getProjectById);
    router.put('/:id', isJsonRequestValid, schemaValidation(proyectoSchema), controller.updateProject);

     router.post('/:id/miembros', isJsonRequestValid, schemaValidation(addMemberSchema), controller.addMember);

     router.get('/:id/miembros', controller.getMembers);

    app.use('/api/proyectos', router);
};