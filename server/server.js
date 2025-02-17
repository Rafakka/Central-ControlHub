const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files (HTML, CSS, JS, images, etc.) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up a basic route to check if the server is working
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware for JSON parsing
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Control routes (example for AC and Lamp)
app.post('/control/ac', (req, res) => {
  // Here, you'd actually send a command to your smart device (e.g., AC)
  const { action } = req.body;
  if (action === 'toggle') {
    res.json({ message: 'AC toggled successfully' });
  }
});

app.post('/control/lamp', (req, res) => {
  // Send command to toggle the lamp
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
