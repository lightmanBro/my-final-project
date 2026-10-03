/**
 * Artist Profile Controller
 * Loads selected artist's data from live API or fallback dataset
 */

import { getArtistDetails } from "./api/musicApi.mjs";
import { renderTrackCard } from "./components/TrackCard.mjs";
import { audioPlayer } from "./components/AudioPlayer.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Initialize player
  audioPlayer.init();

  // 2. Parse URL Params
  const params = new URLSearchParams(window.location.search);
  const artistNameOrId = params.get("name") || params.get("id") || "Burna Boy";

  // 3. Load & Render Artist Data
  await loadArtistPage(artistNameOrId);
});

async function loadArtistPage(artistIdentifier) {
  try {
    const { artist, tracks, upcomingConcerts } = await getArtistDetails(artistIdentifier);

    if (!artist) return;

    // Set page title
    document.title = `${artist.name} — SoundWave Discovery | WDD 330`;

    // Populate Hero
    const heroElem = document.getElementById("artistHero");
    const avatarElem = document.getElementById("artistAvatar");
    const nameElem = document.getElementById("artistName");
    const genreElem = document.getElementById("artistGenre");
    const listenersElem = document.getElementById("artistListeners");
    const followersElem = document.getElementById("artistFollowers");
    const bioElem = document.getElementById("artistBio");
    const lyricsElem = document.getElementById("artistLyrics");
    const concertsContainer = document.getElementById("concertsList");
    const tracksContainer = document.getElementById("artistTracksContainer");

    if (heroElem && artist.banner) {
      heroElem.style.backgroundImage = `linear-gradient(180deg, rgba(16, 21, 34, 0.4) 0%, rgba(10, 13, 20, 0.95) 100%), url('${artist.banner}')`;
    }
    if (avatarElem) avatarElem.src = artist.image || avatarElem.src;
    if (nameElem) nameElem.textContent = artist.name;
    if (genreElem) genreElem.textContent = artist.genre || "Global Artist";
    if (listenersElem) listenersElem.textContent = `${artist.monthlyListeners || "Top Chart"} Listeners`;
    if (followersElem) followersElem.textContent = `${artist.followers || "Verified"} Followers`;
    if (bioElem) bioElem.textContent = artist.bio || `${artist.name} is a global artist with multi-million streaming hits across streaming platforms.`;

    // Render Tracks
    if (tracksContainer) {
      tracksContainer.innerHTML = "";
      if (tracks.length === 0) {
        tracksContainer.innerHTML = `<p style="color: var(--text-muted);">No preview tracks found for this artist.</p>`;
      } else {
        tracks.forEach(trk => {
          tracksContainer.appendChild(renderTrackCard(trk, false));
        });

        // Set default lyric preview to first track
        if (lyricsElem && tracks[0].lyricsPreview) {
          lyricsElem.textContent = `"${tracks[0].lyricsPreview}"`;
        }
      }
    }

    // Render Concerts
    if (concertsContainer) {
      concertsContainer.innerHTML = "";
      (upcomingConcerts || []).forEach(c => {
        const item = document.createElement("div");
        item.className = "concert-item";
        item.innerHTML = `
          <div>
            <strong style="color: var(--text-main); font-size: 0.88rem; display: block;">${c.city}</strong>
            <span style="color: var(--text-dim); font-size: 0.76rem;">${c.venue} • ${c.date}</span>
          </div>
          <span style="font-size: 0.74rem; font-weight: 700; color: ${c.ticketStatus === 'Sold Out' ? '#ff5555' : 'var(--accent-green)'};">
            ${c.ticketStatus}
          </span>
        `;
        concertsContainer.appendChild(item);
      });
    }

  } catch (err) {
    console.error("Failed to load artist profile:", err);
  }
}
