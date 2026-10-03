/**
 * Audio Player Component & Controller
 * Manages audio preview playback, reactive UI bar updates, and timeline scrubbing
 */

import { showToast } from "./Toast.mjs";

class AudioPlayerController {
  constructor() {
    this.audio = new Audio();
    this.currentTrack = null;
    this.isPlaying = false;

    this.dom = {
      bar: null,
      title: null,
      artist: null,
      thumb: null,
      playBtn: null,
      progressBar: null,
      progressFill: null,
      currentTime: null,
      totalTime: null,
      volumeSlider: null
    };

    this.listeners = [];
  }

  init() {
    this.dom.bar = document.getElementById("audioPlayerBar");
    if (!this.dom.bar) return;

    this.dom.title = document.getElementById("playerTitle");
    this.dom.artist = document.getElementById("playerArtist");
    this.dom.thumb = document.getElementById("playerThumb");
    this.dom.playBtn = document.getElementById("playerPlayBtn");
    this.dom.progressBar = document.getElementById("playerProgressBar");
    this.dom.progressFill = document.getElementById("playerProgressFill");
    this.dom.currentTime = document.getElementById("playerCurrentTime");
    this.dom.totalTime = document.getElementById("playerTotalTime");
    this.dom.volumeSlider = document.getElementById("playerVolumeSlider");

    this.setupEvents();
  }

  setupEvents() {
    // Audio element events
    this.audio.addEventListener("timeupdate", () => this.onTimeUpdate());
    this.audio.addEventListener("ended", () => this.onEnded());
    this.audio.addEventListener("error", (e) => {
      console.warn("Audio playback error or preview unavailable:", e);
      showToast("Audio preview not available for this track", "warning");
      this.isPlaying = false;
      this.updatePlayStateUI();
    });

    // Play/Pause button
    if (this.dom.playBtn) {
      this.dom.playBtn.addEventListener("click", () => this.togglePlay());
    }

    // Progress Bar Scrubbing
    if (this.dom.progressBar) {
      this.dom.progressBar.addEventListener("click", (e) => {
        if (!this.audio.duration) return;
        const rect = this.dom.progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const ratio = Math.max(0, Math.min(1, clickX / rect.width));
        this.audio.currentTime = ratio * this.audio.duration;
      });
    }

    // Volume Slider
    if (this.dom.volumeSlider) {
      this.dom.volumeSlider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        this.audio.volume = val;
      });
    }

    // Global click listener for track cards
    document.addEventListener("click", (e) => {
      const card = e.target.closest(".track-card");
      if (card && card.dataset.trackJson) {
        try {
          const track = JSON.parse(card.dataset.trackJson);
          this.handleCardClick(track);
        } catch (err) {
          console.error("Failed to parse track data:", err);
        }
      }
    });
  }

  handleCardClick(track) {
    if (this.currentTrack && this.currentTrack.id === track.id) {
      this.togglePlay();
    } else {
      this.playTrack(track);
    }
  }

  playTrack(track) {
    if (!track.previewUrl) {
      showToast(`No audio preview stream available for "${track.title}"`, "warning");
      return;
    }

    this.currentTrack = track;
    this.audio.src = track.previewUrl;
    this.audio.play().then(() => {
      this.isPlaying = true;
      this.updateUI();
      this.notifyListeners("play", track);
      showToast(`Now playing preview: ${track.title} - ${track.artist}`, "success", 2000);
    }).catch(err => {
      console.warn("Autoplay / audio play blocked:", err);
      this.isPlaying = false;
      this.updateUI();
    });
  }

  togglePlay() {
    if (!this.currentTrack) return;

    if (this.audio.paused) {
      this.audio.play().then(() => {
        this.isPlaying = true;
        this.updatePlayStateUI();
        this.notifyListeners("play", this.currentTrack);
      }).catch(err => console.warn(err));
    } else {
      this.audio.pause();
      this.isPlaying = false;
      this.updatePlayStateUI();
      this.notifyListeners("pause", this.currentTrack);
    }
  }

  onTimeUpdate() {
    if (!this.audio.duration) return;
    const current = this.audio.currentTime;
    const total = this.audio.duration;
    const percent = (current / total) * 100;

    if (this.dom.progressFill) {
      this.dom.progressFill.style.width = `${percent}%`;
    }
    if (this.dom.currentTime) {
      this.dom.currentTime.textContent = this.formatTime(current);
    }
    if (this.dom.totalTime) {
      this.dom.totalTime.textContent = this.formatTime(total);
    }
  }

  onEnded() {
    this.isPlaying = false;
    this.updatePlayStateUI();
    if (this.dom.progressFill) this.dom.progressFill.style.width = "0%";
    this.notifyListeners("ended", this.currentTrack);
  }

  updateUI() {
    if (!this.currentTrack) return;

    if (this.dom.title) this.dom.title.textContent = this.currentTrack.title;
    if (this.dom.artist) this.dom.artist.textContent = this.currentTrack.artist;
    if (this.dom.thumb) this.dom.thumb.src = this.currentTrack.cover;

    this.updatePlayStateUI();
  }

  updatePlayStateUI() {
    if (!this.dom.playBtn) return;
    if (this.isPlaying) {
      this.dom.playBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
      this.dom.playBtn.setAttribute("title", "Pause Preview");
    } else {
      this.dom.playBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
      this.dom.playBtn.setAttribute("title", "Play Preview");
    }

    // Update active class on cards
    document.querySelectorAll(".track-card").forEach(card => {
      if (this.currentTrack && card.dataset.trackId === this.currentTrack.id) {
        if (this.isPlaying) card.classList.add("is-playing");
        else card.classList.remove("is-playing");
      } else {
        card.classList.remove("is-playing");
      }
    });
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notifyListeners(type, track) {
    this.listeners.forEach(fn => fn({ type, track, isPlaying: this.isPlaying }));
  }
}

export const audioPlayer = new AudioPlayerController();
