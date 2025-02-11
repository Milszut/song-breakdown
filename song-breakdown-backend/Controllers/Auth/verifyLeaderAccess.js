const db = require('../../db');

const verifyLeaderAccess = async (req, res, next) => {
    const userId = req.user.id;
    const teamId = req.params.teamId || req.params.id;
  
    const sql = `
      SELECT COUNT(*) AS count
      FROM team_members
      WHERE user_id = ? AND team_id = ? AND role_id = 1
    `;
  
    try {
      const [results] = await db.query(sql, [userId, teamId]);
      if (results[0].count === 0) {
        return res.status(403).json({ message: 'Access denied. Only Leader can perform this action.' });
      }
      next();
    } catch (err) {
      console.error('Error verifying Leader access:', err);
      res.status(500).json({ message: 'Error verifying Leader access' });
    }
  };
  
  module.exports = verifyLeaderAccess;