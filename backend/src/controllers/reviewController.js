const pool = require('../config/db');

const addReview = async (req, res) => {
    const { company_id, rating, comment } = req.body; // Enlève user_id du body
    const user_id = req.user.id; // Récupère user_id depuis le token

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'La note doit être entre 1 et 5.' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO reviews (user_id, company_id, rating, comment)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [user_id, company_id, rating, comment]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'avis' });
    }
};

const getReviewsByCompany = async (req, res) => {
    const { company_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT reviews.*, users.name AS user_name
             FROM reviews
             JOIN users ON reviews.user_id = users.id
             WHERE company_id = $1
             ORDER BY created_at DESC`,
            [company_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des avis' });
    }
};

module.exports = {
    addReview,
    getReviewsByCompany,
};
