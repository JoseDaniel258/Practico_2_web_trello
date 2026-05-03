const requireAuth = require("../middlewares/user.middleware");
const schemaValidation = require("../middlewares/schemaValidation.middleware");
const { isJsonRequestValid } = require("../middlewares/isJsonRequestValid.middleware");
const { proyectoSchema, addMemberSchema } = require("../schemas/proyecto.schema");
const controller = require("../controllers/project.controller");

module.exports = app => {
    let router = require("express").Router();

    // Todas las rutas requieren token
    router.use(requireAuth);

    router.post('/', isJsonRequestValid, schemaValidation(proyectoSchema), controller.postCreate);
    router.get('/', controller.getProjects);
    router.get('/:id', controller.getProjectById);
    router.put('/:id', isJsonRequestValid, schemaValidation(proyectoSchema), controller.updateProject);

    // Punto 5: addMember con validación Zod
    router.post('/:id/miembros', isJsonRequestValid, schemaValidation(addMemberSchema), controller.addMember);

    // Punto 4: Listar miembros del proyecto
    router.get('/:id/miembros', controller.getMembers);

    app.use('/api/proyectos', router);
};