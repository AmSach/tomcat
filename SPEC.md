# F-14 Tomcat Digital Twin — SPEC

## Concept & Vision

A complete, locally-run interactive digital twin of the Grumman F-14A/B Tomcat — "the last of the beautiful ones." Preserves the complete technical memory of the aircraft as a living, explorable database and simulation. Browser-based, zero-install, works offline. Designed for aerospace enthusiasts, modelers, historians, and anyone who wants to keep this machine alive in digital form.

**Tagline:** "Every rivet. Every system. Still flying."

---

## Design Language

- **Aesthetic:** Military aerospace meets 1970s analog cockpit. Dark olive/tan cockpit interior colors, radar green phosphor displays, high-contrast instrument panels.
- **Color palette:**
  - Background: `#0a0c0f` (near-black with slight blue)
  - Panel: `#1a1f14` (dark olive)
  - Accent: `#4ade80` (radar phosphor green)
  - Warning: `#f97316` (orange)
  - Danger: `#ef4444` (red)
  - Text primary: `#e2e8f0`
  - Text secondary: `#94a3b8`
  - Highlight: `#fbbf24` (amber — caution lights)
- **Typography:** `JetBrains Mono` for instruments, `Roboto Condensed` for labels, `Oswald` for titles
- **Motion:** Subtle, purposeful — instruments animate smoothly, panels slide, no bouncy effects

---

## Architecture

### File Structure
```
f14-tomcat-twin/
  index.html          — Entry point
  SPEC.md             — This file
  css/
    main.css          — Global styles, cockpit aesthetic
    instruments.css   — Instrument panel styles
    panels.css        — Side panel styles
  js/
    data/
      airframe.js     — Dimensions, materials, structure
      engines.js      — J79-GE-400 engine data + performance curves
      avionics.js     — AN/AWG-9, IDA, ASG-23, etc.
      weapons.js      — AIM-54, AIM-9, AIM-7, GAU-15/A
      flight.js       — Performance envelopes, envelopes, G-limits
      history.js      — Service history, variants, records
    core/
      sim.js          — Physics engine: aerodynamics, fuel, swept-wing model
      radar.js        — AN/AWG-9 simulation
      missile.js       — AIM-54 Phoenix, AIM-9, AIM-7
      audio.js        — Web Audio synthesized engine/explosion sounds
    render/
      viewer3d.js     — Three.js F-14 3D model + interactive hotspots
      diagram.js      — SVG systems schematic
    ui/
      instruments.js  — Flight instruments: AOA, mach, G, fuel, etc.
      panels.js       — Side panel: weapons, radar, systems status
      nav.js          — Navigation: 3-view drawings, cutaway diagrams
      search.js       — Full-text search across all technical data
      manual.js       — Interactive technical orders viewer
```

### Data Architecture
All data in plain JS objects — no database, no build step. Data is structured for instant access via key lookups. Relations modeled explicitly (system → components → specs).

---

## Features & Interactions

### 1. 3D Interactive Tomcat Viewer
- Full 3D model built with Three.js (CDN)
- Variable-sweep wing: drag slider 20°→68°, wing animates in real-time
- Hotspot click: every major component clickable → info panel
- View modes: External, Cockpit (front seat), Cockpit (RIO seat), Carrier ops
- Toggle: landing gear up/down, flaps, slats, airbrake, canopy open/closed
- Mode: "Night CVW" — carrier landing lights, dark cockpit aesthetic

### 2. Technical Database (full depth)
- **Airframe:** Every dimension, material spec, structural load zones
- **Engines:** J79-GE-400 — thrust curves, fuel flow, RPM, EGT, spool rates
- **Avionics:** Every system — AN/AWG-9 radar modes, detection ranges, IDA computer specs
- **Weapons:** All missiles — dimensions, guidance type, warhead, range table, illumination requirements
- **Flight envelope:** V-n diagram, service ceiling, range chart, takeoff/landing distances
- **Variants:** A, B, D, AF, Tomcat prototype, and the 5 TOMCATZONE airframe survivors
- **History:** First flight, Vietnam ops, Iran operations, Grenada, Desert Storm, Kosovo, TOPGUN lineage

### 3. Variable-Sweep Wing Simulation
- Slider control: 20° (takeoff/landing) → 68° (high speed)
- Real physics: lift coefficient changes, drag changes, CG shift
- Visual: wing sweep animation with fairing movement
- Info: at each angle — max speed, turn rate, fuel consumption delta

### 4. AWG-9 Radar Simulator
- Mode selector: STT, TWS, RWS, ACM, MAP
- Simulated PPI (plan position indicator) display
- Track file management (up to 24 targets in TWS)
- Range scale selector
- Signal injection panel: add fake targets to see radar response

### 5. Phoenix Missile System
- Missile spec sheet with dimensions
- Engagement envelope: range vs altitude chart
- Guidance explanation (semi-active radar homing + mid-course data link)
- Simulated launch sequence timeline

### 6. Flight Instruments Panel
- Real-time simulated instruments based on current simulation state:
  - Airspeed indicator (knots / mach)
  - Altitude (barometric / radar)
  - Angle of Attack indicator (degrees)
  - G-meter (current / max)
  - Horizontal situation indicator (heading, waypoint)
  - Engine RPM, EGT, fuel flow gauges
  - Sweep wing angle indicator
  - Fuel quantity (internal + conformal tanks)
  - Landing gear / flap position

