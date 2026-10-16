---
name: Nabeel Sohail Portfolio
description: A portfolio laid out as a global container yard, with corrugated steel boxes, stencil lettering and ISO 6346 codes.
colors:
  container-red: "#a63a2c"
  red-deep: "#7e2a20"
  ocean-blue: "#1b4a7a"
  blue-deep: "#123456"
  mustard: "#d6a21e"
  mustard-deep: "#a87d0e"
  forest-green: "#2a5f46"
  green-deep: "#1d4533"
  steel: "#a9b3b8"
  steel-deep: "#7f8b91"
  concrete: "#d3d5d1"
  asphalt: "#1e2124"
  asphalt-raised: "#2b2f33"
  paper: "#f1f2f0"
  ink: "#16181a"
  ink-soft: "#3b4147"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Big Shoulders Stencil, Arial Narrow, sans-serif"
    fontSize: "clamp(2.6rem, 6.4vw, 4.75rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "0.01em"
  title:
    fontFamily: "Big Shoulders Stencil, Arial Narrow, sans-serif"
    fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "0.01em"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.02em"
  code:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.04em"
    fontFeature: "tabular-nums"
rounded:
  none: "0"
spacing:
  gutter: "clamp(18px, 4vw, 32px)"
  gap-sm: "8px"
  gap-md: "14px"
  gap-lg: "clamp(12px, 2vw, 20px)"
  section: "clamp(72px, 10vw, 128px)"
  nav-height: "60px"
components:
  container-tile:
    backgroundColor: "{colors.container-red}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "22px 18px 20px"
  route-door:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "18px 56px 18px 22px"
    height: "132px"
  manifest:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "clamp(22px, 4vw, 40px)"
  ledger-leg:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "clamp(26px, 4vw, 40px) 0"
  nav:
    backgroundColor: "{colors.asphalt}"
    textColor: "{colors.white}"
    height: "60px"
  button-primary:
    backgroundColor: "{colors.container-red}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "15px 26px"
  button-primary-hover:
    backgroundColor: "{colors.red-deep}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "15px 26px"
  button-ghost-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
  form-field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
---

# Design System: Nabeel Sohail Portfolio

## Overview

**Creative North Star: "The Container Yard"**

The page is a bay plan. Every coloured surface is a corrugated steel container, and the visitor reads the portfolio the way a port reads a stack of boxes: by colour, stencilled name and code. The container is the one standard object shared by every place in the story (Teesport and Middlesbrough, Karachi, Kuwait, the UK), so the system is global and not tied to one country. Ground is yard concrete, chrome is asphalt, and documents (bill of lading, voyage ledger, contact sheet) are cool paper with hard ink rules.

Density is generous between sections and compact inside boxes. Corners are square, borders are 3px, and motion is mechanical: boxes lift, door seams widen, leaves swing open onto a manifest. It rejects the dark-neon terminal that preceded it, the icon card grid, and the cream-serif editorial default.

**Key Characteristics:**
- One material: flat colour plus a corrugation rib tile
- Square corners, 3px borders, deeper-colour bottom edge on boxes
- Real offset shadows cast straight down, no glow
- Stencil display over Archivo body; mono only for codes and data
- Door hardware (seams, locking rods, corner castings) as the interactive vocabulary
- Paper and ink for anything that is a document

## Colors

Drenched oxide, ocean, mustard and forest steel on concrete and asphalt, with paper for documents. Each box carries one colour family and its deep sibling.

### Primary
- **Container Red** (`container-red`): the lead box colour, hero wall, primary button, nav bottom rule, stamps and scrollbar thumb.
- **Door Seam Red** (`red-deep`): the bottom edge of red boxes, button hover, and red text on paper (categories, error text, stamp text).

### Secondary
- **Ocean Blue** (`ocean-blue`): blue boxes, the voyage section ground, and organisation names on the ledger.
- **Deep Ocean** (`blue-deep`): bottom edge of blue boxes.

