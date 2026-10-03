/**
 * Main Application Script — Home Dashboard
 * Omotoso David — WDD 330 Final Project
 */

import { getTrendingArtists, getRecommendations } from "./api/musicApi.mjs";
import { renderArtistCard } from "./components/ArtistCard.mjs";
import { renderTrackCard } from "./components/TrackCard.mjs";
import { audioPlayer } from "./components/AudioPlayer.mjs";
import { SearchController } from "./components/Search.mjs";
import { showToast } from "./components/Toast.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Initialize Audio Player
  audioPlayer.init();

  // 2. Initialize Search Controller
  const search = new SearchController({
    inputSelector: "#searchInput",
    clearBtnSelector: "#searchClearBtn",
    tabsSelector: ".tab-pill",
    genreChipsSelector: ".genre-chip",
    resultsContainerSelector: "#searchResultsContainer",
    feedbackSelector: "#searchFeedbackBar"
  });
  search.init();

  // 3. Load Initial Showcase Sections (Trending Artists & Recommendations)
  await loadDashboardContent();

  // 4. Setup Hero Action Play Button
  setupHeroActions();

  // 5. Setup Week 5 Scope Modal
  setupScopeModal();

  // 6. Listen for Audio Player Changes to refresh card active visualizers
  audioPlayer.onChange(({ type, track, isPlaying }) => {
    // Sync all rendered track cards
    document.querySelectorAll(".track-card").forEach(card => {
      if (card.dataset.trackId === track.id) {
        if (isPlaying) {
          card.classList.add("is-playing");
          if (!card.querySelector(".visualizer-bars")) {
            const metaRow = card.querySelector(".track-meta-row");
            if (metaRow) {
              const viz = document.createElement("div");
              viz.className = "visualizer-bars";
              viz.innerHTML = `<div class="visualizer-bar"></div><div class="visualizer-bar"></div><div class="visualizer-bar"></div><div class="visualizer-bar"></div>`;
              metaRow.appendChild(viz);
            }
          }
        } else {
          card.classList.remove("is-playing");
          const viz = card.querySelector(".visualizer-bars");
          if (viz) viz.remove();
        }
      } else {
        card.classList.remove("is-playing");
        const viz = card.querySelector(".visualizer-bars");
        if (viz) viz.remove();
      }
    });
  });
});

/**
 * Load Initial Dashboard Trending & Recommendations
 */
async function loadDashboardContent() {
  const trendingContainer = document.getElementById("trendingArtistsContainer");
  const recommendationsContainer = document.getElementById("recommendationsContainer");

  try {
    const [artists, tracks] = await Promise.all([
      getTrendingArtists(),
      getRecommendations()
    ]);

    // Render Trending Artists
    if (trendingContainer) {
      trendingContainer.innerHTML = "";
      artists.forEach(artist => {
        trendingContainer.appendChild(renderArtistCard(artist));
      });
    }

    // Render Recommendations
    if (recommendationsContainer) {
      recommendationsContainer.innerHTML = "";
      tracks.forEach(track => {
        recommendationsContainer.appendChild(renderTrackCard(track, false));
      });
    }
  } catch (error) {
    console.error("Error loading dashboard content:", error);
  }
}

/**
 * Setup Hero Play Button
 */
function setupHeroActions() {
  const heroBtn = document.getElementById("heroPlayBtn");
  if (!heroBtn) return;

  heroBtn.addEventListener("click", async () => {
    const tracks = await getRecommendations();
    if (tracks && tracks.length > 0) {
      const spotlightTrack = tracks[0];
      audioPlayer.playTrack(spotlightTrack);
    }
  });
}

/**
 * Setup Week 5 Scope Modal Trigger & Dismissal
 */
function setupScopeModal() {
  const openBtn = document.getElementById("openScopeBtn");
  const modal = document.getElementById("scopeModal");
  const closeBtn1 = document.getElementById("closeScopeModalBtn");
  const closeBtn2 = document.getElementById("closeScopeModalBtn2");

  if (!modal) return;

  const openModal = () => modal.classList.add("is-open");
  const closeModal = () => modal.classList.remove("is-open");

  if (openBtn) openBtn.addEventListener("click", openModal);
  if (closeBtn1) closeBtn1.addEventListener("click", closeModal);
  if (closeBtn2) closeBtn2.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}
