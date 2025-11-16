UPDATE - Version 3.0 - Logo, Language Toggle, Audio, Video, and Enhanced Features
==================================================================================

Date: 2025-11-14
Author: Applied by assistant (follow-up edits by repository owner recommended)

Summary
-------
Version 3.0 introduces professional logo integration, French/English language toggle (French by default), background audio with cancel button, local video integration, enhanced dark/light mode toggle, improved menu food imagery, and comprehensive criteria mapping to meet all evaluation requirements.

Files changed
-------------
- `index.html`
  - Added Olympus Bar logo image to navigation (from `Gemini_Generated_Image_vxwtmfvxwtmfvxwt.png`)
  - Set default language to French (`lang="fr"`)
  - Added language toggle button in navigation header
  - Added background audio player with cancel/mute button
  - Added theme toggle button in navigation (dual location: nav + footer)
  - Updated video source to use local file from `assets/media/videos/`
  - Updated audio source to use local file from `assets/media/audios/`
  - Updated menu food images with better food photography:
    - `caroline-attwood-cdVqG9vnCVw-unsplash.jpg` for Nile Pearl Bao
    - `jay-wennington-N_Y88TWmGwA-unsplash.jpg` for Kiriri Ember Board
    - `trinh-minh-th-a6kYPun9_ao-unsplash.jpg` for Cloud Bank Tartlet
  - Added `data-i18n` attributes throughout for translation support
  - Enhanced semantic structure with proper ARIA labels

- `js/main.js`
  - Added comprehensive translations object (French/English)
  - Implemented language toggle functionality with localStorage persistence
  - Added background audio control with play/pause toggle
  - Enhanced theme toggle to work from both navigation and footer
  - Added theme icon switching (moon/sun) based on current theme
  - Applied translations on page load based on stored preference

- `css/style.css`
  - Added `.logo-wrapper` and `.logo-img` styles for professional logo display
  - Added `.audio-controls` and `.audio-toggle` styles for background music player
  - Added `.nav-controls` styles for language and theme toggle buttons
  - Enhanced light theme styles for better contrast and readability
  - Added responsive styles for logo, audio controls, and navigation controls
  - Updated theme switching with proper icon visibility toggles

- `assets/images/olympus-logo.png`
  - Added professional Olympus Bar logo image with golden laurel wreaths

Why
---
Version 3.0 addresses all requirements from `CRITERE_DEVALUATION.md` while implementing the project vision from `CONTEXT.md` and `FOOD.md`:

1. **Logo Integration**: Meets evaluation criteria requirement for professional logo (l. Le logo est de qualité professionnelle)
2. **Language Toggle**: French by default as requested, with English option for accessibility
3. **Background Audio**: Enhances ambiance with cancel option for user control
4. **Local Video**: Uses local video file instead of external CDN for reliability
5. **Enhanced Dark/Light Mode**: Dual toggle locations (nav + footer) with visual indicators
6. **Food Imagery**: Better food photography matches menu descriptions from `FOOD.md`
7. **Criteria Mapping**: All functional and non-functional criteria mapped and documented in `DEVELOPMENT_PLAN.md`

Testing / How to verify
------------------------
1. **Logo**: Open `index.html` and verify the Olympus Bar logo appears in the navigation header
2. **Language Toggle**: Click the language button (FR/EN) in navigation and verify all text switches between French and English
3. **Background Audio**: Click the audio button (♪) in bottom-right corner to start background music; click again to pause (‖)
4. **Video**: Navigate to Contact section and verify the local video plays from `assets/media/videos/`
5. **Dark/Light Mode**: Click theme toggle (☾/☀) in navigation or footer and verify color scheme switches
6. **Menu Images**: Check Menu section and verify updated food images match menu items
7. **Localization**: Refresh page and verify language preference persists (stored in localStorage)
8. **Responsive**: Test on mobile devices; verify logo, audio controls, and navigation adapt properly

Notes and next steps
--------------------
- Language preference persists via localStorage (`olympus-lang`)
- Theme preference persists via localStorage (`olympus-theme`)
- Audio does not autoplay (requires user interaction per browser policies)
- Logo image optimized but may benefit from WebP conversion for performance
- All food images now properly sourced from `images/` folder
- All multimedia assets (audio/video) now use local files for reliability
- Criteria mapping in `DEVELOPMENT_PLAN.md` ensures full evaluation compliance

Commit-style message
--------------------
feat(v3.0): add logo, language toggle, background audio, local video, enhanced dark/light mode, and improved food imagery


---

UPDATE - Version 2.0 - Carousel fix and notes
==============================================

Date: 2025-11-14
Author: Applied by assistant (follow-up edits by repository owner recommended)

Summary
-------
- Replaced the CSS-only carousel slideshow with a small JavaScript-driven carousel for the About section so images advance one at a time and loop without exposing a blank frame.

Files changed
-------------
- `css/style.css`
  - Removed the automatic `animation: slideShow ...` behavior on `.carousel-track` and added a transform transition so JS can control movement smoothly.

- `js/main.js`
  - Added an `initAboutCarousel()` IIFE that:
    - Calculates slide sizing and sets `track.style.width` and each `figure` width.
    - Uses transform translateX to move one slide at a time.
    - Auto-plays with a 3.5s interval, loops, and pauses on hover/focus.
    - Adds a visually-hidden live region (`aria-live="polite"`) to announce slide position for assistive technologies.

Why
---
The previous CSS keyframe approach moved the whole track in pre-defined steps but caused simultaneous movement artifacts and (on some viewports/timings) a visible blank gap after slides cycled. Using JS to size the track and advance by one slide at a time makes the behavior deterministic for any number of slides and prevents empty frames.

Testing / How to verify
-----------------------
1. Open `index.html` in a browser.
2. Scroll to the About section and observe the carousel:
   - One image should be visible at a time.
   - Every ~3.5s it should slide to the next image.
   - After the last image it should return to the first (loop) without a blank gap.
   - Hovering the carousel pauses autoplay; leaving resumes it.
3. Use a screen reader or inspect the DOM to see the hidden live region text updating (e.g. "2 of 3").

Notes and next steps
--------------------
- The CSS keyframes `@keyframes slideShow` remain in `css/style.css` (unused) in case you want to reuse them later; they can be removed to clean up.
- Consider adding visible carousel controls (prev/next buttons) and keyboard support for improved accessibility.
- If you prefer purely CSS animation, a different technique (like cloning slides to create an infinite strip) would be needed to avoid the blank frame — but JS provides a simpler, robust fix.

Commit-style message
--------------------
Fix(about): make carousel JS-driven to slide one image at a time and loop without blank frames
