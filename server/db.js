// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Open (or create) the database file (here we use 'users.db' in the current folder)
const db = new sqlite3.Database(path.join(__dirname, 'users.db'), (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Database opened successfully');
  }
});

// Create the users table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table', err);
    } else {
      console.log('Users table ensured.');
    }
  });

  // Optionally, seed the table with default master and guest users
  // We'll use bcrypt to hash the passwords
  const bcrypt = require('bcryptjs');
  const masterPassword = bcrypt.hashSync('password123', 10);
  const guestPassword = bcrypt.hashSync('guestpassword', 10);

  // Insert master user (if not exists)
  db.run(
    `INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`,
    ['master', masterPassword, 'master']
  );
  // Insert guest user (if not exists)
  db.run(
    `INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`,
    ['guest', guestPassword, 'guest']
  );
});

module.exports = db;
