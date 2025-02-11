const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyTeamAccess = require('./Auth/verifyTeamAccess');
const verifyEditorOrLeaderAccess = require('./Auth/verifyEditorOrLeaderAccess');

router.get('/:teamId', verifyTeamAccess, async (req, res) => {
    const { teamId } = req.params;
    const sql = 'SELECT * FROM events WHERE team_id = ?';

    try {
        const [results] = await db.query(sql, [teamId]);
        res.json(results);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ message: 'Error fetching events' });
    }
});

router.get('/:teamId/:eventId', verifyTeamAccess, async (req, res) => {
    const { teamId, eventId } = req.params;
    const sql = 'SELECT * FROM events WHERE team_id = ? AND id = ?';

    try {
        const [results] = await db.query(sql, [teamId, eventId]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(results[0]);
    } catch (err) {
        console.error('Error fetching event details:', err);
        res.status(500).json({ message: 'Error fetching event details' });
    }
});

router.post('/:teamId', verifyTeamAccess, verifyEditorOrLeaderAccess, async (req, res) => {
    const { teamId } = req.params;
    const { name, notes, event_date, event_time } = req.body;

    if (!name || !event_date || !event_time) {
        return res.status(400).json({ message: 'Name, date, and time are required' });
    }

    const sql = `
        INSERT INTO events (team_id, name, notes, event_date, event_time) 
        VALUES (?, ?, ?, ?, ?)
    `;
    try {
        const [results] = await db.query(sql, [teamId, name, notes, event_date, event_time]);
        res.json({ id: results.insertId, team_id: teamId, name, notes, event_date, event_time });
    } catch (err) {
        console.error('Error inserting event:', err);
        res.status(500).json({ message: 'Error inserting event' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const verifySql = 'SELECT team_id FROM events WHERE id = ?';
        const [rows] = await db.query(verifySql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        req.params.teamId = rows[0].team_id;

        verifyTeamAccess(req, res, async () => {
            verifyEditorOrLeaderAccess(req, res, async () => {
                const { name, notes, event_date, event_time } = req.body;
                const fieldsToUpdate = [];
                const values = [];

                if (name) fieldsToUpdate.push('name = ?'), values.push(name);
                if (notes) fieldsToUpdate.push('notes = ?'), values.push(notes);
                if (event_date) fieldsToUpdate.push('event_date = ?'), values.push(event_date);
                if (event_time) fieldsToUpdate.push('event_time = ?'), values.push(event_time);

                if (fieldsToUpdate.length === 0) {
                    return res.status(400).json({ message: 'No fields to update' });
                }

                const updateSql = `UPDATE events SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
                values.push(id);

                await db.query(updateSql, values);
                res.json({ message: 'Event updated successfully' });
            });
        });
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({ message: 'Error updating event' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const verifySql = 'SELECT team_id FROM events WHERE id = ?';
        const [rows] = await db.query(verifySql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        req.params.teamId = rows[0].team_id;

        verifyTeamAccess(req, res, async () => {
            verifyEditorOrLeaderAccess(req, res, async () => {
                const deleteSql = 'DELETE FROM events WHERE id = ?';
                await db.query(deleteSql, [id]);
                res.json({ message: 'Event deleted successfully' });
            });
        });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ message: 'Error deleting event' });
    }
});

router.get('/:teamId/:eventId/songs', verifyTeamAccess, async (req, res) => {
    const { teamId, eventId } = req.params;

    try {
        const query = `
            SELECT songs.id, songs.name 
            FROM event_tracks
            JOIN songs ON event_tracks.song_id = songs.id
            WHERE event_tracks.event_id = ? AND songs.team_id = ?
        `;

        const [songs] = await db.execute(query, [eventId, teamId]);

        return res.status(200).json(songs);
    } catch (error) {
        console.error('Error fetching songs for event:', error.message);
        return res.status(500).json({ message: 'Failed to fetch songs for event' });
    }
});

router.post('/events/:teamId/:eventId/songs', verifyTeamAccess, verifyEditorOrLeaderAccess, async (req, res) => {
    const { eventId } = req.params;
    const { songId } = req.body;

    if (!songId) {
        return res.status(400).json({ message: 'Song ID is required' });
    }

    try {
        const query = `INSERT INTO event_tracks (event_id, song_id) VALUES (?, ?)`;
        await db.execute(query, [eventId, songId]);

        return res.status(201).json({ message: 'Song added to event successfully' });
    } catch (error) {
        console.error('Error adding song to event:', error.message);
        return res.status(500).json({ message: 'Failed to add song to event' });
    }
});

router.delete('/:teamId/:eventId/songs/:songId', verifyTeamAccess, verifyEditorOrLeaderAccess, async (req, res) => {
    const { eventId, songId } = req.params;

    try {
        const query = `DELETE FROM event_tracks WHERE event_id = ? AND song_id = ?`;
        await db.execute(query, [eventId, songId]);

        return res.status(200).json({ message: 'Song removed from event successfully' });
    } catch (error) {
        console.error('Error removing song from event:', error.message);
        return res.status(500).json({ message: 'Failed to remove song from event' });
    }
});

module.exports = router;