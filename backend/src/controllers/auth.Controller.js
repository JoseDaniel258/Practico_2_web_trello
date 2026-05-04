const userService = require('../service/user.service');
const { generateToken } = require('../utils/jwt.utils');
const { sha1Encode } = require('../utils/text.utils');

exports.registrar = async (req, res) => {
    try {
        const { nombre, email, contrasena } = req.body;

        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

        const encodedPassword = sha1Encode(contrasena);

        const newUser = await userService.createUser(nombre, email, encodedPassword);

        res.status(201).json({ 
            message: 'Usuario registrado exitosamente',
            id: newUser.id 
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario', detalle: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, contrasena } = req.body;

        const usuario = await userService.findUserByEmail(email);
        
        if (!usuario) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectas' });
        }

        const encodedPassword = sha1Encode(contrasena);
        if (encodedPassword !== usuario.contrasena) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectas' });
        }

        const token = generateToken({ 
            id: usuario.id, 
            email: usuario.email 
        });
        
        res.status(200).json({ 
            message: 'Login exitoso',
            token: token 
        });

    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor', detalle: error.message });
    }
};