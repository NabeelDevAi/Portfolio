# Pending work

Last updated: 2026-10-16. Branch: `feature-v2` (not pushed). Last commit: `4f8b9cc`.
Tick items off as you go. Items are grouped by area, with the most important first inside each group.

---

## 1. Fix before the site goes public

- [ ] **"Download CV" serves the old CV.** `NabeelSohail-CV.pdf` still says Karachi and the old email. The hero, contact section, command palette and Services all link to it. Replace it with a new CV, or hide the button until the new one exists.
- [ ] **Test the contact form end to end.** It posts to Web3Forms, but I could not confirm a real message arrives (the test browser could not reach the service). Submit it from your own browser, then check nabeel.dev.ai@gmail.com, including spam.
- [ ] **Restrict the Web3Forms key to your site's domain** in the Web3Forms dashboard (for example `nabeeldevai.github.io`). The key is visible in the page, so without this anyone can copy it and send junk to your inbox.
- [ ] **Google Analytics (`G-1BT82MBJ9J`).** Confirm it is your property (it may belong to the old account). It loads with no consent banner, which is a UK PECR/GDPR problem. Either add a consent banner or remove it.
- [ ] **Confirm the live URL.** Canonical, `og:url` and `og:image` assume `https://nabeeldevai.github.io/Portfolio/`. Check that the GitHub Pages site really lives there.
- [ ] **Social preview image.** `og-image.png` is from the old design. Regenerate it from the new hero.

## 2. Projects phase (the next big job)

- [ ] Rework Featured Projects (AEGiSS, EventBridge AI, Speech Pro). You called them very weak. Only the window frame was added; the content was not touched.
- [ ] Rework the "More builds" grid.
- [ ] **Eight project repo links still point to the old `github.com/NabeelSohail-30` account.** Update or move them to `NabeelDevAi`.
- [ ] Explore Dominica has no public link.
- [ ] The case studies show no metrics, because none were provided. Add real numbers only if you have them.
- [ ] Source files to review: `projects/*.md` (aegiss, am-violation, disano, dominica, eventbridgeai, nehohouse, pyranex, seatswap, snipeitnow, `_template.md`).
- [ ] The "How I Build" section was removed. If you want architecture detail later, decide whether it goes inside each case study.

## 3. About section: content only you can give

Answer what you can. Anything left blank stays out.

- [ ] How did you get into AI? What first pulled you in?
- [ ] One thing you've learned about leading a team.
- [ ] What you do outside tech (hobbies, reading, sport).
- [ ] Languages you speak (for the terminal fact sheet).
- [ ] MSc start date, expected finish, focus or dissertation topic.
- [ ] One project or moment you're proudest of.
- [ ] Do you want faith, INFJ type or age mentioned? (Left out for now.)
- [ ] Check the sentences I wrote myself, and cut any that overstate:
  - "Moving between three countries taught me to work across cultures."
  - "My days are part architecture, part code review, part turning what a client needs into something a team can build and ship."
  - The "BSCS begins 2021" line in the `journey` tab.

## 4. Claims to verify (keep the site honest)

- [ ] **Services:** "Technical consulting" is my addition. Confirm you want to offer it.
- [ ] **Services:** "hand over something deployed and documented" (Freelance builds). Is it accurate?
- [ ] **Services:** corporate training and university workshops (Mentoring and training). Your CV only shows school teaching so far.
- [ ] **Tech stack additions I picked.** Remove any you haven't used in real work: LlamaIndex, CrewAI, Gemini, Ollama, Chroma, pgvector, scikit-learn, PyTorch, TensorFlow, Pandas, NumPy, Fine-tuning, LLM evaluation, Multi-agent systems, Voice AI, Cursor, OpenCode, Codex, Redis, Elasticsearch.
- [ ] **"Serving millions of users"** appears in Experience and elsewhere with no source. Name the product or surface it refers to, or soften it.
- [ ] **Hero capability strip** (LLMs / RAG / AI agents / Computer vision / Voice AI / Full-stack). Confirm all six.
- [ ] **Boot loader module names** (`llm.ko`, `rag.ko`, `agents.ko`, `vision.ko`, `voice.ko`) are decoration but mirror those skills.

## 5. Content decisions still open

