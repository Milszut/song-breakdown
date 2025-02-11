const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyTeamAccess = require('./Auth/verifyTeamAccess');
const verifyLeaderAccess = require('./Auth/verifyLeaderAccess');

router.get('/roles', async (req, res) => {
    const sql = 'SELECT id, name FROM roles';

    try {
        const [results] = await db.query(sql);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Failed to fetch roles' });
    }
});

router.get('/:id', verifyTeamAccess, async (req, res) => {
    const teamId = req.params.id;
    const sql = 'SELECT * FROM teams WHERE id = ?';

    try {
        const [results] = await db.query(sql, [teamId]);
        
        if (results.length === 0) {
            return res.status(404).send('Team not found');
        }

        res.json(results[0]);
    } catch (err) {
        console.error('Error fetching team details:', err);
        res.status(500).json({ message: 'Error fetching team details' });
    }
});

router.get('/:id/members', verifyTeamAccess, async (req, res) => {
    const teamId = req.params.id;
    const userId = req.user.id;

    const sql = `
        SELECT 
            u.id, 
            u.name, 
            u.lastname, 
            u.email, 
            r.id AS role_id,
            r.name AS role_name
        FROM 
            team_members tm
        JOIN 
            users u ON tm.user_id = u.id
        JOIN 
            roles r ON tm.role_id = r.id
        WHERE 
            tm.team_id = ?
    `;

    const userRoleSql = `
        SELECT 
            r.id AS role_id,
            r.name AS role_name
        FROM 
            team_members tm
        JOIN 
            roles r ON tm.role_id = r.id
        WHERE 
            tm.team_id = ? AND tm.user_id = ?
    `;

    try {
        const [results] = await db.query(sql, [teamId]);

        const [userRoleResult] = await db.query(userRoleSql, [teamId, userId]);
        const userRole = userRoleResult.length > 0 ? userRoleResult[0] : null;

        res.json({
            members: results,
            userRole: userRole
        });
    } catch (error) {
        console.error('Error fetching team members:', error);
        res.status(500).json({ message: 'Failed to fetch team members' });
    }
});

router.put('/:id/name', verifyTeamAccess, verifyLeaderAccess, async (req, res) => {
    const teamId = req.params.id;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    const sql = `
        UPDATE teams
        SET name = ?
        WHERE id = ?
    `;

    try {
        const [results] = await db.query(sql, [name, teamId]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.status(200).json({ message: 'Team name updated successfully' });
    } catch (error) {
        console.error('Error updating team name:', error);
        res.status(500).json({ message: 'Failed to update team name' });
    }
});

router.put('/:id/description', verifyTeamAccess, verifyLeaderAccess, async (req, res) => {
    const teamId = req.params.id;
    const { description } = req.body;

    if (!description) {
        return res.status(400).json({ message: 'Description is required' });
    }

    const sql = `
        UPDATE teams
        SET description = ?
        WHERE id = ?
    `;

    try {
        const [results] = await db.query(sql, [description, teamId]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.status(200).json({ message: 'Team description updated successfully' });
    } catch (error) {
        console.error('Error updating team description:', error);
        res.status(500).json({ message: 'Failed to update team description' });
    }
});

router.delete('/:id', verifyTeamAccess, verifyLeaderAccess, async (req, res) => {
    const teamId = req.params.id;

    const sql = `
        DELETE FROM teams
        WHERE id = ?
    `;

    try {
        const [results] = await db.query(sql, [teamId]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.status(200).json({ message: 'Team deleted successfully' });
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ message: 'Failed to delete team' });
    }
});

router.post('/:id/invite', verifyTeamAccess, verifyLeaderAccess, async (req, res) => {
    const teamId = req.params.id;
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const userQuery = `SELECT id FROM users WHERE email = ?`;
        const [userResults] = await db.query(userQuery, [email]);

        if (userResults.length === 0) {
            return res.status(404).json({ message: 'User with this email does not exist!' });
        }

        const userId = userResults[0].id;

        const memberQuery = `SELECT COUNT(*) AS count FROM team_members WHERE user_id = ? AND team_id = ?`;
        const [memberResults] = await db.query(memberQuery, [userId, teamId]);

        if (memberResults[0].count > 0) {
            return res.status(400).json({ message: 'User is already a member of this team!' });
        }

        const invitationQuery = `SELECT COUNT(*) AS count FROM invitations WHERE user_id = ? AND team_id = ? AND status_id = 1`;
        const [invitationResults] = await db.query(invitationQuery, [userId, teamId]);

        if (invitationResults[0].count > 0) {
            return res.status(400).json({ message: 'User already invited to this team!' });
        }

        const insertQuery = `INSERT INTO invitations (user_id, team_id, status_id, invitation_date) VALUES (?, ?, 1, NOW())`;
        await db.query(insertQuery, [userId, teamId]);

        res.status(200).json({ message: 'Invitation sent successfully!' });
    } catch (error) {
        console.error('Error sending invitation:', error);
        res.status(500).json({ message: 'Failed to send invitation' });
    }
});

router.put('/:teamId/members/:userId/role', verifyTeamAccess, verifyLeaderAccess, async (req, res) => {
    const { teamId, userId } = req.params;
    const { role_id } = req.body;

    if (!role_id) {
        return res.status(400).json({ message: 'Role ID is required' });
    }

    const sql = `
        UPDATE team_members
        SET role_id = ?
        WHERE team_id = ? AND user_id = ?
    `;

    try {
        const [result] = await db.query(sql, [role_id, teamId, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User or team not found' });
        }

        console.log(`Role updated for user ${userId} in team ${teamId}`);
        res.status(200).json({ message: 'Role updated successfully' });
    } catch (err) {
        console.error('Error updating role:', err);
        res.status(500).json({ message: 'Failed to update role' });
    }
});

router.delete('/:teamId/members/:userId', verifyTeamAccess, verifyLeaderAccess, async (req, res) => {
    const { teamId, userId } = req.params;

    const sql = `
        DELETE FROM team_members
        WHERE team_id = ? AND user_id = ?
    `;

    try {
        const [results] = await db.query(sql, [teamId, userId]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found in the team' });
        }
        res.status(200).json({ message: 'User removed from the team successfully' });
    } catch (error) {
        console.error('Error removing user from team:', error);
        res.status(500).json({ message: 'Failed to remove user from the team' });
    }
});

router.delete('/:teamId/leave', async (req, res) => {
    const { teamId } = req.params;
    const userId = req.user.id;

    const sql = `
        DELETE FROM team_members
        WHERE team_id = ? AND user_id = ?
    `;

    try {
        const [results] = await db.query(sql, [teamId, userId]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found in the team' });
        }
        res.status(200).json({ message: 'User successfully left the team' });
    } catch (error) {
        console.error('Error leaving team:', error);
        res.status(500).json({ message: 'Failed to leave the team' });
    }
});

router.get('/:id/invitations', verifyTeamAccess, async (req, res) => {
    const teamId = req.params.id;

    const sql = `
        SELECT 
            i.id AS invitation_id,
            u.email, 
            DATE_FORMAT(i.invitation_date, '%d-%m-%Y') AS invitation_date, 
            s.status_name 
        FROM invitations i
        JOIN users u ON i.user_id = u.id
        JOIN invitation_statuses s ON i.status_id = s.id
        WHERE i.team_id = ?
    `;

    try {
        const [results] = await db.query(sql, [teamId]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching invitations:', error);
        res.status(500).json({ message: 'Error fetching invitations' });
    }
});

module.exports = router;