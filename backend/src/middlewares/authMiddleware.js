const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; 

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ error: 'Accès interdit. Aucun token fourni.' });
    }

    const token = authHeader.split(' ')[1]; 

    try {
        const decoded = jwt.verify(token, 'secret_key'); 
        req.user = decoded; 
        next(); 
    } catch (err) {
        res.status(401).json({ error: 'Token invalide ou expiré.' });
    }
};

module.exports = verifyToken;
