const db = require('../../db');

const verifyEditorOrLeaderAccess = async (req, res, next) => {
    const userId = req.user.id;
    const teamId = req.params.teamId || req.params.id;

    const sql = `
      SELECT COUNT(*) AS count
      FROM team_members
      WHERE user_id = ? AND team_id = ? AND role_id IN (1, 2)
    `;

    try {
        const [results] = await db.query(sql, [userId, teamId]);
        if (results[0].count === 0) {
            return res.status(403).json({ message: 'Access denied. Only Leader and Editor can perform this action.' });
        }
        next();
    } catch (err) {
        console.error('Error verifying Editor or Leader access:', err);
        res.status(500).json({ message: 'Error verifying access rights' });
    }
};

module.exports = verifyEditorOrLeaderAccess;