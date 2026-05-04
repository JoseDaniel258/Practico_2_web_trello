const { z } = require('zod');

const ticketSchema = z.object({
  titulo: z.string()
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(100, "El título es demasiado largo"),
    
  descripcion: z.string()
    .min(1, "La descripción es obligatoria"),  
    
  estado: z.number()
    .int()
    .min(1)
    .max(3)
    .default(1),  
    
  asignado_a: z.number()
    .optional()  
    .nullable(),
    
  proyecto_id: z.number()
    .int("Debe pertenecer a un proyecto válido")
});
const ticketEstadoSchema = z.object({
  estado: z.number()
    .int()
    .min(1)
    .max(3)
});

module.exports = { ticketSchema, ticketEstadoSchema };