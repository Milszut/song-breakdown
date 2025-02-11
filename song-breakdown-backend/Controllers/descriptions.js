const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyTeamAccess = require('./Auth/verifyTeamAccess');
const verifyEditorOrLeaderAccess = require('./Auth/verifyEditorOrLeaderAccess');

router.get('/:teamId', verifyTeamAccess, async (req, res) => {
    const { teamId } = req.params;
    const sql = 'SELECT * FROM descriptions WHERE team_id = ?';
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

    const sql = 'INSERT INTO descriptions (name, team_id) VALUES (?, ?)';
    try {
        const [results] = await db.query(sql, [name, teamId]);
        res.json({ id: results.insertId, name, team_id: teamId });
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
        const verifySql = 'SELECT team_id FROM descriptions WHERE id = ?';
        const [rows] = await db.query(verifySql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Description not found' });
        }

        req.params.teamId = rows[0].team_id;

        verifyTeamAccess(req, res, async () => {
            verifyEditorOrLeaderAccess(req, res, async () => {
                const sql = 'UPDATE descriptions SET name = ? WHERE id = ?';
                await db.query(sql, [name, id]);
                res.json({ message: `Description with id ${id} updated successfully` });
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
        const verifySql = 'SELECT team_id FROM descriptions WHERE id = ?';
        const [rows] = await db.query(verifySql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Description not found' });
        }

        req.params.teamId = rows[0].team_id;

        verifyTeamAccess(req, res, async () => {
            verifyEditorOrLeaderAccess(req, res, async () => {
                const checkSql = 'SELECT COUNT(*) AS count FROM shots WHERE description_id = ?';
                const [results] = await db.query(checkSql, [id]);

                if (results[0].count > 0) {
                    return res.status(400).json({ message: 'Cannot delete description: it is being used in shot records' });
                }

                const deleteSql = 'DELETE FROM descriptions WHERE id = ?';
                await db.query(deleteSql, [id]);
                res.json({ message: `Description with id ${id} deleted successfully` });
            });
        });
    } catch (err) {
        console.error('Error deleting description:', err);
        res.status(500).json({ message: 'Error deleting description' });
    }
});

module.exports = router;