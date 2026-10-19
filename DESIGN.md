---
name: Nabeel Sohail Portfolio
description: A deep-space engineering console for an AI engineer, with dark navy surfaces, mono labels and electric-blue signal.
colors:
  void: "#050a0f"
  void-1: "#080e15"
  void-2: "#0c1420"
  void-3: "#0f1a28"
  panel: "#0d1520"
  panel-raised: "#111d2e"
  signal-blue: "#3a4eff"
  cyan-beam: "#00c8ff"
  azure-edge: "#1c83eb"
  violet-drift: "#6c63ff"
  text-primary: "#e2eaf4"
  text-secondary: "#8a9bb5"
  text-tertiary: "#7088a8"
typography:
  display:
    fontFamily: "Syne, sans-serif"
    fontSize: "clamp(44px, 6vw, 68px)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-2px"
  headline:
    fontFamily: "Syne, sans-serif"
    fontSize: "clamp(28px, 4vw, 38px)"
    fontWeight: 800
    letterSpacing: "-0.5px"
  title:
    fontFamily: "Syne, sans-serif"
    fontSize: "16px"
    fontWeight: 700
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "12px"
    fontWeight: 500
    letterSpacing: "0.5px"
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  pill: "50%"
spacing:
  section: "110px"
  container-gutter: "28px"
  card: "32px 24px"
components:
  button-primary:
    backgroundColor: "{colors.signal-blue}"
    textColor: "{colors.void}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "14px 28px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.signal-blue}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "13px 28px"
  card-service:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "32px 24px"
  pipeline-node:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "18px"
  nav-item:
    textColor: "{colors.text-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "7px 14px"
---

# Design System: Nabeel Sohail Portfolio

## Overview

**Creative North Star: "The Mission Console"**

A console in a dark room. Surfaces are near-black navy, text is cold off-white, and a single electric-blue signal color marks what is live or interactive. Mono labels, numbered sections and a boot sequence give it the feel of engineering instrumentation. The loader, terminal typer, HUD frame and particle field are the signature; they stay.

The atmosphere comes from precise small signals: faint noise grain, an occasional scanline sweep, a glowing cursor dot, blue glow on touch. It should read as an engineer's instrument panel, not a sci-fi costume.

**Key Characteristics:**
- Dark-only navy-black ground.
- One signal blue; cyan and violet only as gradient companions.
- Mono labels, numbered sections, a boot loader and a terminal readout.
- Technical diagrams (the "How I Build" pipeline) are first-class content.
- Glow and lift are state feedback, not resting decoration.

## Colors