### 7. Systems Schematic (SVG)
- Interactive wiring/fluid schematic of:
  - Fuel system (7 tanks, feed lines, fueling valves)
  - Hydraulic system (3 subsystems)
  - Environmental control system (bleed air)
  - Oxygen system
- Click component → specs + failure modes

### 8. Full-Text Search
- Search all technical data, specs, history, weapons data
- Instant results, clickable → relevant section

### 9. "Last Tomcat" Memorial
- Tribute to all 5 surviving airframes
- Interactive gallery of rare photos (Unsplash API or embedded base64 thumbs)
- Serial numbers, last flights, current locations
- "TOMCATZONE" — the 5 airframe survivors list

---

## Components

### Header Bar
- "F-14 TOMCAT" in large Oswald font, amber color
- Subtitle: "Digital Twin — Preserving the Legend"
- Navigation: 3D VIEW | SYSTEMS | WEAPONS | HISTORY | SIMULATION | MANUAL
- Search icon (opens global search)

### 3D Viewer Panel
- Three.js canvas — full panel width
- Control bar: view mode buttons, wing sweep slider, gear/flap toggles
- Hotspot labels appear on hover
- Info panel slides in from right on component click

### Side Panels
- Tabbed: DIMENSIONS | ENGINES | RADAR | WEAPONS | FLIGHT DATA
- Scrollable data tables
- Each spec row expandable for full detail

### Bottom Instrument Strip
- Fixed bar with key real-time simulation gauges
- Smaller footprint, always visible

### Footer
- "Built with respect for a legend"
- Serial/date stamp

---

## Technical Approach

- **Pure HTML/CSS/JS** — no build step, runs from file:// or any web server
- **Three.js** via CDN for 3D — single import, works offline after first load
- **Web Audio API** — synthesized engine sounds (no audio files needed)
- **SVG** — inline SVG for schematics and diagrams
- **LocalStorage** — save simulation state, favorite configs
- **CSS Variables** — all theming via variables for easy cockpit color scheme
- **No external API calls** — fully self-contained, works in airplane mode

---

## 3D Model Approach

Since we cannot load an external .glb model file, the F-14 will be constructed from Three.js primitives:
- Fuselage: multiple merged CylinderGeometry + SphereGeometry shapes
- Wings: BoxGeometry (with pivot point for sweep)
- Vertical stabilizers: BoxGeometry, angled
- Engine nacelles: CylinderGeometry under wing
- Canopy: transparent SphereGeometry (front portion)
-cockpit interior: simple geometry visible in cockpit view

Approximate scale: 1 unit = 1 foot. Real F-14 is 62.8ft span, 19.1ft height.

**Wing pivot:** wings rotate around a point 25% chord, sweep axis. Animation via TWEEN.js or manual lerp.

---

## F-14 Technical Data (canonical sources)

### Dimensions
- Length: 62.8 ft (19.1 m)
- Height: 16.0 ft (4.88 m)
- Wingspan: 64.0 ft (19.5 m) — spread; 38.0 ft (11.6 m) — fully swept
- Wing area: 565 sq ft (52.5 m²)
- Sweep angle: 20° (takeoff) to 68° (high speed)
- Empty weight: 39,900 lb (18,100 kg)
- Gross weight: 61,000 lb (27,700 kg) — carrier launch
- Max takeoff: 74,350 lb (33,725 kg)

### Performance
- Max speed: Mach 2.34 (1,550 mph / 2,490 km/h) at altitude
- Service ceiling: 60,000 ft (18,300 m)
- Range: 1,840 mi (2,960 km) — clean, internal fuel; 2,050 mi with conformal tanks
- Rate of climb: 45,000 ft/min (229 m/s)
- G limits: +7.5 / -2.0 (combat), +6.0 (carrier landing)

### Engines (x2)
- General Electric J79-GE-400A
- Thrust: 15,600 lb st dry; 23,500 lb st with afterburner (each)
- Bypass ratio: 0.20
- Weight: 3,560 lb (each)
- Length: 158.5 in (4.03 m)
- Max RPM: 11,095
- EGT max: 1,185°F (637°C) in AB
- Spool-up time: ~4 sec to full AB

### Avionics (AN/AWG-9)
- Pulse-Doppler radar
- Modes: STT, TWS, RWS, ACM, MAP, Sea
- Range: 200+ nm (target detection)
- Track capability: 24 targets (TWS), 1 target (STT)
- ECCM: built-in

### Weapons
- AIM-54 Phoenix:
  - Length: 13.0 ft (3.96 m)
  - Diameter: 15 in (380 mm)
  - Weight: 1,520 lb (690 kg)
  - Warhead: 135 lb (61 kg) blast-fragmentation
  - Range: 100 nm (184 km) — launch and leave
  - Speed: Mach 5
  - Guidance: mid-course from AWG-9 + terminal semi-active radar homing
  - First used in combat: 1981

- AIM-9 Sidewinder:
  - Length: 9.5 ft (2.87 m)
  - Weight: 188 lb (85 kg)
  - Range: 10 nm (18 km)
  - Speed: Mach 2.5+
  - Guidance: infrared homing

- AIM-7 Sparrow:
  - Length: 12.0 ft (3.66 m)
  - Weight: 500 lb (227 kg)
  - Range: 24 nm (45 km)
  - Speed: Mach 4+
  - Guidance: semi-active radar homing

- GAU-15/A (M61A1 Vulcan):
  - 20mm rotary cannon
  - Rate of fire: 6,000 rpm
  - Ammunition: 600 rounds (150 per gun x4 barrels)
