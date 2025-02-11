const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../db');
const SECRET_KEY = 'your_secret_key';

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(200).json({ error: true, message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if (!isPasswordValid) {
            return res.status(200).json({ error: true, message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user[0].id, email: user[0].email }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ error: false, token, message: 'Login successful!' });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: true, message: 'An unexpected error occurred during login' });
    }
});

router.post('/reset-password', async (req, res) => {
    const { email, question_id, answer, newPassword } = req.body;

    try {
        const [user] = await db.query(
            `SELECT u.answer 
             FROM users u
             WHERE u.email = ? AND u.security_question_id = ?`,
            [email, question_id]
        );

        if (user.length === 0) {
            return res.status(404).json({ error: true, message: 'Invalid email or security question!' });
        }

        const isAnswerValid = await bcrypt.compare(answer, user[0].answer);
        if (!isAnswerValid) {
            return res.status(400).json({ error: true, message: 'Invalid email or security question!' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const [updateResult] = await db.query(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashedPassword, email]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ error: true, message: 'Failed to reset password. User not found.' });
        }

        res.status(200).json({ error: false, message: 'Password reset successfully!' });
    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).json({ error: true, message: 'Failed to reset password' });
    }
});

module.exports = router;