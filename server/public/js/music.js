async function loadMusic() {
    try {
      const response = await fetch('/api/music'); // Fetch music list from backend
      const data = await response.json();
  
      const localList = document.getElementById('local-music');
      const externalList = document.getElementById('external-music');
  
      localList.innerHTML = "<h3>Local Music</h3>";
      externalList.innerHTML = "<h3>External Drive Music</h3>";
  
      // Function to create audio elements
      const addMusicItem = (list, url, name) => {
        const item = document.createElement('div');
        item.innerHTML = `<p>${name}</p><audio controls src="${url}"></audio>`;
        list.appendChild(item);
      };
  
      // Add local files
      data.local.forEach(file => addMusicItem(localList, file, file.split('/').pop()));
  
      // Add external files
      data.external.forEach(file => addMusicItem(externalList, file, file.split('/').pop()));
    } catch (error) {
      console.error("Error loading music:", error);
    }
  }
  
  // Run the function when the page loads
  window.addEventListener("DOMContentLoaded", loadMusic);
  