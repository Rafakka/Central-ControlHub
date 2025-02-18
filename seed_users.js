const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// Connect to the database
const db = new sqlite3.Database('./database/users.db');

// Hash the passwords
const masterPassword = bcrypt.hashSync('masterpassword', 10);
const guestPassword = bcrypt.hashSync('guestpassword', 10);

// Insert users into the database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)`);
  
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ['master', masterPassword], (err) => {
    if (err) {
      console.log('Master user already exists or error occurred:', err.message);
    } else {
      console.log('Master user inserted successfully.');
    }
  });

  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ['guest', guestPassword], (err) => {
    if (err) {
      console.log('Guest user already exists or error occurred:', err.message);
    } else {
      console.log('Guest user inserted successfully.');
    }
  });

  db.close();
});