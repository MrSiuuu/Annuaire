const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import de jwt

const addCompany = async (req, res) => {
    const { name, email, phone, address, sector, description, website, social_links, password } = req.body;
    
    console.log('Received company registration request:', {
        ...req.body,
        password: '***hidden***' // Pour ne pas logger le mot de passe
    });

    try {
        // Vérifier si l'email existe déjà
        const emailCheck = await pool.query('SELECT * FROM companies WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Préparer les valeurs par défaut pour les champs optionnels
        const websiteValue = website || null;
        const social_linksValue = social_links || null;

        const query = `
            INSERT INTO companies 
            (name, email, phone, address, sector, description, website, social_links, password, is_verified)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, FALSE)
            RETURNING id, name, email, phone, address, sector, description, website, social_links`;

        const result = await pool.query(query, [
            name,
            email,
            phone,
            address,
            sector,
            description,
            websiteValue,
            social_linksValue,
            hashedPassword
        ]);
        
        console.log('Company created successfully:', result.rows[0]);

        // Créer un token JWT pour la nouvelle entreprise
        const token = jwt.sign(
            { id: result.rows[0].id, type: 'company' },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '24h' }
        );

        // Retourner les données de l'entreprise avec le token
        res.status(201).json({
            message: "Entreprise créée avec succès. En attente de validation par un administrateur.",
            company: result.rows[0],
            token
        });

    } catch (err) {
        console.error('Error creating company:', err);
        
        // Gestion spécifique des erreurs
        if (err.code === '23505') { // Code pour violation de contrainte unique
            return res.status(400).json({ 
                error: 'Une entreprise avec cet email existe déjà'
            });
        }

        if (err.code === '23502') { // Code pour violation de contrainte NOT NULL
            return res.status(400).json({ 
                error: 'Tous les champs requis doivent être remplis'
            });
        }

        res.status(500).json({ 
            error: 'Erreur lors de l\'ajout de l\'entreprise',
            details: err.message
        });
    }
};

const loginCompany = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier si l'entreprise existe
        const result = await pool.query('SELECT * FROM companies WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Entreprise non trouvée' });
        }

        const company = result.rows[0];

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, company.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        // Créer le token
        const token = jwt.sign(
            { id: company.id, type: 'company' },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '24h' }
        );

        // Retourner les données sans le mot de passe
        const { password: _, ...companyData } = company;
        
        res.json({
            token,
            company: companyData
        });
    } catch (err) {
        console.error('Erreur de connexion:', err);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
};

const getAllCompanies = async (req, res) => {
    try {
        // Ajout d'une condition pour filtrer les entreprises vérifiées
        const query = 'SELECT * FROM companies WHERE is_verified = true ORDER BY created_at DESC';
        const result = await pool.query(query);
        
        console.log('Companies found:', result.rows.length);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching companies:', err);
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
