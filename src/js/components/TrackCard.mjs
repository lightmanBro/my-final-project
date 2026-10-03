/**
 * Track Card Component
 * Renders modern interactive track card with audio preview trigger
 */

export function renderTrackCard(track, isCurrentlyPlaying = false) {
  const card = document.createElement("div");
  card.className = `track-card ${isCurrentlyPlaying ? "is-playing" : ""}`;
  card.dataset.trackId = track.id;
  card.dataset.trackJson = JSON.stringify(track);

  card.innerHTML = `
    <div class="track-cover-wrap">
      <img src="${track.cover}" alt="${track.title}" class="track-cover-img" loading="lazy" />
      <div class="play-overlay-btn" title="Play 30s Audio Preview">
        ${
          isCurrentlyPlaying
            ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
            : `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`
        }
      </div>
    </div>
    <div class="track-info">
      <div class="track-name" title="${track.title}">${track.title}</div>
      <a href="/artist/index.html?name=${encodeURIComponent(track.artist)}" class="track-artist" title="View Artist Profile" onclick="event.stopPropagation()">
        ${track.artist}
      </a>
      <div class="track-meta-row">
        <span class="genre-tag">${track.genre || "Music"}</span>
        <span class="track-duration">${track.duration || "3:00"}</span>
        ${
          isCurrentlyPlaying
            ? `
          <div class="visualizer-bars">
            <div class="visualizer-bar"></div>
            <div class="visualizer-bar"></div>
            <div class="visualizer-bar"></div>
            <div class="visualizer-bar"></div>
          </div>
        `
            : ""
        }
      </div>
    </div>
  `;

  return card;
}
