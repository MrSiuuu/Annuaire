const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
            `INSERT INTO users (name, email, password, user_type, is_verified) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id, name, email, user_type`,
            [
                'admin',
                'admin@example.com',
                hashedPassword,
                'admin',
                true
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

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe et est un admin
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND user_type = $2',
            [email, 'admin']
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const admin = result.rows[0];

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Créer le token avec plus d'informations
        const token = jwt.sign(
            { 
                id: admin.id, 
                email: admin.email,
                user_type: 'admin'  // Explicitement définir le type
            },
            process.env.JWT_SECRET || 'votre_secret_jwt_super_securise',
            { expiresIn: '24h' }
        );

        // Retourner une réponse plus complète
        res.json({
            token,
            user: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                user_type: 'admin'
            }
        });

    } catch (error) {
        console.error('Erreur de connexion admin:', error);
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
};

const getPendingCompanies = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM companies WHERE is_verified = false ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des entreprises en attente:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getVerifiedCompanies = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM companies WHERE is_verified = true ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des entreprises vérifiées:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const verifyCompany = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'UPDATE companies SET is_verified = true WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Entreprise non trouvée' });
        }

        res.json({
            message: 'Entreprise validée avec succès',
            company: result.rows[0]
        });
    } catch (error) {
        console.error('Erreur lors de la validation de l\'entreprise:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    createFirstAdmin,
    loginAdmin,
    getPendingCompanies,
    getVerifiedCompanies,
    verifyCompany
}; 