const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

router.get('/me', async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: true, message: 'User not authenticated' });
    }

    const sql = `
        SELECT 
            t.id AS team_id,
            t.name AS team_name,
            tm.role_id,
            r.name AS role_name
        FROM 
            team_members tm
        JOIN 
            teams t ON tm.team_id = t.id
        JOIN 
            roles r ON tm.role_id = r.id
        WHERE 
            tm.user_id = ?
    `;

    try {
        const [teamRoles] = await db.query(sql, [userId]);
        const user = {
            ...req.user,
            teams: teamRoles
        };
        res.status(200).json({ error: false, user });
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).json({ error: true, message: 'Failed to fetch user data' });
    }
});

router.get('/profile', async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: true, message: 'User not authenticated' });
    }

    const sql = `
        SELECT id, name, lastname, email
        FROM users
        WHERE id = ?
    `;

    try {
        const [results] = await db.query(sql, [userId]);

        if (results.length === 0) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        res.status(200).json({ error: false, user: results[0] });
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ error: true, message: 'Failed to fetch user profile' });
    }
});

router.put('/profile/name', async (req, res) => {
    const userId = req.user?.id;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: true, message: 'Name is required' });
    }

    const sql = `
        UPDATE users
        SET name = ?
        WHERE id = ?
    `;

    try {
        const [results] = await db.query(sql, [name, userId]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        res.status(200).json({ error: false, message: 'Name updated successfully' });
    } catch (err) {
        console.error('Error updating name:', err);
        res.status(500).json({ error: true, message: 'Failed to update name' });
    }
});

router.put('/profile/lastname', async (req, res) => {
    const userId = req.user?.id;
    const { lastname } = req.body;

    if (!lastname) {
        return res.status(400).json({ error: true, message: 'Last name is required' });
    }

    const sql = `
        UPDATE users
        SET lastname = ?
        WHERE id = ?
    `;

    try {
        const [results] = await db.query(sql, [lastname, userId]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        res.status(200).json({ error: false, message: 'Last name updated successfully' });
    } catch (err) {
        console.error('Error updating last name:', err);
        res.status(500).json({ error: true, message: 'Failed to update last name' });
    }
});

router.put('/profile/password', async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ error: true, message: 'All password fields are required' });
    }

    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ error: true, message: 'New passwords do not match' });
    }

    try {
        const [user] = await db.query('SELECT password FROM users WHERE id = ?', [userId]);

        if (user.length === 0) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        const storedPassword = user[0].password;

        const isPasswordValid = await bcrypt.compare(currentPassword, storedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ error: true, message: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

        res.status(200).json({ error: false, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: true, message: 'Error changing password' });
    }
});

module.exports = router;