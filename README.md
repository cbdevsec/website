# Aya — Cybersecurity Portfolio

A single-page portfolio site: dark violet/cyan theme, scroll-triggered reveals, an animated network-node background, a typing terminal in the hero, and small canvas visuals on each project. Pure HTML/CSS/JS — no build step, no dependencies.

## Files
- `index.html` — page content
- `style.css` — theme + layout + animations
- `script.js` — scroll reveals, terminal effect, canvas backgrounds
- `assets/logo.svg` — your logo (also used as the favicon)

## Before you publish
- Swap the placeholder links in the Contact section (`mailto:you@example.com`, GitHub, LinkedIn) for your real ones — search `index.html` for `#contact`.
- Everything else (certs, projects, timeline, clubs) is already filled in from your background — edit any wording directly in `index.html`.

## Deploy to GitHub Pages
1. Create a new repository on GitHub (e.g. `aya-portfolio`). If you want it at `yourusername.github.io`, name the repo exactly that.
2. Upload these files to the repo — either drag-and-drop them in the GitHub web UI, or from a terminal:
   ```bash
   cd aya-cyber-portfolio
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. On GitHub, go to the repo's **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Under **Branch**, choose `main` and folder `/ (root)`, then **Save**.
6. Wait a minute, then your site is live at:
   - `https://YOUR_USERNAME.github.io/YOUR_REPO/` (normal repo), or
   - `https://YOUR_USERNAME.github.io/` (if the repo is named `YOUR_USERNAME.github.io`)

No further setup needed — it's a static site.
