const db = require('./db');
const { validationResult } = require('express-validator');

exports.authenticateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const sql = `SELECT id, name, username FROM user WHERE username = ? AND password = ?`;
    const result = await query(sql, [username, password]);

    if (result.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    req.session.user = result[0]; // Store user data in session
    res.status(200).json(result[0]);
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, username, password } = req.body;

    // Check if username already exists
    const checkUserSql = `SELECT * FROM user WHERE username = ?`;
    const checkResult = await query(checkUserSql, [username]);

    if (checkResult.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // If username does not exist, insert the new user
    const createUserSql = `INSERT INTO user (name, username, password) VALUES (?, ?, ?)`;
    await query(createUserSql, [name, username, password]);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const sql = `SELECT id, name, username FROM user`;
    const result = await query(sql);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//to convert the sql query into async/await
function query(sql, values) {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