### Primary
- **Signal Blue** (#3a4eff): primary buttons, section indices, active nav, focus and hover borders.
- **Cyan Beam** (#00c8ff): stage labels in diagrams, gradient companion.

### Secondary
- **Azure Edge** (#1c83eb) and **Violet Drift** (#6c63ff): gradient endpoints and translucent borders.

### Neutral
- **Void** (#050a0f) page ground; **Void 1/2/3** alternate section grounds.
- **Panel** (#0d1520) and **Panel Raised** (#111d2e): card surfaces.
- **Text Primary** (#e2eaf4), **Text Secondary** (#8a9bb5), **Text Tertiary** (#7088a8, raised from #4a5e78 for legibility).

### Named Rules
**The One Signal Rule.** Signal Blue is the only color that means interactive.
**The Ghost Border Rule.** Edges are 1px translucent blue, never solid gray.

## Typography

**Display:** Syne. **Body:** DM Sans. **Label/Mono:** JetBrains Mono.

### Hierarchy
- **Display** (800, clamp(44px, 6vw, 68px), 1.05): hero name.
- **Headline** (800, clamp(28px, 4vw, 38px)): section titles.
- **Title** (700, 16px): card titles.
- **Body** (400, 16px, 1.65): paragraphs.
- **Label** (500 to 700, 10 to 13px): nav, buttons, tags, indices, diagram stage labels.

### Named Rules
**The Mono Is Metadata Rule.** Mono is for labels, code, data and stage names, never for paragraphs.

## Layout

Centered 1140px container, 28px gutters, 110px section rhythm. Section heads are centered with an index and hairline rule. Diagrams use equal four-column lanes that collapse to a vertical stack with connectors below 900px.

## Elevation & Depth

Flat at rest, luminous on touch. Tonal navy layers and ghost borders carry depth; glow appears on hover and focus.

### Shadow Vocabulary
- **Signal glow** (`0 0 20px var(--accent-glow)`): hover on buttons and icon tiles.
- **Card lift** (`0 24px 60px rgba(0,0,0,.4), 0 0 40px var(--accent-glow)`, `translateY(-6px)`): card hover.

### Named Rules
**The Glow-as-Signal Rule.** Glow means "this responds to you".

## Shapes

Soft-technical rectangles: 4px chips, 6px buttons, 8px nodes, 10 to 12px cards, 50% dots. Borders are 1px.

## Components

### Buttons
6px radius, mono 13px. Primary: Signal Blue fill with Void text. Ghost: translucent border with blue text. Hover lifts 2px with glow.

### Navigation
Fixed, 66px, translucent with backdrop blur; mono 12px items with blue index numbers; ghost CTA.

### Cards
Panel fill, ghost border, 12px radius, corner glow that fills on hover.

### Pipeline node
Panel fill, 1px ghost border, 8px radius. Cyan mono stage label, secondary body, stage number top right, a blue line connecting to the next stage. Core nodes (vector store, LLM) get a Signal Blue border. Stage labels pulse in sequence to suggest data flow; the pulse stops under reduced motion.

### Signature: Console atmosphere
Boot loader, terminal typer, HUD frame, particle field, noise grain and scanline sweep. All skip or simplify under `prefers-reduced-motion`.

## Motion

GSAP 3.12 + ScrollTrigger, vendored in `js/vendor/`, choreographed in `js/motion.js`. `html.gx` marks it active; without GSAP or under `prefers-reduced-motion` the page is static (CSS reveal fallbacks in `script.js`).

- **Easing and time:** `expo.out` for entrances (about 1s), `power3.out` for pointer follow, `sine.inOut` for ambient drift. Tokens: `--ease-out`, `--ease-io`, `--dur-1..3`.
- **Hero:** headline rises per character from a mask, tagline per word, portrait wipes in. Starts when the loader sets `body.booted`. Behind it: aurora blobs (paused off-screen), a cursor light, grain, vignette. Layers parallax at different rates on scroll-out.
- **Sections:** headings draw their rule, then reveal the title; windows and cards reveal in staggered batches. A scroll-progress line runs along the top.
- **Interaction:** magnetic buttons (use the `translate` property so hover transforms still work), cursor-tracked spotlight inside cards, dock magnification.
- **Rule:** motion must explain structure (arrival, hierarchy, focus). No ambient loop runs while off-screen.

## 3D layer

three.js r160, vendored in `js/vendor/` (import map in `index.html`), lazy-loaded by `js/motion.js` after the boot loader. Code in `js/fx3d.js`. Skipped when WebGL is missing, `prefers-reduced-motion` is set, or data-saver / 2 GB devices; failures leave the 2D site intact.

- **World canvas** (`.fx3d-canvas`, fixed, `z-index: -1`): a neural core around the hero portrait (nodes, links with travelling pulses, cursor attraction). Scrolling flies the camera out through the core and down a tunnel with one glowing gate per section (`section[data-app]` order); the tint shifts blue, cyan, violet per section. Scroll velocity stretches starlight into warp streaks and drives `--warp` for the edge flash (`.warp-fx`).
- **Signature object:** chrome extruded "N" with iridescent clearcoat and orbit rings in `#sig3d` (contact section). Own renderer, renders only while visible. Click to spin.
- **Holographic cards:** project, why-me and leadership cards tilt in 3D with a foil sheen and inner parallax (`.holo`, CSS variables set from pointer position).
- With `html.fx3d`, section backgrounds go transparent and windows drop to about 66% opacity so the world shows through.

## Assets
Fonts (Syne, DM Sans, JetBrains Mono) are self-hosted in `fonts/` via `css/fonts.css`. Icons are a Font Awesome Free subset in `css/icons.css`; when adding an icon, regenerate the subset (it only contains the glyphs in use).

## Do's and Don'ts

### Do:
- **Do** keep Signal Blue the only interactive color.
- **Do** keep tertiary text at or above #7088a8.
- **Do** keep claims to what the content files support.
- **Do** honor `prefers-reduced-motion` in CSS and in JS.

### Don't:
- **Don't** add light-mode surfaces.
- **Don't** set paragraphs in mono.
- **Don't** put glow on resting elements or add a fourth accent hue.
- **Don't** use emoji as icons or flags.
