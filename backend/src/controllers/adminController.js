const bcrypt = require('bcrypt');
const pool = require('../config/db');

const createFirstAdmin = async (req, res) => {
    try {
        // Vérifier si un admin existe déjà
        const checkAdmin = await pool.query(
            "SELECT * FROM users WHERE user_type = 'admin' LIMIT 1"
        );

        if (checkAdmin.rows.length > 0) {
            return res.status(400).json({ message: "Un admin existe déjà" });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Créer le premier admin
        const result = await pool.query(
            `INSERT INTO users (name, email, password, user_type) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id, name, email, user_type`,
            [
                'admin',
                'admin@example.com',
                hashedPassword,
                'admin'
            ]
        );

        res.json({ 
            message: "Admin créé avec succès",
            admin: result.rows[0]
        });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createFirstAdmin
}; 