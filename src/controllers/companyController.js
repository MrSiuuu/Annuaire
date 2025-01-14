const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import de jwt

const addCompany = async (req, res) => {
    const { name, email, phone, address, sector, description, website, social_links, password } = req.body; // Correction ici

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hachage du mot de passe
        const result = await pool.query(
            `INSERT INTO companies (name, email, phone, address, sector, description, website, social_links, password)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [name, email, phone, address, sector, description, website, social_links, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'entreprise' });
    }
};

const loginCompany = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM companies WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Entreprise non trouvée' });
        }

        const company = result.rows[0];
        const validPassword = await bcrypt.compare(password, company.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        const token = jwt.sign({ id: company.id, name: company.name }, 'secret_key', { expiresIn: '24h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
};

const getAllCompanies = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM companies WHERE is_verified = TRUE');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des entreprises' });
    }
};

const getCompanyById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM companies WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Entreprise non trouvée' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'entreprise' });
    }
};

const verifyCompany = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'UPDATE companies SET is_verified = TRUE WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Entreprise non trouvée' });
        }

        res.json({ message: 'Entreprise validée avec succès', company: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la validation de l\'entreprise' });
    }
};

const searchCompanies = async (req, res) => {
    const { name, sector, address } = req.query; // Récupère les critères de recherche

    let query = 'SELECT * FROM companies WHERE is_verified = TRUE';
    const values = [];

    if (name) {
        values.push(`%${name}%`);
        query += ` AND name ILIKE $${values.length}`; // Recherche insensible à la casse
    }

    if (sector) {
        values.push(`%${sector}%`);
        query += ` AND sector ILIKE $${values.length}`;
    }

    if (address) {
        values.push(`%${address}%`);
        query += ` AND address ILIKE $${values.length}`;
    }

    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la recherche des entreprises' });
    }
};

const getCompanyStats = async (req, res) => {
    const { company_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT 
                AVG(rating) AS average_rating,
                COUNT(*) AS total_reviews
             FROM reviews
             WHERE company_id = $1`,
            [company_id]
        );

        res.json(result.rows[0]); // Retourne les statistiques
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
};

const uploadLogo = async (req, res) => {
    const company_id = req.user.id; // Récupère l'ID de l'entreprise depuis le token

    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier téléchargé.' });
    }

    const logoPath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    try {
        const result = await pool.query(
            `UPDATE companies SET logo = $1 WHERE id = $2 RETURNING *`,
            [logoPath, company_id]
        );

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du logo.' });
    }
};
const updateCompany = async (req, res) => {
    const company_id = req.user.id; // ID récupéré depuis le token
    const { name, description, email, phone, website, social_links, logo } = req.body;

    try {
        const result = await pool.query(
            `UPDATE companies 
             SET name = COALESCE($1, name), 
                 description = COALESCE($2, description), 
                 email = COALESCE($3, email),
                 phone = COALESCE($4, phone),
                 website = COALESCE($5, website),
                 social_links = COALESCE($6, social_links),
                 logo = COALESCE($7, logo)
             WHERE id = $8 RETURNING *`,
            [name, description, email, phone, website, social_links, logo, company_id]
        );

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'entreprise.' });
    }
};




module.exports = {
    addCompany,
    getAllCompanies,
    getCompanyById,
    verifyCompany,
    loginCompany,
    searchCompanies,
    getCompanyStats,
    uploadLogo, 
    updateCompany, 
};
