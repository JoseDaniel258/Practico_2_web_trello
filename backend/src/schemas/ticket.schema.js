const { z } = require('zod');

const ticketSchema = z.object({
  titulo: z.string()
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(100, "El título es demasiado largo"),
    
  descripcion: z.string()
    .min(1, "La descripción es obligatoria"), // Regla de negocio: No crear tickets sin info
    
  estado: z.number()
    .int()
    .min(1)
    .max(3)
    .default(1), // 1: Pendiente, 2: En Progreso, 3: Completado
    
  asignado_a: z.number()
    .optional() // Puede ser nulo al inicio, pero obligatorio para "En Progreso"
    .nullable(),
    
  proyecto_id: z.number()
    .int("Debe pertenecer a un proyecto válido")
});

module.exports = { ticketSchema };