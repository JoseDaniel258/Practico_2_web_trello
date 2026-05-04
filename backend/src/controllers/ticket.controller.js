const ticketService = require("../service/ticket.service");
const projectService = require("../service/project.service");

exports.postCreate = async (req, res) => {
    try {
        const { titulo, descripcion, proyecto_id, asignado_a } = req.body;

        const proyecto = await projectService.findByIdAndUserId(proyecto_id, req.user.id);
        if (!proyecto) {
            return res.status(403).json({ message: "No tenés acceso a este proyecto" });
        }

        if (asignado_a) {
            const esMiembro = await projectService.isMember(proyecto_id, asignado_a);
            if (!esMiembro) {
                return res.status(400).json({ message: "El usuario asignado no es miembro del proyecto" });
            }
        }

        const nuevoTicket = await ticketService.create({ titulo, descripcion, proyecto_id, asignado_a });
        res.status(201).json({ message: "Ticket creado exitosamente", ticket: nuevoTicket });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTicketsByProject = async (req, res) => {
    try {
        const { proyectoId } = req.params;

        const proyecto = await projectService.findByIdAndUserId(proyectoId, req.user.id);
        if (!proyecto) {
            return res.status(403).json({ message: "No tenés acceso a este proyecto" });
        }

        const tickets = await ticketService.findAllByProjectId(proyectoId);
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await ticketService.findById(id);
        if (!ticket) return res.status(404).json({ message: "Ticket no encontrado" });

        const proyecto = await projectService.findByIdAndUserId(ticket.proyecto_id, req.user.id);
        if (!proyecto) return res.status(403).json({ message: "No tenés acceso a este ticket" });

        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const ticket = await ticketService.findById(id);
        if (!ticket) return res.status(404).json({ message: "Ticket no encontrado" });

        const proyecto = await projectService.findByIdAndUserId(ticket.proyecto_id, req.user.id);
        if (!proyecto) return res.status(403).json({ message: "No tenés acceso a este ticket" });

        delete updateData.estado;

        if (updateData.asignado_a) {
            const esMiembro = await projectService.isMember(ticket.proyecto_id, updateData.asignado_a);
            if (!esMiembro) {
                return res.status(400).json({ message: "El usuario asignado no es miembro del proyecto" });
            }
        }

        await ticketService.update(id, updateData);
        res.status(200).json({ message: "Ticket actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body; 

        if (![1, 2, 3].includes(estado)) {
            return res.status(400).json({ message: 'Estado inválido. Debe ser 1, 2 o 3.' });
        }

        const ticket = await ticketService.findById(id);
        if (!ticket) return res.status(404).json({ message: 'Ticket no encontrado' });

        const proyecto = await projectService.findByIdAndUserId(ticket.proyecto_id, req.user.id);
        if (!proyecto) return res.status(403).json({ message: 'No tenés acceso a este ticket' });

        const estadoActual = ticket.estado;
        const diferencia = Math.abs(estado - estadoActual);

        if (diferencia !== 1) {
            return res.status(400).json({
                message: `Movimiento inválido. No podés pasar del estado ${estadoActual} al ${estado} directamente.`
            });
        }

        if (estado === 2 && !ticket.asignado_a) {
            return res.status(400).json({
                message: 'No podés iniciar un ticket sin un responsable asignado.'
            });
        }

        await ticketService.update(id, { estado: estado });
        res.status(200).json({ message: 'Estado actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await ticketService.findById(id);
        if (!ticket) return res.status(404).json({ message: "Ticket no encontrado" });

        const proyecto = await projectService.findByIdAndUserId(ticket.proyecto_id, req.user.id);
        if (!proyecto) return res.status(403).json({ message: "No tenés acceso a este ticket" });

        await ticketService.remove(id);
        res.status(200).json({ message: "Ticket eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};