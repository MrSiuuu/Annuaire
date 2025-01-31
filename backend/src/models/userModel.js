const pool = require('../config/db');

const createUser = async (name, email, hashedPassword, userType) => {
    const query = `
        INSERT INTO users (name, email, password, user_type)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [name, email, hashedPassword, userType];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

module.exports = {
    createUser,
    findUserByEmail,
};
