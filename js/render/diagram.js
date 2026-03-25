// js/render/diagram.js — SVG Systems Schematic Renderer

window.F14Diagram = (function() {

  // ── Fuel System SVG ──────────────────────────────────────────
  function renderFuelSystem() {
    return `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#4ade80"/>
        </marker>
      </defs>
      <!-- Title -->
      <text x="400" y="25" text-anchor="middle" fill="#fbbf24" font-family="Oswald" font-size="16" letter-spacing="3">FUEL SYSTEM — F-14 TOMCAT</text>
      <!-- Tank outlines -->
      <rect x="200" y="60" width="80" height="50" rx="4" fill="none" stroke="#4ade80" stroke-width="1.5"/>
      <text x="240" y="82" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="10">TANK 1</text>
      <text x="240" y="95" text-anchor="middle" fill="#4ade80" font-family="JetBrains Mono" font-size="9">640 GAL</text>

      <rect x="310" y="60" width="80" height="50" rx="4" fill="none" stroke="#4ade80" stroke-width="1.5"/>
      <text x="350" y="82" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="10">TANK 2</text>
      <text x="350" y="95" text-anchor="middle" fill="#4ade80" font-family="JetBrains Mono" font-size="9">570 GAL</text>

      <rect x="420" y="60" width="80" height="50" rx="4" fill="none" stroke="#4ade80" stroke-width="1.5"/>
      <text x="460" y="82" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="10">TANK 3</text>
      <text x="460" y="95" text-anchor="middle" fill="#4ade80" font-family="JetBrains Mono" font-size="9">630 GAL</text>

      <!-- Wing tanks -->
      <rect x="150" y="180" width="80" height="40" rx="4" fill="none" stroke="#22c55e" stroke-width="1.5"/>
      <text x="190" y="197" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="9">TANK 4 L</text>
      <text x="190" y="210" text-anchor="middle" fill="#22c55e" font-family="JetBrains Mono" font-size="9">490 GAL</text>

      <rect x="570" y="180" width="80" height="40" rx="4" fill="none" stroke="#22c55e" stroke-width="1.5"/>
      <text x="610" y="197" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="9">TANK 5 R</text>
      <text x="610" y="210" text-anchor="middle" fill="#22c55e" font-family="JetBrains Mono" font-size="9">490 GAL</text>

      <!-- Outer wing tanks -->
      <rect x="100" y="260" width="60" height="35" rx="3" fill="none" stroke="#94a3b8" stroke-width="1"/>
      <text x="130" y="275" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="8">TANK 6L</text>
      <text x="130" y="287" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="8">255 GAL</text>

      <rect x="640" y="260" width="60" height="35" rx="3" fill="none" stroke="#94a3b8" stroke-width="1"/>
      <text x="670" y="275" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="8">TANK 7R</text>
      <text x="670" y="287" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="8">255 GAL</text>

      <!-- Conformal tanks -->
      <rect x="300" y="310" width="100" height="35" rx="3" fill="none" stroke="#fbbf24" stroke-width="1"/>
      <text x="350" y="326" text-anchor="middle" fill="#fbbf24" font-family="JetBrains Mono" font-size="9">CONFORMAL L+R</text>
      <text x="350" y="338" text-anchor="middle" fill="#fbbf24" font-family="JetBrains Mono" font-size="9">870 GAL TOTAL</text>

      <!-- Feed lines -->
      <line x1="240" y1="110" x2="240" y2="140" stroke="#4ade80" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="350" y1="110" x2="350" y2="140" stroke="#4ade80" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="460" y1="110" x2="460" y2="140" stroke="#4ade80" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="190" y1="180" x2="190" y2="150" stroke="#22c55e" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="610" y1="180" x2="610" y2="150" stroke="#22c55e" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="130" y1="260" x2="130" y2="220" stroke="#94a3b8" stroke-width="1" marker-end="url(#arrow)"/>
      <line x1="670" y1="260" x2="670" y2="220" stroke="#94a3b8" stroke-width="1" marker-end="url(#arrow)"/>

      <!-- Feed manifold -->
      <line x1="190" y1="150" x2="610" y2="150" stroke="#4ade80" stroke-width="2"/>
      <line x1="240" y1="140" x2="240" y2="150" stroke="#4ade80" stroke-width="2"/>
      <line x1="350" y1="140" x2="350" y2="150" stroke="#4ade80" stroke-width="2"/>
      <line x1="460" y1="140" x2="460" y2="150" stroke="#4ade80" stroke-width="2"/>

      <!-- Engine feeds -->
      <line x1="240" y1="180" x2="240" y2="220" stroke="#4ade80" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="460" y1="180" x2="460" y2="220" stroke="#4ade80" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="240" y1="220" x2="200" y2="250" stroke="#4ade80" stroke-width="1" marker-end="url(#arrow)"/>
      <line x1="460" y1="220" x2="500" y2="250" stroke="#4ade80" stroke-width="1" marker-end="url(#arrow)"/>

      <!-- Engines -->
      <rect x="160" y="250" width="60" height="30" rx="3" fill="none" stroke="#ef4444" stroke-width="1.5"/>
      <text x="190" y="268" text-anchor="middle" fill="#ef4444" font-family="JetBrains Mono" font-size="9">ENG 1</text>

      <rect x="580" y="250" width="60" height="30" rx="3" fill="none" stroke="#ef4444" stroke-width="1.5"/>
      <text x="610" y="268" text-anchor="middle" fill="#ef4444" font-family="JetBrains Mono" font-size="9">ENG 2</text>

      <!-- Refueling port -->
      <circle cx="400" cy="200" r="15" fill="none" stroke="#fbbf24" stroke-width="1.5"/>
      <text x="400" y="203" text-anchor="middle" fill="#fbbf24" font-family="JetBrains Mono" font-size="8">REFUEL</text>
      <line x1="400" y1="185" x2="400" y2="150" stroke="#fbbf24" stroke-width="1" marker-end="url(#arrow)"/>

      <!-- Total -->
      <text x="400" y="375" text-anchor="middle" fill="#e2e8f0" font-family="JetBrains Mono" font-size="11">TOTAL CAPACITY: 3,685 GAL | 36,485 LB | RANGE: 1,840 NM (CLEAN)</text>

      <!-- Legend -->
      <rect x="20" y="340" width="12" height="12" fill="none" stroke="#4ade80" stroke-width="1.5"/>
      <text x="40" y="350" fill="#94a3b8" font-family="Roboto Condensed" font-size="10">Fuselage Tanks</text>
      <rect x="20" y="358" width="12" height="12" fill="none" stroke="#22c55e" stroke-width="1.5"/>
      <text x="40" y="368" fill="#94a3b8" font-family="Roboto Condensed" font-size="10">Main Wing Tanks</text>
      <rect x="20" y="376" width="12" height="12" fill="none" stroke="#94a3b8" stroke-width="1"/>
      <text x="40" y="386" fill="#94a3b8" font-family="Roboto Condensed" font-size="10">Auxiliary Tanks</text>
    </svg>`;
  }

  // ── Hydraulic System SVG ────────────────────────────────────
  function renderHydraulicSystem() {
    return `
    <svg viewBox="0 0 800 380" xmlns="http://www.w3.org/2000/svg">
      <text x="400" y="25" text-anchor="middle" fill="#fbbf24" font-family="Oswald" font-size="16" letter-spacing="3">HYDRAULIC SYSTEM — F-14 TOMCAT</text>

      <!-- System boxes -->
      <rect x="50" y="60" width="160" height="60" rx="4" fill="none" stroke="#4ade80" stroke-width="1.5"/>
      <text x="130" y="80" text-anchor="middle" fill="#4ade80" font-family="JetBrains Mono" font-size="11">SYSTEM 1</text>
      <text x="130" y="95" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="9">3000 PSI</text>
      <text x="130" y="108" text-anchor="middle" fill="#94a3b8" font-family="Roboto Condensed" font-size="9">Primary Flight Controls</text>

      <rect x="250" y="60" width="160" height="60" rx="4" fill="none" stroke="#22c55e" stroke-width="1.5"/>
      <text x="330" y="80" text-anchor="middle" fill="#22c55e" font-family="JetBrains Mono" font-size="11">SYSTEM 2</text>
      <text x="330" y="95" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="9">3000 PSI</text>
      <text x="330" y="108" text-anchor="middle" fill="#94a3b8" font-family="Roboto Condensed" font-size="9">Primary Flight Controls (B/U)</text>

      <rect x="450" y="60" width="160" height="60" rx="4" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="530" y="80" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="11">SYSTEM 3</text>
      <text x="530" y="95" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="9">3000 PSI</text>
      <text x="530" y="108" text-anchor="middle" fill="#94a3b8" font-family="Roboto Condensed" font-size="9">Gear / Brakes / Aux</text>

      <!-- Pumps -->
      <rect x="50" y="160" width="80" height="40" rx="3" fill="none" stroke="#ef4444" stroke-width="1.5"/>
      <text x="90" y="178" text-anchor="middle" fill="#ef4444" font-family="JetBrains Mono" font-size="9">EDP 1</text>
      <text x="90" y="192" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="8">14.5 GPM</text>

      <rect x="250" y="160" width="80" height="40" rx="3" fill="none" stroke="#ef4444" stroke-width="1.5"/>
      <text x="290" y="178" text-anchor="middle" fill="#ef4444" font-family="JetBrains Mono" font-size="9">EDP 2</text>
      <text x="290" y="192" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="8">14.5 GPM</text>

      <rect x="450" y="160" width="80" height="40" rx="3" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="490" y="178" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="9">ACMP</text>
      <text x="490" y="192" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="8">5 GPM ELEC</text>

      <!-- Reservoirs -->
      <rect x="650" y="60" width="100" height="80" rx="4" fill="none" stroke="#fbbf24" stroke-width="1.5"/>
      <text x="700" y="85" text-anchor="middle" fill="#fbbf24" font-family="JetBrains Mono" font-size="10">RESERVOIR</text>
      <text x="700" y="100" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="8">6 GAL EACH</text>
      <text x="700" y="115" text-anchor="middle" fill="#94a3b8" font-family="Roboto Condensed" font-size="8">MIL-H-5606</text>

      <!-- Lines -->
      <line x1="90" y1="120" x2="90" y2="160" stroke="#4ade80" stroke-width="1.5"/>
      <line x1="290" y1="120" x2="290" y2="160" stroke="#22c55e" stroke-width="1.5"/>
      <line x1="490" y1="120" x2="490" y2="160" stroke="#94a3b8" stroke-width="1.5"/>

      <!-- Actuators -->
      <rect x="150" y="240" width="100" height="30" rx="3" fill="none" stroke="#4ade80" stroke-width="1"/>
      <text x="200" y="259" text-anchor="middle" fill="#94a3b8" font-family="Roboto Condensed" font-size="9">Stabilator Actuator</text>

      <rect x="300" y="240" width="100" height="30" rx="3" fill="none" stroke="#4ade80" stroke-width="1"/>
      <text x="350" y="259" text-anchor="middle" fill="#94a3b8" font-family="Roboto Condensed" font-size="9">Wing Sweep Actuator</text>

      <rect x="450" y="240" width="100" height="30" rx="3" fill="none" stroke="#22c55e" stroke-width="1"/>
      <text x="500" y="259" text-anchor="middle" fill="#94a3b8" font-family="Roboto Condensed" font-size="9">Rudder Actuator</text>

      <rect x="600" y="240" width="100" height="30" rx="3" fill="none" stroke="#94a3b8" stroke-width="1"/>
      <text x="650" y="259" text-anchor="middle" fill="#94a3b8" font-family="Roboto Condensed" font-size="9">Landing Gear (x3)</text>

      <!-- Emergency -->
      <rect x="320" y="300" width="160" height="50" rx="4" fill="none" stroke="#f97316" stroke-width="1.5"/>
      <text x="400" y="320" text-anchor="middle" fill="#f97316" font-family="JetBrains Mono" font-size="10">EMERGENCY</text>
      <text x="400" y="335" text-anchor="middle" fill="#94a3b8" font-family="Roboto Condensed" font-size="9">1000 PSI | Gravity Extension</text>
      <text x="400" y="350" text-anchor="middle" fill="#94a3b8" font-family="Roboto Condensed" font-size="8">Manual release for gear</text>
    </svg>`;
  }

  return { renderFuelSystem, renderHydraulicSystem };
})();
