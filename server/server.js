const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Middleware for JSON parsing
app.use(express.json());

// Serve static files (HTML, CSS, JS, images, etc.) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up a basic route to check if the server is working
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve files from the assets directory
app.get('/files/:type/:filename', (req, res) => {
  const { type, filename } = req.params;
  const filePath = path.join(__dirname, 'assets', type, filename);
  res.sendFile(filePath);
});

// Control routes (example for AC and Lamp)
app.post('/control/ac', (req, res) => {
  const { action } = req.body;
  if (action === 'toggle') {
    res.json({ message: 'AC toggled successfully' });
  }
});

app.post('/control/lamp', (req, res) => {
  const { action } = req.body;
  if (action === 'toggle') {
    res.json({ message: 'Lamp toggled successfully' });
  }
});

// Local board post route
app.post('/board/post', (req, res) => {
  const { content } = req.body;
  // Save post to a local store or file (for simplicity, we send back the same content)
  res.json({ content: content });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
