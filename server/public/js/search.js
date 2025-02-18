document.addEventListener("DOMContentLoaded", function () {
  const searchBar = document.getElementById("search-bar");

  searchBar.addEventListener("input", function () {
      const query = searchBar.value.toLowerCase();

      // Get all audio elements inside both sections
      const allMusicItems = document.querySelectorAll("#local-music div, #external-music div");

      allMusicItems.forEach(item => {
          const songName = item.querySelector("p").textContent.toLowerCase();
          // Show only if it matches the search query
          item.style.display = songName.includes(query) ? "block" : "none";
      });
  });
});