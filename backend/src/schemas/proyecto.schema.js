const { z } = require('zod');

const proyectoSchema = z.object({
  nombre: z.string()
    .min(3, "El nombre del proyecto debe tener al menos 3 caracteres")
    .max(50, "El nombre es muy largo"),
    
  descripcion: z.string()
    .max(255, "La descripción no puede exceder los 255 caracteres")
    .optional() 
});

const addMemberSchema = z.object({
  usuario_id: z.number({
    required_error: "El usuario_id es requerido",
    invalid_type_error: "El usuario_id debe ser un número entero"
  }).int("El usuario_id debe ser un número entero")
    .positive("El usuario_id debe ser un número positivo")
});

module.exports = { proyectoSchema, addMemberSchema };