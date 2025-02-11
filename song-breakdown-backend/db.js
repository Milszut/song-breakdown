const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'song_breakdown',
  waitForConnections: true,
  queueLimit: 0,
});

module.exports = connection;