- [ ] **Contact quote.** It still reads "I don't just build AI features. I build AI infrastructure that holds under real-world pressure…". You said "I don't just build AI" in an earlier message. Did you want that quote replaced with "I build AI and Web Solutions that run in Production"?
- [ ] **Why Work With Me** overlaps with Services and About. Merge it or cut it.
- [ ] **Leadership** still lists PAFLA, although your newer content omitted it. Keep or drop.
- [ ] **Education:** the MSc has no dates yet.
- [ ] **Mobile hero:** the photo sits below the first screen. Decide whether you want it above the buttons instead.

## 6. Testimonials

- [ ] Tell the four people you're quoting (Muhammad Nadir, Syed Farhan Ahmed, Kashan Khan Ghori, Laiba Rafiq) before the site goes public.
- [ ] Dr. Shakir's recommendation was skipped because it calls you "Nabeel Qadri". Ask whether it can be corrected, or leave it out.
- [ ] More quotes can be added later. The row becomes a carousel automatically after four.

## 7. Technical and quality

- [x] Fonts self-hosted, Font Awesome subset to 8 KB, particle canvas pauses off-screen. Still open: check `profile.jpg` size and the canvas on a real low-end phone.
- [ ] **New icons need a regenerated subset** (`css/icons.css` only has the glyphs in use).
- [x] Loader: full on first visit, about 30% length after that (localStorage `nos-booted`).
- [ ] **No 404 page, `sitemap.xml` or `robots.txt`.**
- [ ] **Cross-browser test:** Safari and Firefox (the `<dialog>`, `clip-path` CRT effect, the `translate` property for hero depth, `backdrop-filter`), plus real phones.
- [ ] **Accessibility pass:** screen reader on the command palette, terminal tabs and testimonial modal. Keyboard-only run-through. 11px mono labels were raised to 12px.
- [ ] **Custom cursor** hides the native one. Decide if you want to keep it.
- [ ] **Small visual quirks:**
  - [x] Stray `·` separators in the tech stack (now leading bullets).
  - Experience cards are tight on phones inside the window.
  - Testimonial card captions sit at slightly different heights.
  - [x] Dock still scrolls sideways on phones, but now centres the active icon and fades its edges.
  - Stack, Services and About each have a panel inside a window (the detector flags this; it is deliberate).

- [ ] **3D layer needs real-device testing.** Frame rate on a mid-range Android phone and an older laptop; if it stutters, lower `N`, `TN`, `SN` or the DPR cap in `js/fx3d.js`. Also check Safari (import maps need 16.4+; older versions fall back to the 2D site).

## 8. Cleanup

- [ ] **Dead CSS and JS** from earlier layouts: old nav and hamburger rules, the old hero terminal and `.about-term` styles, `.glance`, `.hpill`, `.hero-metrics`, `.svc-card`, `.tech-pill`, old pipe and platform bits. Remove after confirming nothing uses them.
- [ ] **`.impeccable/review/`** is about 9 MB of untracked screenshots. Delete it or add it to `.gitignore`.
- [ ] **`content.md`** is stale (Karachi, old email, old GitHub). Rewrite it or delete it.
- [ ] **Docs out of date:** `DESIGN.md` and `PRODUCT.md` still describe the old hero, the "How I Build" pipeline and the old loader. Update them with the OS layer.
- [ ] **Detector settings** I added to `.impeccable/config.json`: `flat-type-hierarchy` and `dark-glow` are silenced for `index.html`. Review if you ever want stricter checks.
- [ ] `.impeccable/archive/container-yard/` holds the rejected container-yard design. Keep or delete.

## 9. Git and deploy

- [ ] Push `feature-v2` and open a pull request to `main`, or merge it.
- [ ] Deploy under the `NabeelDevAi` GitHub Pages site and check the live URL.
- [ ] After deploying, hard-refresh (Ctrl+Shift+R) to rule out a cached old stylesheet.
- [ ] Update the LinkedIn profile "Website" field to the new URL.

## 10. Ideas, if you want more later

- [ ] More OS touches: desktop file icons in the hero, a window-open animation, a right-click menu on the photo, a toast notification after sending the form.
- [ ] A first-visit-only version of the full boot sequence.
- [ ] Per-project windows that open like apps once the Projects phase is done.
- [ ] An `ask`-style tab in the terminal that links to contact methods.
