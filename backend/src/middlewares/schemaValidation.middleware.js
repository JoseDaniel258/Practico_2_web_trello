const schemaValidation = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
       console.log('Error de Zod atrapado:', result.error);
      
       const errorMessage = result.error.issues && result.error.issues.length > 0 
        ? result.error.issues[0].message 
        : 'Error de formato en los datos enviados';

      return res.status(400).json({ 
        error: errorMessage
      });
    }
    
    req.body = result.data;
    next();
  }
};

module.exports = schemaValidation;