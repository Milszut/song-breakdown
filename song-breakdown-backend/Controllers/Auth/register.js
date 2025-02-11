const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../../db');

router.post('/', async (req, res) => {
  const { email, password, name, lastname, question_id, answer } = req.body;

  if (!email || !password || !name || !lastname || !question_id || !answer) {
    return res.status(400).json({ error: true, message: 'All fields are required!' });
  }

  try {
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(200).json({ error: true, message: 'Account with this email already exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswer = await bcrypt.hash(answer, 10);

    await db.query(
      'INSERT INTO users (email, password, name, lastname, security_question_id, answer) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, name, lastname, question_id, hashedAnswer]
    );

    res.status(200).json({ error: false, message: 'User registered successfully!' });
  } catch (err) {
    console.error('Error during user registration:', err);
    res.status(500).json({ error: true, message: 'An unexpected error occurred during registration' });
  }
});

router.get('/security-questions', async (req, res) => {
  try {
    const [questions] = await db.query('SELECT id, question FROM security_questions');
    res.status(200).json({ error: false, questions });
  } catch (error) {
    console.error('Error fetching security questions:', error);
    res.status(500).json({ error: true, message: 'Failed to fetch security questions' });
  }
});

module.exports = router;