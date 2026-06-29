# TorScope

**Interactive Tor Network Visualization Platform**

TorScope is an educational cybersecurity dashboard that simulates how the Tor network routes traffic through Guard, Middle, and Exit relays. It is built for university students, instructors, and anyone who wants to understand onion routing, privacy, and anonymous communication — without reading a dry textbook.

The experience is a single scrolling web app: animated 3D globes, circuit timelines, IP-transition flowcharts, and a side-by-side Chrome vs Tor Browser demo. Everything updates in sync as you explore.

> **This project is strictly educational.** It does not connect to the real Tor network, does not include illegal content, hacking tutorials, or criminal material. All relays, IP addresses, latencies, and circuits are **simulated** to teach network routing and Tor architecture.

---

## Purpose

Most people hear about Tor but never see how a circuit actually works. TorScope fills that gap by turning abstract concepts into something you can **see, click, and replay**:

- How a normal internet request exposes your real IP end-to-end
- How Tor splits knowledge across three relays so no single hop knows both **who you are** and **where you're going**
- How onion layers are peeled at each relay
- Why Tor is slower than a direct connection
- What each party in the chain actually knows (user, guard, middle, exit, website)
- What Tor is good at — and what it cannot guarantee

The goal is **clarity, not sensationalism**. The UI is designed like a professional security dashboard (clean glass panels, subtle glow, smooth motion) — not a "hacker movie" aesthetic.

---

## What the Simulation Does

TorScope runs entirely in the browser. No backend, no live Tor connection.

| Simulated element | What it represents |
| ----------------- | ------------------ |
| **Relay pool** | Thousands of volunteer nodes across countries (Guard, Middle, Exit roles) |
| **Circuit generation** | Random selection of one Guard + one Middle + one Exit per circuit |
| **IP addresses** | Fake but realistic IPs assigned per relay and rewritten at each hop |
| **Globe arcs** | Animated packet path from you → Guard → Middle → Exit → destination |
| **Latency & bandwidth** | Illustrative metrics for teaching, not live measurements |
| **Live TorMap** | Clustered relay dots on a globe with search, filters, and node inspector |
| **Destination picker** | Choose a website (Google, Wikipedia, BBC, etc.); server location is fixed per brand, like real life |

When you click **Generate Circuit** or **New Identity**, the dashboard rebuilds the path, updates the globe, timeline, IP flowchart, and demo panels together.

---

## Dashboard Highlights

### Interactive 3D globe
- Photoreal Earth with starfield background
- Colored circuit arcs (Guard = green, Middle = purple, Exit = red)
- Drag to rotate, scroll to zoom, fullscreen mode with circuit agenda
- Render loop pauses when off-screen to save GPU

### IP-transition flowchart
Shows how the **source IP is rewritten at every hop**:

```
You (real IP) → Guard → Middle → Exit → Website (sees exit IP only)
```

Displayed inline on key sections and in fullscreen globe view. Stays synchronized with the active circuit.

### Circuit timeline
A horizontal (or vertical on mobile) step-by-step path: You → Guard → Middle → Exit → Destination, with relay nicknames, countries, and metrics.

### Destination picker
Pick a destination website from the navbar. The brand, domain, icon, and fixed server country update across all globes, labels, and comparisons.

### Demo mode
Side-by-side **Chrome** (real IP exposed) vs **Tor Browser** (exit IP in another country), plus a live globe and **New Identity** button to rebuild the circuit.

### Who knows what matrix
Interactive grid: green check / red X for what each party knows about the user, destination, and packet contents.

### Onion routing visual
Animated layers peeled away at each relay until the packet reaches the website.

---

## Sections (15 + Hero)

