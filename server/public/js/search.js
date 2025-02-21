document.addEventListener("DOMContentLoaded", function () {
    const searchBar = document.getElementById("search-bar");
    const musicList = document.getElementById("music-list");

    let allSongs = []; // Global array to store songs

    async function fetchMusic() {
      try {
        const response = await fetch('/api/music');
        const data = await response.json();

        // Combine local and external songs into one list
        allSongs = [
          ...data.local.map(file => ({ name: file.split('/').pop(), url: file })),
          ...data.external.map(file => ({ name: file.split('/').pop(), url: file }))
        ];

        // Do NOT call displayMusic here, so no songs are shown on page load.
      } catch (error) {
        console.error("Error fetching music:", error);
        musicList.innerHTML = "<li>Error loading music.</li>";
      }
    }

    function displayMusic(songs) {
      musicList.innerHTML = ""; // Clear previous results

      if (songs.length === 0) {
        musicList.innerHTML = "<li>No results found</li>";
        return;
      }

      songs.forEach(song => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<p>${song.name}</p><audio controls src="${song.url}"></audio>`;
        // Add double-click event to trigger album art display (if needed)
        listItem.addEventListener("dblclick", () => {
          const event = new CustomEvent("songSelected", { detail: song });
          document.dispatchEvent(event);
        });
        musicList.appendChild(listItem);
      });
    }

    searchBar.addEventListener("input", function () {
      const query = searchBar.value.toLowerCase().trim();
      if (query === "") {
        // If search bar is empty, clear the music list
        musicList.innerHTML = "";
      } else {
        const filteredSongs = allSongs.filter(song => song.name.toLowerCase().includes(query));
        displayMusic(filteredSongs);
      }
    });

    fetchMusic();
});