### Tertiary
- **Hazard Mustard** (`mustard`): mustard boxes, the about section, CV button in the nav, active nav underline, selection and the default focus outline. Always carries ink text.
- **Deep Mustard** (`mustard-deep`): bottom edge of mustard boxes.
- **Forest Green** (`forest-green`) and **Deep Forest** (`green-deep`): green boxes and the stowage section.

### Neutral
- **Bare Steel** (`steel`) and **Shadowed Steel** (`steel-deep`): the pale box variant (ink text) and its bottom edge.
- **Yard Concrete** (`concrete`): page and work-section ground.
- **Asphalt** (`asphalt`, `asphalt-raised`): nav, dock and footer chrome.
- **Manifest Paper** (`paper`): bill of lading, ledger, contact sheet, route doors.
- **Ink** (`ink`, `ink-soft`): all text on paper and concrete, document rules, opened-box frame.
- **Stencil White** (`white`): text on red, blue, green and asphalt; input fill.

### Named Rules
**The One-Material Rule.** Everything coloured is corrugated steel: a flat palette colour plus the rib tile. No gradient surfaces, glass or second material. Paper and ink are documents, asphalt is chrome, concrete is ground.

**The Rib Fade Rule.** Ribs fade out under body copy. Sections that hold paragraphs fade the rib tile into flat colour over 300px so reading text never sits on corrugation.

## Typography

**Display Font:** Big Shoulders Stencil (with Arial Narrow, sans-serif)
**Body Font:** Archivo (with system-ui, sans-serif)
**Label/Mono Font:** Martian Mono (with ui-monospace, monospace), codes and data only

**Character:** Stencil lettering is spray-marked on a container side; Archivo is the plain, legible grotesque of the paperwork. Mono is the code plate.

### Hierarchy
- **Display** (900, clamp(2.6rem, 6.4vw, 4.75rem), 0.95): section h2s, uppercase. The hero name goes larger (clamp(4rem, 13vw, 6rem)).
- **Title** (900, clamp(1.7rem, 3.2vw, 2.4rem), 0.95): ledger roles, container names (up to 2.5rem), manifest title (up to 3.5rem), route door labels (up to 2rem).
- **Body** (400, 1.0625rem, 1.6): running copy; section intros capped at 56ch, manifest copy at 62ch.
- **Label** (700, 0.9375rem, 0.02em): buttons, nav items, field labels, tags.
- **Code** (400, 0.6875rem to 0.8125rem, 0.04em, tabular-nums): ISO 6346 container codes, B/L document numbers, ledger dates, manifest labels (uppercase, 0.08em).

### Named Rules
**The Code-Only Mono Rule.** Martian Mono sets ISO codes, document numbers, dates and data labels. Never headings, buttons, body copy or ornament.

**The Stencil Case Rule.** Every h1-h3 is Big Shoulders Stencil 900, uppercase, line-height 0.95, balanced wrap.

## Layout

A single column page with a 1180px container and a fluid gutter (18px to 32px). Sections stack as full-bleed colour bands with vertical padding of clamp(72px, 10vw, 128px). The work section is a 4-column bay grid (gap 12px to 20px) of near-square boxes; an opened container takes a full-width row beneath its bay. The hero places three route doors in a 3-column grid (14px gap) along the wall's bottom edge. The ledger is a two-column grid (date and stamp left, body right). Breakpoints at 1000px, 860px (nav collapses to a menu button) and 620px simplify columns and shrink the hero. A 60px fixed nav sets the scroll offset.

## Elevation & Depth

Hybrid of flat colour and real cast shadow. Objects sit on the ground and throw a shadow straight down; there is no blur halo or glow. A box's bottom edge is a flat 8px band of its deep colour, which reads as thickness.

