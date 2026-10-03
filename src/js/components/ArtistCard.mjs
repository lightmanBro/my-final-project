/**
 * Artist Card Component
 * Displays featured artists with followers and direct profile navigation
 */

export function renderArtistCard(artist) {
  const card = document.createElement("a");
  card.href = `/artist/index.html?name=${encodeURIComponent(artist.name)}&id=${encodeURIComponent(artist.id)}`;
  card.className = "artist-card";
  card.dataset.artistId = artist.id;

  card.innerHTML = `
    <div class="artist-avatar-wrap">
      <img src="${artist.image}" alt="${artist.name}" class="artist-avatar-img" loading="lazy" />
    </div>
    <div class="artist-name">${artist.name}</div>
    <div class="artist-genre">${artist.genre}</div>
    <div class="artist-listeners">
      <span style="color: var(--accent-cyan); font-weight: 600;">●</span> ${artist.monthlyListeners || "Top Chart"}
    </div>
  `;

  return card;
}
