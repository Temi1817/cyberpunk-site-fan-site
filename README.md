# CYBERPUNK 2077 — Fan Site

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![No Frameworks](https://img.shields.io/badge/no_frameworks-vanilla-00f5ff?style=flat-square)
![Mobile Ready](https://img.shields.io/badge/mobile-responsive-00cc66?style=flat-square)

An interactive fan site for Cyberpunk 2077 — built with pure HTML/CSS/JS, no libraries or frameworks.

---

## Features

- **16 character pages** — V, Johnny Silverhand, Judy Alvarez, Panam Palmer and 12 more, each with a unique color theme
- **45-weapon database** — full stats, lore, acquisition methods, real in-game renders; filterable by tech type and weapon class
- **38-cyberware database** — Sandevistans, Berserk protocols, Netrunner gear, optical upgrades; filterable by rarity and body slot
- **8-gang database** — Valentinos, Maelstrom, Tyger Claws, Voodoo Boys and 4 more; full dossiers with territory, members, relations
- **Ripperdoc map** — 12 ripperdocs across Night City, interactive pins on an in-game map
- **Mobile responsive** — hamburger nav, slide-out filter panels, full-screen detail panels on all database pages
- **Custom GPU-accelerated cursor** — crosshair rendered entirely on the compositor thread via `transform3d`
- **CRT / scanline overlay** — canvas matrix rain, glitch title animation, custom scrollbar
- **Floating music player** — "I Really Want to Stay At Your House" by Rosa Walton (YouTube IFrame API)
- **SVG fallback icons** — 12 weapon silhouettes + 11 cyberware slot icons, shown automatically if wiki CDN is unavailable
- **Scroll-reveal animations** — IntersectionObserver-driven stat bars and card entrances

---

## Pages

| File | Description |
|------|-------------|
| `index.html` | Main page — hero, characters grid, Night City districts, gangs preview |
| `weapons.html` | 45 iconic weapons with filters, search, and detail panel |
| `cyberware.html` | 38 cyberimplants with rarity/slot filters and game-accurate stats |
| `gangs.html` | 8 Night City gangs with territory, members, and faction relations |
| `rippers.html` | Ripperdoc directory with interactive Night City map |
| `v.html` … `delamain.html` | 16 individual character pages |

---

## Tech Stack

| Feature | Implementation |
|---------|---------------|
| Fonts | Google Fonts — Orbitron (headers), Rajdhani (body) |
| Matrix rain | Canvas 2D API |
| Stat bar animations | IntersectionObserver |
| Color theming | CSS custom properties + `color-mix()` |
| Music player | YouTube IFrame API (postMessage) |
| Weapon/cyberware images | MediaWiki API → Fandom CDN with `referrerpolicy="no-referrer"` |
| Cursor smoothing | `transform: translate3d` + frame-rate-independent lerp |
| Mobile filter panels | CSS transform slide-in + `DOMContentLoaded` toggle JS |

---

## Project Structure

```
cyberpunk-site/
├── index.html          # Main page
├── weapons.html        # Weapons database (45 items)
├── cyberware.html      # Cyberimplants database (38 items)
├── gangs.html          # Gang database (8 factions)
├── rippers.html        # Ripperdoc map
├── v.html              # Character page: V
├── johnny.html         # Character page: Johnny Silverhand
├── judy.html           # Character page: Judy Alvarez
├── panam.html          # Character page: Panam Palmer
├── jackie.html         # Character page: Jackie Welles
├── rogue.html          # Character page: Rogue Amendiares
├── viktor.html         # Character page: Viktor Vektor
├── river.html          # Character page: River Ward
├── kerry.html          # Character page: Kerry Eurodyne
├── takemura.html       # Character page: Goro Takemura
├── misty.html          # Character page: Misty Olszewski
├── adam.html           # Character page: Adam Smasher
├── tbug.html           # Character page: T-Bug
├── alt.html            # Character page: Alt Cunningham
├── evelyn.html         # Character page: Evelyn Parker
├── delamain.html       # Character page: Delamain
└── districts/
    ├── nightcity-map.jpg
    ├── watson_hq_comp.jpg
    ├── westbrook.jpg
    ├── citycenter.jpg
    ├── heywood.jpg
    ├── pacifica.jpg
    ├── santodomingo_comp.jpg
    └── badlands.jpg
```

---

## Mobile Adaptation

All pages are responsive. Breakpoints: `768px` (tablet/mobile) and `520px` (small phones).

| Page | Mobile behaviour |
|------|-----------------|
| `index.html` | Hamburger menu → fullscreen nav overlay; grids collapse 4→2→1 col |
| `weapons.html` | ⚙ ФИЛЬТРЫ button → slide-in filter drawer; detail panel goes full-screen |
| `cyberware.html` | Same as weapons |
| `gangs.html` | Same filter drawer pattern; gang grid 2→1 col |
| `rippers.html` | ⚕ РИПЕРЫ button → slide-in ripper list; map adjusts height |
| Character pages | Hero art hides on small screens; grid collapses to 1 col |

**How filter panels work:** the left panel is `position:fixed; transform:translateX(-100%)` by default. A floating button at the bottom-right toggles `.mob-open` which slides it in. A dark backdrop overlay closes it on tap. Event listeners are bound inside `DOMContentLoaded` so the button element is guaranteed to exist in the DOM.

---

## Quick Start

The site works by opening `index.html` directly in a browser — except the music player, which requires an HTTP server (browsers block YouTube IFrame API on `file://`).

**Start a local server (PowerShell):**

```powershell
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8080/')
$listener.Start()
while ($listener.IsListening) {
  $ctx  = $listener.GetContext()
  $req  = $ctx.Request; $res = $ctx.Response
  $path = "C:\path\to\cyberpunk-site" + $req.Url.LocalPath.Replace('/', '\')
  if ($path.EndsWith('\')) { $path += 'index.html' }
  if (Test-Path $path -PathType Leaf) {
    $bytes = [IO.File]::ReadAllBytes($path)
    $mime  = @{'.html'='text/html;charset=utf-8';'.css'='text/css';'.js'='application/javascript';
               '.png'='image/png';'.jpg'='image/jpeg';'.mp3'='audio/mpeg'}[[IO.Path]::GetExtension($path).ToLower()]
    if (-not $mime) { $mime = 'application/octet-stream' }
    $res.ContentType = $mime; $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } else { $res.StatusCode = 404 }
  $res.Close()
}
```

Then open `http://localhost:8080` in your browser.

---

## Screenshots

| Main Page | Weapons Database |
|-----------|-----------------|
| ![Main](_screenshots/main.png) | ![Weapons](_screenshots/weapons.png) |

| Cyberimplants | Gang Database |
|---------------|---------------|
| ![Cyberware](_screenshots/cyberware.png) | ![Gangs](_screenshots/gangs.png) |

---

## Notes

- All images are loaded from the official Cyberpunk 2077 Wiki CDN (`static.wikia.nocookie.net`). `referrerpolicy="no-referrer"` is required — without it the CDN blocks requests based on the `Referer` header.
- If a wiki image fails to load, an inline SVG silhouette is shown automatically.
- The custom crosshair cursor is desktop-only; on touch devices the browser's default cursor is used.

---

*Fan project — not affiliated with CD PROJEKT RED.*
