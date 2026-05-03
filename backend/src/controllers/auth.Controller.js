const userService = require("../service/user.service");
const { generateToken } = require("../utils/jwt.utils");
const { sha1Encode } = require("../utils/text.utils");

// Registro de Usuario
exports.registrar = async (req, res) => {
    try {
        const { nombre, email, contrasena } = req.body;

        // 1. Verificar si el usuario ya existe usando el servicio
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "El correo electrónico ya está registrado" });
        }

        // 2. Hashear la contraseña
        const encodedPassword = sha1Encode(contrasena);

        // 3. Crear el usuario usando el servicio
        const newUser = await userService.createUser(nombre, email, encodedPassword);

        res.status(201).json({ 
            message: "Usuario registrado exitosamente",
            id: newUser.id 
        });

    } catch (error) {
        res.status(500).json({ error: "Error al registrar el usuario", detalle: error.message });
    }
};

// Login de Usuario
exports.login = async (req, res) => {
    try {
        const { email, contrasena } = req.body;

        // 1. Buscar usuario por email usando el servicio
        const usuario = await userService.findUserByEmail(email);
        
        if (!usuario) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectas" });
        }

        // 2. Comparar contraseñas (ambas en SHA1)
        const encodedPassword = sha1Encode(contrasena);
        if (encodedPassword !== usuario.contrasena) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectas" });
        }

        // 3. Generar Token con el ID y Email
        const token = generateToken({ 
            id: usuario.id, 
            email: usuario.email 
        });
        
        res.status(200).json({ 
            message: "Login exitoso",
            token: token 
        });

    } catch (error) {
        res.status(500).json({ error: "Error en el servidor", detalle: error.message });
    }
};