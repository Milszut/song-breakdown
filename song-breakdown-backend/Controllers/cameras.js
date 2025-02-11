const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyTeamAccess = require('./Auth/verifyTeamAccess');
const verifyEditorOrLeaderAccess = require('./Auth/verifyEditorOrLeaderAccess');

router.get('/:teamId', verifyTeamAccess, async (req, res) => {
    const { teamId } = req.params;
    const sql = 'SELECT * FROM cameras WHERE team_id = ?';

    try {
        const [results] = await db.query(sql, [teamId]);
        res.json(results);
    } catch (err) {
        console.error('Error fetching cameras:', err);
        res.status(500).json({ message: 'Error fetching cameras' });
    }
});

router.post('/:teamId', verifyTeamAccess, verifyEditorOrLeaderAccess, async (req, res) => {
    const { teamId } = req.params;
    let { name, color } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }
    if (!color) {
        color = 'bg-white';
    }

    const sql = 'INSERT INTO cameras (name, color, team_id) VALUES (?, ?, ?)';
    try {
        const [results] = await db.query(sql, [name, color, teamId]);
        res.status(201).json({ id: results.insertId, name, color, team_id: teamId });
    } catch (err) {
        console.error('Error inserting camera:', err);
        res.status(500).json({ message: 'Error inserting camera' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    try {
        const verifySql = 'SELECT team_id FROM cameras WHERE id = ?';
        const [rows] = await db.query(verifySql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Camera not found' });
        }

        req.params.teamId = rows[0].team_id;

        verifyTeamAccess(req, res, async () => {
            verifyEditorOrLeaderAccess(req, res, async () => {
                const sql = 'UPDATE cameras SET name = ? WHERE id = ?';
                await db.query(sql, [name, id]);
                res.json({ message: `Camera with id ${id} updated successfully` });
            });
        });
    } catch (err) {
        console.error('Error updating camera name:', err);
        res.status(500).json({ message: 'Error updating camera name' });
    }
});

router.put('/:id/color', async (req, res) => {
    const { id } = req.params;
    const { color } = req.body;

    if (!color) {
        return res.status(400).json({ message: 'Color is required' });
    }

    try {
        const verifySql = 'SELECT team_id FROM cameras WHERE id = ?';
        const [rows] = await db.query(verifySql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Camera not found' });
        }

        req.params.teamId = rows[0].team_id;

        verifyTeamAccess(req, res, async () => {
            verifyEditorOrLeaderAccess(req, res, async () => {
                const sql = 'UPDATE cameras SET color = ? WHERE id = ?';
                await db.query(sql, [color, id]);
                res.json({ message: `Camera with id ${id} updated color successfully` });
            });
        });
    } catch (err) {
        console.error('Error updating camera color:', err);
        res.status(500).json({ message: 'Error updating camera color' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const verifySql = 'SELECT team_id FROM cameras WHERE id = ?';
        const [rows] = await db.query(verifySql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Camera not found' });
        }

        req.params.teamId = rows[0].team_id;

        verifyTeamAccess(req, res, async () => {
            verifyEditorOrLeaderAccess(req, res, async () => {
                const checkSql = 'SELECT COUNT(*) AS count FROM shots WHERE camera_id = ?';
                const [results] = await db.query(checkSql, [id]);

                if (results[0].count > 0) {
                    return res.status(400).json({ message: 'Cannot delete camera: it is being used in shot records' });
                }

                const deleteSql = 'DELETE FROM cameras WHERE id = ?';
                await db.query(deleteSql, [id]);
                res.json({ message: `Camera with id ${id} deleted successfully` });
            });
        });
    } catch (err) {
        console.error('Error deleting camera:', err);
        res.status(500).json({ message: 'Error deleting camera' });
    }
});

module.exports = router;