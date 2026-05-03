const { z } = require('zod');

// Schema para registro
const registerUserSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Formato de email inválido"),
  contrasena: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
});

// Schema para login
const loginUserSchema = z.object({
  email: z.string().email("Formato de email inválido"),
  contrasena: z.string().min(1, "La contraseña es requerida")
});

module.exports = { registerUserSchema, loginUserSchema };