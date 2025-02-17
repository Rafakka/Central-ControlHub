const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

// Set up session middleware for user authentication
app.use(session({
  secret: 'secret-key',  // Replace with a secure key in production
  resave: false,
  saveUninitialized: true,
}));

// Middleware for JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, images, etc.) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Dummy database to hold user data (you can use a real DB later)
const users = {
  master: {
    username: 'master',
    password: '$2a$10$wHXJlhtZ4U0LOiwKNu17M.J3/ZHgDfpvMKFqB9muhwVFSdMiDd2ha', // 'password123' hashed
    role: 'master',
  },
  guest: {
    username: 'guest',
    password: '$2a$10$hC.IpG7TbcpZlSZCZ9dVSeLhUjLsR4C6vSyHDP.oDtXqXg/c7uDHC', // 'guestpassword' hashed
    role: 'guest',
  },
};

// Middleware to check if the user is authenticated and authorized
function isAuthenticated(role) {
  return (req, res, next) => {
    if (req.session.user && req.session.user.role === role) {
      return next();
    }
    return res.status(401).send('Unauthorized');
  };
}

// Serve the login page (it will now be 'index.html')
app.get('/', (req, res) => {
  // If the user is authenticated (if there's a session), serve the dashboard page
  if (req.session.user) {
    return res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
  }
  // If no session, show the login page
  return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login route
app.post('/index', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = user; // Save user in session
    return res.redirect('/dashboard'); // Redirect to home page (dashboard.html)
  } else {
    return res.status(401).send('Invalid credentials');
  }
});

// Logout route
app.get('/index', (req, res) => {
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

// Serve the login page (simple login form)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
