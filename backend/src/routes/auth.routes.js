const { isJsonRequestValid } = require("../middlewares/isJsonRequestValid.middleware.js");
const schemaValidation = require("../middlewares/schemaValidation.middleware.js");
const { registerUserSchema, loginUserSchema } = require("../schemas/usuarioSchema.js"); // ← cambio aquí
const controller = require("../controllers/auth.controller.js");

module.exports = app => {
    let router = require("express").Router();

    router.post('/registrar', isJsonRequestValid, schemaValidation(registerUserSchema), controller.registrar);
    router.post('/login', isJsonRequestValid, schemaValidation(loginUserSchema), controller.login);

    app.use('/auth', router);
};