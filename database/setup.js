const sqlite3 = require('sqlite3').verbose();

// Connect to the database (creates 'users.db' if it doesn't exist)
const db = new sqlite3.Database('./database/users.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create the users table (if it doesn't exist)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
  )`);

  // Insert default users if they don't exist
  db.get("SELECT * FROM users WHERE username = 'master'", (err, row) => {
    if (!row) {
      const bcrypt = require('bcryptjs');
      const hashedMasterPassword = bcrypt.hashSync('password123', 10);
      const hashedGuestPassword = bcrypt.hashSync('guestpassword', 10);

      db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ['master', hashedMasterPassword, 'master']);
      db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ['guest', hashedGuestPassword, 'guest']);
      console.log('Default users added.');
    }
  });
});

// Close the connection
db.close();
