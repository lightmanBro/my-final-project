/**
 * Search Controller & Component
 * Handles live debounced search, category pills, genre tags, and view updates
 */

import { searchMusic } from "../api/musicApi.mjs";
import { renderTrackCard } from "./TrackCard.mjs";
import { renderArtistCard } from "./ArtistCard.mjs";
import { audioPlayer } from "./AudioPlayer.mjs";

export class SearchController {
  constructor({
    inputSelector = "#searchInput",
    clearBtnSelector = "#searchClearBtn",
    tabsSelector = ".tab-pill",
    genreChipsSelector = ".genre-chip",
    resultsContainerSelector = "#searchResultsContainer",
    feedbackSelector = "#searchFeedbackBar"
  } = {}) {
    this.input = document.querySelector(inputSelector);
    this.clearBtn = document.querySelector(clearBtnSelector);
    this.tabs = document.querySelectorAll(tabsSelector);
    this.genreChips = document.querySelectorAll(genreChipsSelector);
    this.resultsContainer = document.querySelector(resultsContainerSelector);
    this.feedbackBar = document.querySelector(feedbackSelector);

    this.currentQuery = "";
    this.activeType = "all"; // 'all', 'song', 'artist'
    this.activeGenre = null;
    this.debounceTimer = null;
    this.isSearching = false;
  }

  init() {
    if (!this.input) return;

    // Listen to typing
    this.input.addEventListener("input", (e) => {
      const val = e.target.value;
      if (this.clearBtn) {
        if (val.trim()) this.clearBtn.classList.add("visible");
        else this.clearBtn.classList.remove("visible");
      }

      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.currentQuery = val.trim();
        this.performSearch();
      }, 350);
    });

    // Clear Button
    if (this.clearBtn) {
      this.clearBtn.addEventListener("click", () => {
        this.input.value = "";
        this.clearBtn.classList.remove("visible");
        this.currentQuery = "";
        this.performSearch();
        this.input.focus();
      });
    }

    // Category Filter Tabs
    this.tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        this.tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        this.activeType = tab.dataset.type || "all";
        this.performSearch();
      });
    });

    // Genre Filter Chips
    this.genreChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const genre = chip.dataset.genre;
        if (this.activeGenre === genre) {
          chip.classList.remove("active");
          this.activeGenre = null;
        } else {
          this.genreChips.forEach((c) => c.classList.remove("active"));
          chip.classList.add("active");
          this.activeGenre = genre;
        }

        if (this.activeGenre) {
          this.input.value = this.activeGenre;
          this.currentQuery = this.activeGenre;
          if (this.clearBtn) this.clearBtn.classList.add("visible");
        }
        this.performSearch();
      });
    });
  }

  async performSearch() {
    if (!this.resultsContainer) return;

    const query = this.currentQuery;
    const type = this.activeType;

    this.showLoadingSkeleton();

    try {
      const data = await searchMusic(query, type);
      this.renderResults(data, query);
    } catch (err) {
      console.error("Search failed:", err);
      this.resultsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 2.5rem; text-align: center; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <p style="font-size: 1.1rem; color: #ff5555; margin-bottom: 0.5rem;">⚠️ Unable to retrieve results</p>
          <p style="font-size: 0.88rem;">Please check your connection or try another keyword.</p>
        </div>
      `;
    }
  }

  showLoadingSkeleton() {
    if (!this.resultsContainer) return;
    this.resultsContainer.innerHTML = Array(6)
      .fill(0)
      .map(
        () => `
        <div class="skeleton skeleton-card"></div>
      `
      )
      .join("");
  }

  renderResults(data, query) {
    if (!this.resultsContainer) return;

    const tracks = data.tracks || [];
    const artists = data.artists || [];
    const totalCount = tracks.length + artists.length;

    // Update feedback bar
    if (this.feedbackBar) {
      if (query) {
        this.feedbackBar.style.display = "flex";
        this.feedbackBar.innerHTML = `
          <span>Showing <strong>${totalCount}</strong> results for "<strong>${escapeHtml(query)}</strong>"</span>
          <span style="font-size: 0.75rem; color: var(--accent-cyan);">Live Multi-Source API</span>
        `;
      } else {
        this.feedbackBar.style.display = "flex";
        this.feedbackBar.innerHTML = `
          <span>Featured Spotlight &amp; Trending Catalogue</span>
          <span style="font-size: 0.75rem; color: var(--accent-cyan);">Ready for search</span>
        `;
      }
    }

    if (totalCount === 0) {
      this.resultsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 3rem 1.5rem; text-align: center; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
          <div style="font-size: 2.2rem; margin-bottom: 0.8rem;">🔍</div>
          <h3 style="margin-bottom: 0.4rem; color: var(--text-main);">No matches found</h3>
          <p style="font-size: 0.9rem;">We couldn't find any results for "${escapeHtml(query)}". Try searching for an artist like "Burna Boy" or "The Weeknd".</p>
        </div>
      `;
      return;
    }

    this.resultsContainer.innerHTML = "";

    // If searching for artists specifically or query has artists
    if (this.activeType === "artist" || (artists.length > 0 && this.activeType === "all" && query)) {
      const artistSection = document.createElement("div");
      artistSection.style.gridColumn = "1 / -1";
      artistSection.innerHTML = `<h3 style="font-size: 1.1rem; margin-bottom: 0.8rem; color: var(--accent-purple);">Artists (${artists.length})</h3>`;
      const artistGrid = document.createElement("div");
      artistGrid.className = "grid-artists";
      artists.slice(0, 4).forEach((art) => {
        artistGrid.appendChild(renderArtistCard(art));
      });
      artistSection.appendChild(artistGrid);
      this.resultsContainer.appendChild(artistSection);
    }

    // Render tracks
    if (this.activeType !== "artist" && tracks.length > 0) {
      if (this.activeType === "all" && query && artists.length > 0) {
        const trackTitle = document.createElement("h3");
        trackTitle.style.gridColumn = "1 / -1";
        trackTitle.style.fontSize = "1.1rem";
        trackTitle.style.marginTop = "1rem";
        trackTitle.style.marginBottom = "0.5rem";
        trackTitle.style.color = "var(--accent-cyan)";
        trackTitle.textContent = `Songs & Previews (${tracks.length})`;
        this.resultsContainer.appendChild(trackTitle);
      }

      tracks.forEach((trk) => {
        const isPlaying =
          audioPlayer.currentTrack &&
          audioPlayer.currentTrack.id === trk.id &&
          audioPlayer.isPlaying;
        this.resultsContainer.appendChild(renderTrackCard(trk, isPlaying));
      });
    }
  }
}

function escapeHtml(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
