document.addEventListener("DOMContentLoaded", function () {
    const albumArtOverlay = document.getElementById("album-art-overlay");
    const albumArtImg = document.getElementById("album-art-img");
    const transparencyBar = document.getElementById("transparency-bar");

    let fixed = false; // Indicates if the album art is fixed (double-clicked)

    // Listen for the custom 'songSelected' event fired by search.js
    document.addEventListener("songSelected", (e) => {
        const song = e.detail;
        // For demo purposes, we'll assume album art URL is derived from the song name.
        // In a real app, you might store album art metadata.
        albumArtImg.src = `images/${song.name}.jpg`; // e.g., if song is "track1.mp3", look for "track1.mp3.jpg"
        albumArtOverlay.classList.remove("hidden");
    });

    // Clicking the transparency bar toggles fixed state
    transparencyBar.addEventListener("dblclick", function () {
        fixed = !fixed;
        // If fixed, keep the album art visible, else hide it
        if (!fixed) {
            albumArtOverlay.classList.add("hidden");
        }
    });

    // Optionally, clicking outside the album art (overlay background) hides it if not fixed
    albumArtOverlay.addEventListener("click", function (e) {
        if (!fixed && e.target === albumArtOverlay) {
            albumArtOverlay.classList.add("hidden");
        }
    });
});