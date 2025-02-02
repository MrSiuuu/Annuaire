const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const pool = require('../config/db');

const register = async (req, res) => {
    const { name, email, password, user_type } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.createUser(name, email, hashedPassword, user_type);
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        const token = jwt.sign({ id: user.id, user_type: user.user_type }, 'secret_key', { expiresIn: '24h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
};
const updateUser = async (req, res) => {
    const user_id = req.user.id; // ID récupéré depuis le token
    const { name, email } = req.body;

    try {
        const result = await pool.query(
            `UPDATE users 
             SET name = COALESCE($1, name), 
                 email = COALESCE($2, email)
             WHERE id = $3 RETURNING *`,
            [name, email, user_id]
        );

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur.' });
    }
};
const updatePassword = async (req, res) => {
    const user_id = req.user.id; // ID récupéré depuis le token
    const { new_password } = req.body;

    // Vérification des données entrantes
    if (!new_password || new_password.length < 6) {
        return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(new_password, 10); // Hachage du mot de passe
        const result = await pool.query(
            `UPDATE users SET password = $1 WHERE id = $2 RETURNING *`,
            [hashedPassword, user_id]
        );

        res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du mot de passe.' });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            'SELECT id, name, email, user_type, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    register,
    login,
    updateUser,
    updatePassword,
    getUserProfile
};
