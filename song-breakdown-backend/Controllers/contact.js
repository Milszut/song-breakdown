const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
    const { first_name, last_name, email, message } = req.body;

    if (!first_name || !last_name || !email || !message) {
        return res.status(400).json({ error: true, message: 'All fields are required' });
    }

    try {
        const sql = `
            INSERT INTO messages (first_name, last_name, email, message, data) 
            VALUES (?, ?, ?, ?, NOW())
        `;
        await db.query(sql, [first_name, last_name, email, message]);

        res.status(201).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: true, message: 'Failed to save message' });
    }
});

module.exports = router;