const schemaValidation = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        
        if (!result.success) {
            return res.status(400).json({ 
                error: result.error.errors[0].message 
            });
        }
        
        // Sobreescribimos el body con los datos limpios de Zod
        req.body = result.data;
        next();
    }
};

module.exports = schemaValidation;