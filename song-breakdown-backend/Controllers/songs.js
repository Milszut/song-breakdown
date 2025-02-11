const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyTeamAccess = require('./Auth/verifyTeamAccess');
const verifyEditorOrLeaderAccess = require('./Auth/verifyEditorOrLeaderAccess');

router.get('/:teamId', verifyTeamAccess, async (req, res) => {
    const { teamId } = req.params;
    const sql = 'SELECT * FROM songs WHERE team_id = ?';
    try {
        const [results] = await db.query(sql, [teamId]);
        res.json(results);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

router.post('/:teamId', verifyTeamAccess, verifyEditorOrLeaderAccess, async (req, res) => {
    const { teamId } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    const sql = 'INSERT INTO songs (team_id, name) VALUES (?, ?)';
    try {
        const [results] = await db.query(sql, [teamId, name]);
        res.json({ id: results.insertId, team_id: teamId, name });
    } catch (err) {
        console.error('Error inserting record:', err);
        res.status(500).json({ message: 'Error inserting record' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    try {
        const verifySql = 'SELECT team_id FROM songs WHERE id = ?';
        const [rows] = await db.query(verifySql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Song not found' });
        }

        req.params.teamId = rows[0].team_id;

        verifyTeamAccess(req, res, async () => {
            verifyEditorOrLeaderAccess(req, res, async () => {
                const sql = 'UPDATE songs SET name = ? WHERE id = ?';
                await db.query(sql, [name, id]);
                res.json({ message: `Song with id ${id} updated successfully` });
            });
        });
    } catch (err) {
        console.error('Error updating record:', err);
        res.status(500).json({ message: 'Error updating record' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const verifySql = 'SELECT team_id FROM songs WHERE id = ?';
        const [rows] = await db.query(verifySql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Song not found' });
        }

        req.params.teamId = rows[0].team_id;

        verifyTeamAccess(req, res, async () => {
            verifyEditorOrLeaderAccess(req, res, async () => {
                const sql = 'DELETE FROM songs WHERE id = ?';
                await db.query(sql, [id]);
                res.json({ message: `Song with id ${id} deleted successfully` });
            });
        });
    } catch (err) {
        console.error('Error deleting record:', err);
        res.status(500).json({ message: 'Error deleting record' });
    }
});

module.exports = router;