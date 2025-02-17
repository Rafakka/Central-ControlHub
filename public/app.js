// app.js

// Mocking smart device control for demonstration
document.getElementById('ac-toggle').addEventListener('click', () => {
    // Example: Send request to Node.js backend to turn AC on/off
    fetch('/control/ac', {
      method: 'POST',
      body: JSON.stringify({ action: 'toggle' }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => alert(data.message));
  });
  
  document.getElementById('lamp-toggle').addEventListener('click', () => {
    // Example: Send request to Node.js backend to turn Lamp on/off
    fetch('/control/lamp', {
      method: 'POST',
      body: JSON.stringify({ action: 'toggle' }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => alert(data.message));
  });
  
  // Post new content to the local board
  document.getElementById('submit-post').addEventListener('click', () => {
    const postContent = document.getElementById('new-post').value;
  
    if (postContent.trim()) {
      fetch('/board/post', {
        method: 'POST',
        body: JSON.stringify({ content: postContent }),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => response.json())
      .then(data => {
        // Update the board with new post
        const postList = document.getElementById('post-list');
        postList.innerHTML = `<p>${data.content}</p>` + postList.innerHTML;
      });
    }
  });
  