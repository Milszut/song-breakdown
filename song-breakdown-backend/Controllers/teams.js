const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/userTeams', async (req, res) => {
    const userId = req.user.id;

    const sql = `
        SELECT t.id, t.name, t.description, 
            (SELECT COUNT(*) FROM team_members tm2 WHERE tm2.team_id = t.id) AS membersCount
        FROM teams t
        JOIN team_members tm ON t.id = tm.team_id
        WHERE tm.user_id = ?    
    `;

    try {
        const [results] = await db.query(sql, [userId]);
        res.json(results);
    } catch (err) {
        console.error('Error fetching teams:', err);
        res.status(500).json({ message: 'Error fetching teams' });
    }
});

router.post('/', async (req, res) => {
    const userId = req.user.id;
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Team name is required' });
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const createTeamSql = `
            INSERT INTO teams (name, description)
            VALUES (?, ?)
        `;
        const [teamResult] = await connection.query(createTeamSql, [name, description]);
        const teamId = teamResult.insertId;

        const addLeaderSql = `
            INSERT INTO team_members (user_id, team_id, role_id)
            VALUES (?, ?, 1)
        `;
        await connection.query(addLeaderSql, [userId, teamId]);

        await connection.commit();

        res.status(201).json({ message: 'Team created successfully', teamId });
    } catch (error) {
        console.error('Error creating team:', error);
        await connection.rollback();
        res.status(500).json({ message: 'Failed to create team' });
    } finally {
        connection.release();
    }
});

router.get('/pending', async (req, res) => {
    const userId = req.user.id;

    const sql = `
        SELECT i.id, t.name AS team_name
        FROM invitations i
        JOIN teams t ON i.team_id = t.id
        WHERE i.user_id = ? AND i.status_id = 1
    `;

    try {
        const [invitations] = await db.query(sql, [userId]);
        res.json(invitations);
    } catch (err) {
        console.error('Error fetching invitations:', err);
        res.status(500).json({ message: 'Error fetching invitations' });
    }
});

router.put('/invitations/:id/accept', async (req, res) => {
    const invitationId = req.params.id;
    const userId = req.user.id;

    try {
        const [invitationResults] = await db.query(
            `SELECT team_id FROM invitations WHERE id = ? AND user_id = ? AND status_id = 1`, 
            [invitationId, userId]
        );

        if (invitationResults.length === 0) {
            return res.status(404).json({ message: 'Invitation not found or already processed' });
        }

        const teamId = invitationResults[0].team_id;

        await db.query(
            `INSERT INTO team_members (user_id, team_id, role_id) VALUES (?, ?, 3)`, 
            [userId, teamId]
        );

        await db.query(
            `UPDATE invitations SET status_id = 2 WHERE id = ?`, 
            [invitationId]
        );

        res.json({ success: true, message: 'Invitation accepted and user added to the team' });
    } catch (error) {
        console.error('Error accepting invitation:', error);
        res.status(500).json({ message: 'Error accepting invitation' });
    }
});

router.put('/invitations/:id/decline', async (req, res) => {
    const invitationId = req.params.id;
    const userId = req.user.id;

    try {
        const [invitationResults] = await db.query(
            `SELECT id FROM invitations WHERE id = ? AND user_id = ? AND status_id = 1`, 
            [invitationId, userId]
        );

        if (invitationResults.length === 0) {
            return res.status(404).json({ message: 'Invitation not found or already processed' });
        }

        await db.query(
            `UPDATE invitations SET status_id = 3 WHERE id = ?`, 
            [invitationId]
        );

        res.json({ success: true, message: 'Invitation declined' });
    } catch (error) {
        console.error('Error declining invitation:', error);
        res.status(500).json({ message: 'Error declining invitation' });
    }
});

module.exports = router;