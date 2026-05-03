const { findUserById } = require("../service/user.service");
const { verifyToken } = require("../utils/jwt.utils");

const requireAuth = async (req, res, next) => { // Agregamos async[cite: 5]
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    const splittedHeader = authHeader.split(' ');
    if (splittedHeader.length !== 2 || splittedHeader[0] !== 'Bearer') {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = splittedHeader[1];
    const payload = verifyToken(token);
    
    if (!payload || payload.id === undefined) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Aquí usamos await porque SQLite es asíncrono[cite: 1, 5]
    const user = await findUserById(payload.id); 
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user; // Esto es vital para saber quién creó un proyecto
    next();
};

module.exports = requireAuth;