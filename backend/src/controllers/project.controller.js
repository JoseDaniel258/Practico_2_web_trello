const projectService = require("../service/project.service");

exports.postCreate = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const creadorId = req.user.id;

        const nuevoProyecto = await projectService.create(nombre, descripcion, creadorId);
        res.status(201).json({
            message: "Proyecto creado exitosamente",
            proyecto: nuevoProyecto
        });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el proyecto", detalle: error.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await projectService.findAllByUserId(req.user.id);
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener proyectos", detalle: error.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const proyecto = await projectService.findByIdAndUserId(id, req.user.id);
        if (!proyecto) {
            return res.status(404).json({ message: "Proyecto no encontrado o sin acceso" });
        }
        res.status(200).json(proyecto);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el proyecto", detalle: error.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

         const proyecto = await projectService.findByIdAndUserId(id, req.user.id);
        if (!proyecto) {
            return res.status(404).json({ message: "Proyecto no encontrado o sin acceso" });
        }

        await projectService.update(id, { nombre, descripcion });
        res.status(200).json({ message: "Proyecto actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el proyecto", detalle: error.message });
    }
};

exports.addMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body; 

        const proyecto = await projectService.findByIdAndUserId(id, req.user.id);
        if (!proyecto) {
            return res.status(404).json({ message: 'Proyecto no encontrado o sin acceso' });
        }

        const userService = require('../service/user.service');
        const usuarioExiste = await userService.findUserByEmail(email); 
        
        if (!usuarioExiste) {
            return res.status(404).json({ message: 'El usuario con ese email no existe' });
        }

        await projectService.addMember(id, usuarioExiste.id);
        res.status(200).json({ message: 'Miembro agregado correctamente' });
    } catch (error) {
        if (error.message && error.message.includes('UNIQUE')) {
            return res.status(400).json({ message: 'El usuario ya es miembro del proyecto' });
        }
        res.status(500).json({ error: 'Error al agregar miembro', detalle: error.message });
    }
};
exports.getMembers = async (req, res) => {
    try {
        const { id } = req.params;

         const proyecto = await projectService.findByIdAndUserId(id, req.user.id);
        if (!proyecto) {
            return res.status(404).json({ message: "Proyecto no encontrado o sin acceso" });
        }

        const miembros = await projectService.getMembers(id);
        res.status(200).json(miembros);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener miembros", detalle: error.message });
    }
};