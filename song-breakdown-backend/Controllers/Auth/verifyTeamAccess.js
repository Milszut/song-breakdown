const db = require('../../db');

const verifyTeamAccess = async (req, res, next) => {
    const userId = req.user?.id;
    const teamId = req.params.teamId || req.params.id;

    if (!teamId) {
        console.error("Team ID is missing");
        return res.status(400).json({ message: 'Team ID is required' });
    }

    const sql = `
        SELECT COUNT(*) AS count
        FROM team_members
        WHERE user_id = ? AND team_id = ?
    `;

    try {
        const [results] = await db.query(sql, [userId, teamId]);

        if (results[0]?.count === 0) {
            console.error("Access denied to this team");
            return res.status(403).json({ message: "You don't have access to this team" });
        }

        next();
    } catch (err) {
        console.error('Error verifying team access:', err);
        res.status(500).json({ message: 'Error verifying team access' });
    }
};

module.exports = verifyTeamAccess;