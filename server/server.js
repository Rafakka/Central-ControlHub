const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// Require our database module
const db = require('./db');

const app = express();
const port = 3000;

// Set up session middleware for user authentication
app.use(session({
  secret: 'secret-key',  // Replace with a secure key in production
  resave: false,
  saveUninitialized: true,
}));

// Middleware for JSON parsing and URL encoding
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to check if the user is authenticated and authorized
function isAuthenticated(role) {
  return (req, res, next) => {
    if (req.session.user && req.session.user.role === role) {
      return next();
    }
    return res.status(401).send('Unauthorized');
  };
}

// Root route: If logged in, serve the dashboard page; otherwise, serve the login page
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.sendFile(path.join(__dirname, 'public', 'dashb.html'));
  }
  return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login route (POST): Validate credentials and set session
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Query the database for the user
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).send('Internal server error');
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Compare the provided password with the stored hash
    const valid = bcrypt.compareSync(password, user.password);
    if (valid) {
      req.session.user = { id: user.id, username: user.username, role: user.role };
      return res.redirect('/');
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// Logout route: Destroy the session and redirect to login
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Guestbook route (accessible by both master and guest)
app.post('/board/post', isAuthenticated('guest'), (req, res) => {
  const { content } = req.body;
  // Save post to a local store or file (for simplicity, we send back the same content)
  res.json({ content: content });
});

// Control routes (only accessible by the master)
app.post('/control/ac', isAuthenticated('master'), (req, res) => {
  const { action } = req.body;
  if (action === 'toggle') {
    res.json({ message: 'AC toggled successfully' });
  }
});

app.post('/control/lamp', isAuthenticated('master'), (req, res) => {
  const { action } = req.body;
  if (action === 'toggle') {
    res.json({ message: 'Lamp toggled successfully' });
  }
});

// Serve the dashboard page (optional route)
app.get('/dashb', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'public', 'dashb.html'));
  } else {
    res.redirect('/');
  }
});

// Define media folders (inside the public folder)
const musicFolder = path.join(__dirname, 'public', 'music');
const videoFolder = path.join(__dirname, 'public', 'videos');

// Route to list music files
app.get('/media/music', (req, res) => {
  fs.readdir(musicFolder, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read music directory' });
    }
    res.json(files);
  });
});

// Route to list video files
app.get('/media/videos', (req, res) => {
  fs.readdir(videoFolder, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read video directory' });
    }
    res.json(files);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
