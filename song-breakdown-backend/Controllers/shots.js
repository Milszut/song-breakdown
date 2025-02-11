const express = require('express'); 
const router = express.Router();
const db = require('../db');
const verifyTeamAccess = require('./Auth/verifyTeamAccess');
const verifyEditorOrLeaderAccess = require('./Auth/verifyEditorOrLeaderAccess');

router.get('/:songId', async (req, res) => {
    const { songId } = req.params;

    const verifySql = `
        SELECT t.id AS team_id 
        FROM songs s 
        JOIN teams t ON s.team_id = t.id
        WHERE s.id = ?`;

    try {
        const [rows] = await db.query(verifySql, [songId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Song not found or not accessible' });
        }

        req.params.teamId = rows[0].team_id;

        verifyTeamAccess(req, res, async () => {
            const sql = `
                SELECT s.id, s.song_id, s.camera_id, s.description_id, s.duration, 
                       c.name as camera_name, d.name as description_name
                FROM shots s
                LEFT JOIN cameras c ON s.camera_id = c.id
                LEFT JOIN descriptions d ON s.description_id = d.id
                WHERE s.song_id = ?`;
            const [results] = await db.query(sql, [songId]);
            res.json(results);
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

router.post('/', async (req, res) => {
    const { song_id, camera_id, description_id, duration } = req.body;

    const verifySql = `
        SELECT t.id AS team_id 
        FROM songs s 
        JOIN teams t ON s.team_id = t.id
        WHERE s.id = ?`;

    try {
        const [rows] = await db.query(verifySql, [song_id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Song not found or not accessible' });
        }

        req.params.teamId = rows[0].team_id;

        verifyTeamAccess(req, res, async () => {
            verifyEditorOrLeaderAccess(req, res, async () => {
                const sql = 'INSERT INTO shots (song_id, camera_id, description_id, duration) VALUES (?, ?, ?, ?)';
                const [results] = await db.query(sql, [song_id, camera_id, description_id, duration]);
                res.json({ id: results.insertId, song_id, camera_id, description_id, duration });
            });
        });
    } catch (err) {
        console.error('Error inserting record:', err);
        res.status(500).json({ message: 'Error inserting record' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { camera_id, description_id, duration } = req.body;

    const verifySql = `
        SELECT t.id AS team_id 
        FROM songs s 
        JOIN teams t ON s.team_id = t.id
        JOIN shots sh ON sh.song_id = s.id
        WHERE sh.id = ?`;

    try {
        const [rows] = await db.query(verifySql, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Shot not found or not accessible' });
        }

        req.params.teamId = rows[0].team_id;

        verifyTeamAccess(req, res, async () => {
            verifyEditorOrLeaderAccess(req, res, async () => {
                const sql = 'UPDATE shots SET camera_id = ?, description_id = ?, duration = ? WHERE id = ?';
                await db.query(sql, [camera_id, description_id, duration, id]);
                res.json({ message: `Shot with id ${id} updated successfully` });
            });
        });
    } catch (err) {
        console.error('Error updating record:', err);
        res.status(500).json({ message: 'Error updating record' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const verifySql = `
        SELECT t.id AS team_id 
        FROM songs s 
        JOIN teams t ON s.team_id = t.id
        JOIN shots sh ON sh.song_id = s.id
        WHERE sh.id = ?`;

    try {
        const [rows] = await db.query(verifySql, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Shot not found or not accessible' });
        }

        req.params.teamId = rows[0].team_id;

        verifyTeamAccess(req, res, async () => {
            verifyEditorOrLeaderAccess(req, res, async () => {
                const sql = 'DELETE FROM shots WHERE id = ?';
                await db.query(sql, [id]);
                res.json({ message: `Shot with id ${id} deleted successfully` });
            });
        });
    } catch (err) {
        console.error('Error deleting record:', err);
        res.status(500).json({ message: 'Error deleting record' });
    }
});

module.exports = router;