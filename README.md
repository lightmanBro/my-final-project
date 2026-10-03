# 🎵 SoundWave — Music Discovery Dashboard

**Author:** Omotoso David  
**Course:** WDD 330 — Web Frontend Development II  
**Milestone:** Week 5 Implementation (Wireframes, API Integration Setup, Search Functionality)  

---

## 🌟 Overview
SoundWave is a modern music discovery dashboard designed to solve the challenge of fragmented music search. It combines live music catalogue search, 30-second HD audio preview streaming, artist biographies, tour schedules, and synchronized lyrics into a centralized, dark-mode glassmorphic interface.

---

## 🚀 Week 5 Deliverables Implemented

### 1. 📐 Interactive Visual Wireframes & Technical Blueprint
- **Home Dashboard View:** Complete layout with header navigation, live search bar, category filter pills (All / Songs / Artists / Albums), genre tags, hero spotlight showcase, trending artists carousel, curated recommendations, and floating persistent audio player.
- **Artist Spotlight Page:** Dedicated detail view with artist backdrop banner, verified avatar, top anthems list with audio visualizers, biography, lyrics preview, and upcoming concert feeds.
- **Dedicated Wireframe Page:** Accessible at [`/wireframes/index.html`](file:///c:/Users/USER/Desktop/wdd-330/my-final-project/src/wireframes/index.html) with interactive structural blueprints and data-attribute schema tables.

### 2. ⚡ External API Integration Setup
- **Live Multi-Source Search Engine ([`src/js/api/musicApi.mjs`](file:///c:/Users/USER/Desktop/wdd-330/my-final-project/src/js/api/musicApi.mjs)):** Integrated with live music endpoints (iTunes Search API) providing real-time artist catalogues, album art (600x600 HD), and direct 30s AAC/MP3 audio streams.
- **Curated Dataset Fallback ([`public/data/data.json`](file:///c:/Users/USER/Desktop/wdd-330/my-final-project/public/data/data.json)):** Includes full dataset of 10+ attributes per record (ID, title, artist, album, duration, previewUrl, cover, genre, lyricsPreview, concert dates) for 100% offline resilience and testing.

### 3. 🔍 Basic & Advanced Search Functionality
- **Debounced Live Input:** Automatically executes search after 350ms pause while typing, preventing extraneous network calls.
- **Category Filter Pills:** Instant filtering by *All*, *Tracks / Songs*, *Artists*, or *Albums*.
- **Quick Genre Chips:** One-click filtering for Afrobeats, Pop, Hip-Hop, R&B, Synthwave, and Rock/Alt.
- **Dynamic Search Feedback:** Active results counter, loading skeleton shimmer animations, clear button, and empty state handler.

### 4. 🎧 Interactive Audio Preview Player
- Persistent bottom audio control bar with play/pause, time tracker (`0:00 / 0:30`), interactive click-to-seek progress bar, and volume controller.
- Real-time animated audio equalizer bars that activate on the currently playing track card.

---

## 📁 Project Structure

```
my-final-project/
├── index.html -> src/index.html
├── package.json
├── vite.config.js
├── public/
│   ├── favicon.svg             # Glowing neon music note SVG
│   └── data/
│       └── data.json           # Comprehensive sample & fallback dataset (10+ attributes)
├── src/
│   ├── index.html              # Main Home Dashboard
│   ├── artist/
│   │   └── index.html          # Artist Spotlight & Detail Page
│   ├── wireframes/
│   │   └── index.html          # Interactive Week 5 Wireframes & Architecture Page
│   ├── css/
│   │   └── style.css           # Modern Dark Theme, Neon Accents & Glassmorphism
│   └── js/
│       ├── main.js             # Dashboard Controller
│       ├── artist.js           # Artist Page Controller
│       ├── api/
│       │   └── musicApi.mjs    # API Integration Layer (Live API + Offline Fallback)
│       └── components/
│           ├── AudioPlayer.mjs # Singleton HTML5 Audio Stream Engine
│           ├── Search.mjs      # Debounced Search & Filter Controller
│           ├── TrackCard.mjs   # Interactive Track Card Component
│           ├── ArtistCard.mjs  # Artist Profile Card Component
│           └── Toast.mjs       # Notification System
└── README.md
```

---

## 🛠️ Setup & Running Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Local Development Server:**
   ```bash
   npm start
   # or
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📅 Course Schedule Tracker
- [x] **Week 5 (Completed):** Wireframes, API integration setup, basic search functionality, audio preview player.
- [ ] **Week 6 (Upcoming):** Implement synchronized lyrics, personalized recommendations, and playlist creation.
- [ ] **Week 7 (Final Polish):** Social media sharing, visual equalizer enhancements, performance polish, and final submission.