### Shadow Vocabulary
- **Rest, door** (`box-shadow: 0 10px 20px rgba(0,0,0,0.3)`): route doors.
- **Rest, box** (`box-shadow: 0 10px 18px rgba(0,0,0,0.22)`): container tiles.
- **Lifted** (`box-shadow: 0 20px 28px rgba(0,0,0,0.3)`, translateY(-8px)): hovered box; doors lift 6px with `0 18px 28px rgba(0,0,0,0.38)`.
- **Open** (`box-shadow: 0 0 0 4px var(--ink), 0 16px 24px rgba(0,0,0,0.3)`): expanded box, hard ink ring.
- **Sheet** (`box-shadow: 0 18px 32px rgba(0,0,0,0.3)`; 0.4 alpha on the dark contact sheet): ledger and form sheet.

### Named Rules
**The Real Weight Rule.** Depth is a downward offset shadow with no spread glow. Hover lifts the object and deepens its shadow; nothing ever glows.

## Shapes

Square. Border-radius is 0 everywhere. Borders are 3px (buttons, inputs, ledger rules, stamps, empty-slot dashes) or 2px (tags). Silhouette comes from hardware: a 3px door seam at 50%, locking rods near 12% and 88%, and 14px dark corner castings. The ledger stamp is the one tilted element (rotate -2deg, 3px red border). Motion uses one expo ease (cubic-bezier(0.16, 1, 0.3, 1)) and is gated by prefers-reduced-motion.

## Components

### Buttons
- **Shape:** square, 3px border, 15px 26px padding, Archivo 700.
- **Primary:** Container Red fill, white text; hover darkens to Door Seam Red and lifts 3px.
- **Ghost:** transparent, 3px white outline, white text; hover fills white with ink text. A paper variant (paper fill, ink text) serves red grounds.
- **Focus:** 3px outline offset 3px, mustard by default, white on dark sections, ink on mustard and paper sections.

### Container Tile
Project box, near-square (1 : 1.02), colour family chosen per box, ribbed, with seam, rods, corner castings and an 8px deep-colour bottom edge. Top-right holds a mono ISO code plate on a translucent black chip; bottom holds the stencil name and a category line over a 3px rule. Mustard and steel tiles use ink text. An empty slot is a 3px dashed ink outline with no fill.

### Route Door
Paper block with a center seam and two locking rods; label in stencil, audience line above in Archivo 600. On hover the seam widens to a 14px asphalt gap and the red arrow nudges 5px.

### Bill-of-Lading Manifest
The opened container: ink frame (14px) around a paper sheet. Header row has a mono document code and a solid ink Close button (red on hover), over a 3px ink rule. Then stencil title, red-deep category, 62ch description, mono label, outlined tags, and a red link button. Two ribbed door leaves swing away (rotateY, 0.9s) on open.

### Ledger Leg with Stamp
Paper ledger with legs separated by 3px ink rules. Left column holds a mono date and a rotated red stamp; right holds stencil role title, blue organisation and a list.

### Navigation
Fixed 60px asphalt bar with a 3px red bottom rule. Stencil wordmark with a mono code beside it. Items are Archivo 600 in light grey; hover goes white; active gets a 3px mustard underline. The CV link is a mustard block that lifts 2px. Below 860px a 44px menu button opens a sliding panel.

### Form Field
Bold label above a white input with a 3px ink border and no radius. Focus turns the border red with a 3px mustard outline offset 2px. Invalid state is a red border on a pale red fill (`#fbefec`) with a bold red-deep message beneath.

## Do's and Don'ts

### Do:
- **Do** build coloured surfaces from one palette colour, the rib tile and a deeper bottom edge.
- **Do** keep corners square and borders 3px.
- **Do** use ink text on mustard and steel, white on red, blue, green and asphalt.
- **Do** give interactive objects door vocabulary (seam, rods, castings, leaves) and lift them on hover.
- **Do** set ISO codes with a computed check digit, in Martian Mono.
- **Do** pick a focus outline colour that contrasts its section ground.

### Don't:
- **Don't** set headings, buttons or body copy in Martian Mono.
- **Don't** add glow, blurred halos or coloured shadows.
- **Don't** put ribs under paragraphs; fade them to flat colour.
- **Don't** round corners or add a second surface material.
- **Don't** return to the dark-neon terminal look or an icon card grid.
