const express = require('express');
const fs = require('fs');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

const musicFolder = '/mnt/external_hd/music'; // Update this path

// Serve static audio files
app.use('/music', express.static(musicFolder));

// API route to list all music files
app.get('/api/music', (req, res) => {
  fs.readdir(musicFolder, (err, files) => {
    if (err) {
      console.error('Error reading music directory:', err);
      return res.status(500).json({ error: 'Unable to read music directory' });
    }

    // Filter for only audio files (MP3, WAV, OGG)
    const audioFiles = files.filter(file => /\.(mp3|wav|ogg)$/i.test(file));

    // Send file names as JSON
    res.json(audioFiles);
  });
});

// Connect to SQLite
const db = new sqlite3.Database('./database/users.db');

// Route: Home Page (Serve login page)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route: Login API
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    if (bcrypt.compareSync(password, user.password)) {
      req.session.user = { username: user.username, role: user.role };
      return res.json({ message: `Welcome, ${user.username}!`, redirect: '/dashboard' });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// Route: Dashboard Page (Protected)
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'public', 'dashb.html'));
});

// Route: Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.post('/control/ac', (req, res) => {
  console.log("AC toggled!");
  res.json({ message: "AC turned on/off" });
});

app.post('/control/lamp', (req, res) => {
  console.log("Lamp toggled!");
  res.json({ message: "Lamp turned on/off" });
});

app.post('/board/post', async (req, res) => {
  const { content } = req.body;
  if (!content.trim()) return res.status(400).json({ error: "Post cannot be empty" });

  // Save to database (assuming an SQLite 'posts' table exists)
  try {
    await db.run("INSERT INTO posts (content) VALUES (?)", [content]);
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get('/board/posts', async (req, res) => {
  try {
    const posts = await db.all("SELECT content FROM posts ORDER BY id DESC");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
