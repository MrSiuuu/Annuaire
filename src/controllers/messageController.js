const pool = require('../config/db');

const sendMessage = async (req, res) => {
    const { sender_id, receiver_id, content } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO messages (sender_id, receiver_id, content)
             VALUES ($1, $2, $3) RETURNING *`,
            [sender_id, receiver_id, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
    }
};

const getMessages = async (req, res) => {
    const { user_id } = req.query;

    try {
        const result = await pool.query(
            `SELECT * FROM messages WHERE sender_id = $1 OR receiver_id = $1 ORDER BY created_at DESC`,
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
    }
};

module.exports = {
    sendMessage,
    getMessages,
};
