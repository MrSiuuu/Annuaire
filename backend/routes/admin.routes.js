const express = require('express');
const router = express.Router();
const Admin = require('../models/admin.model');

// Route pour créer un admin
router.post('/create-first-admin', async (req, res) => {
  try {
    const adminExists = await Admin.findOne({ email: "admin@example.com" });
    if (adminExists) {
      return res.status(400).json({ message: "Un admin existe déjà" });
    }

    const admin = new Admin({
      email: "admin@example.com",
      password: "admin123",
      role: "superadmin"
    });

    await admin.save();
    res.json({ message: "Admin créé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 