| # | Section | What you learn |
| - | ------- | -------------- |
| — | **Hero** | Scroll-driven intro with Earth and network particles |
| 1 | **Surface / Deep / Dark Web** | Web tiers with everyday educational examples |
| 2 | **How the Internet Works** | Direct routing: laptop → ISP → DNS → website (IP visible) |
| 3 | **How Tor Works** | Generate circuits on a 3D globe; see the full relay path |
| 4 | **Guard Relay** | First hop knows your IP, not your destination |
| 5 | **Middle Relay** | Blind forwarder; cannot link user to site |
| 6 | **Exit Relay** | Website sees exit IP, not your real IP |
| 7 | **New Identity** | Rebuild circuit; watch countries and exit IP change |
| 8 | **Live TorMap** | Explore relay density, filter by role, inspect nodes |
| 9 | **Onion Routing** | Layer-by-layer encryption peel animation |
| 10 | **Who Knows What** | Trust / knowledge matrix across all parties |
| 11 | **Why Tor Is Slow** | 1-hop vs 3-hop latency comparison |
| 12 | **Advantages** | Privacy, journalism, research, activism, censorship resistance |
| 13 | **Limitations** | Speed, exit visibility, fingerprinting, honest caveats |
| 14 | **Demo Mode** | Instructor-style Chrome vs Tor comparison |
| 15 | **Summary** | Full journey recap with summary cards |

---

## Tech Stack

- **React 19** + **Vite** + **TypeScript**
- **Tailwind CSS** — dark cyber theme, liquid glass panels, design tokens
- **Framer Motion** — scroll reveals, transitions, UI motion
- **Three.js** + **React Three Fiber** + **Drei** — 3D globes, particles, arcs
- **D3** — latency charts
- **Lenis** — smooth scrolling
- **Lucide** — icons

---

## Getting Started

**Prerequisites:** [Node.js](https://nodejs.org/) 18+ and npm.

### 1. Clone the repository

```bash
git clone https://github.com/Akash-2615/Torscope-.git
cd Torscope-
```

> If you cloned via SSH instead: `git clone git@github.com:Akash-2615/Torscope-.git`

### 2. Install dependencies

```bash
npm install
```

### 3. Run the dev server

```bash
npm run dev
```

Then open the printed URL in your browser (default **http://localhost:5173**).

### Other commands

```bash
# Type-check + production build (outputs to dist/)
npm run build

# Preview the production build locally
npm run preview

# Lint the codebase
npm run lint
```

> **Stop the dev server:** press `Ctrl + C` in the terminal running it.

---

## Project Structure

```
src/
├── components/
│   ├── layout/       Navbar, Footer, DestinationPicker, ScrollProgress
│   ├── primitives/   GlowCard, MagneticButton, Reveal, Section
│   ├── three/        CircuitGlobe, MapGlobe, Starfield, CircuitArcs
│   └── viz/          IpFlow, CircuitTimeline, PacketFlow, RelayCard
├── context/          Settings (sound, reduced motion), Destination
├── hooks/            useCircuit, useLenis, useInView, useTilt
├── lib/              Relay simulation, circuit paths, geo, IP utils
├── sections/         All 15 teaching sections + Hero
└── App.tsx           Composition + lazy-loaded WebGL sections
```

---

## Accessibility & Performance

- **Reduced motion** — respects `prefers-reduced-motion` and offers an in-app toggle
- **Keyboard** — skip link, focus styles, ARIA labels, semantic landmarks
- **Performance** — heavy WebGL sections are code-split; globes pause rendering when off-screen
- **Responsive** — desktop, tablet, and mobile layouts

---

## Theme

| Token         | Value     |
| ------------- | --------- |
| Background    | `#050816` |
| Cards         | `#0E1324` |
| Accent Blue   | `#3B82F6` |
| Accent Purple | `#8B5CF6` |
| Accent Cyan   | `#22D3EE` |
| Guard relay   | `#34D399` |
| Middle relay  | `#A78BFA` |
| Exit relay    | `#F87171` |

---

## Intended Audience

- Cybersecurity and networking students
- University instructors demonstrating Tor in lectures or labs
- Privacy advocates explaining onion routing to non-technical audiences
- Developers learning React, Three.js, and data visualization patterns

---

## Learn More

- [The Tor Project](https://www.torproject.org/)
- [Tor Metrics](https://metrics.torproject.org/)

---

## Disclaimer

TorScope exists to explain network routing, anonymity, and privacy. Anonymity tools protect journalists, researchers, whistleblowers, and ordinary people. Use such tools **responsibly and legally**. Nothing here endorses or facilitates illegal activity.

All data in this dashboard is **simulated for education**. Do not treat displayed IPs, relays, or circuits as real network telemetry.

---

## License

Add your preferred license before publishing (e.g. MIT).
