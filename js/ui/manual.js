// js/ui/manual.js — Technical Orders Viewer

window.F14Manual = (function() {

  const sections = [
    { section: 'Flight Manual', items: [
      { title: 'Limitations', id: 'lim' },
      { title: 'Normal Procedures', id: 'np' },
      { title: 'Emergency Procedures', id: 'emg' },
      { title: 'Performance', id: 'perf' },
    ]},
    { section: 'Systems', items: [
      { title: 'Power Plant (J79)', id: 'eng' },
      { title: 'Fuel System', id: 'fuel' },
      { title: 'Hydraulic System', id: 'hyd' },
      { title: 'Electrical System', id: 'elec' },
      { title: 'Environmental Control', id: 'ecs' },
    ]},
    { section: 'Avionics', items: [
      { title: 'AN/AWG-9 Radar', id: 'radar' },
      { title: 'Fire Control (IDA)', id: 'ida' },
      { title: 'Navigation Systems', id: 'nav' },
      { title: 'Communication', id: 'comm' },
      { title: 'Identification', id: 'iff' },
    ]},
    { section: 'Weapon Systems', items: [
      { title: 'AIM-54 Phoenix', id: 'phnx' },
      { title: 'AIM-9 Sidewinder', id: 'sw' },
      { title: 'AIM-7 Sparrow', id: 'sprw' },
      { title: 'M61A1 Gun System', id: 'gun' },
      { title: 'Stores Management', id: 'stores' },
    ]},
    { section: 'Carrier Operations', items: [
      { title: 'Catapult Launch', id: 'cat' },
      { title: 'Carrier Approach', id: 'trap' },
      { title: 'Bolter & Waveoff', id: 'bolter' },
      { title: 'LSO Signals', id: 'lso' },
    ]},
  ];

  const content = {
    lim: `<h3>Flight Limitations</h3>
<p>Never exceed structural limits. Know your aircraft weight at all times.</p>
<ul>
<li><strong>Max Speed:</strong> Mach 2.34 (altitude dependent)</li>
<li><strong>G Limits:</strong> +7.5 / -2.0 at max takeoff weight; +6.0 / -2.0 at max landing weight</li>
<li><strong>Never Exceed Speed:</strong> 600 kts IAS</li>
<li><strong>Landing Gear Extension:</strong> Below 250 kts IAS</li>
<li><strong>Flaps:</strong> 0°–35°, below 250 kts</li>
<li><strong>Airbrake:</strong> Below 350 kts</li>
<li><strong>Wing Sweep:</strong> 20°–68° — never operate between 20° and 28° during carrier ops</li>
<li><strong>Max Takeoff Weight:</strong> 74,350 lb</li>
<li><strong>Max Landing Weight:</strong> 52,000 lb</li>
<li><strong>Carrier Launch Weight:</strong> 61,000 lb typical</li>
<li><strong>Max Crosswind:</strong> 40 kts</li>
</ul>`,

    np: `<h3>Normal Procedures</h3>
<h4>Before Start</h4>
<ul>
<li>Complete ALL preflight inspection items — F-14 is complex</li>
<li>Verify fuel quantity, confirm fuel type (JP-4/5/8 compatible)</li>
<li>Check hydraulic fluid (3 systems), engine oil (7.5 qt each)</li>
<li>Confirm landing gear pin removed</li>
<li>Canopy: verify full open/close cycle</li>
</ul>
<h4>Engine Start</h4>
<ul>
<li>Start No. 1 engine (left) first</li>
<li>GPU or APU required for battery start</li>
<li>Monitor N1/N2 RPM, EGT during start</li>
<li>Do not exceed EGT limits during light-off</li>
<li>Allow 10 seconds between starting engines</li>
</ul>
<h4>Before Takeoff</h4>
<ul>
<li>Wing sweep: 20° for carrier, 28° for land</li>
<li>Flaps: SET for mission</li>
<li>Slats: auto-deploy below 30° AOA</li>
<li>Trim: set nose-heavy for catapult / neutral for land</li>
<li>Afterburner: test fire No. 1, then No. 2 — monitor EGT</li>
</ul>`,

    emg: `<h3>Emergency Procedures</h3>
<h4>Engine Failure (Takeoff)</h4>
<ul>
<li>ABORT if below cat shot speed — maximum braking</li>
<li>If airborne: maintain minimum control speed (Vr + 10)</li>
<li>Gear up if single engine failure post-rotation</li>
<li>Declare emergency: "F-14 single engine, request immediate approach"</li>
</ul>
<h4>Hydraulic Failure</h4>
<ul>
<li>System 1 or 2 failure: remaining system sustains flight controls</li>
<li>System 3 failure: gear extension via emergency gravity, manual brakes</li>
<li>All three systems: emergency extension handles for gear</li>
<li>Flight controls remain operative but degraded</li>
</ul>
<h4>Birdstrike</h4>
<ul>
<li>Assess damage — canopy, engine(s), flight controls</li>
<li>If engine severe damage: feather, shut down</li>
<li>Declare emergency, request landing priority</li>
</ul>`,

    perf: `<h3>Performance Data</h3>
<table class="data-table">
<tr><td class="td-label">Max Level Speed (MIL)</td><td class="td-value">Mach 1.6</td></tr>
<tr><td class="td-label">Max Level Speed (AB)</td><td class="td-value">Mach 2.34</td></tr>
<tr><td class="td-label">Service Ceiling</td><td class="td-value">60,000 ft</td></tr>
<tr><td class="td-label">Rate of Climb (SL, AB)</td><td class="td-value">45,000 ft/min</td></tr>
<tr><td class="td-label">Carrier Takeoff (catapult)</td><td class="td-value">290 ft</td></tr>
<tr><td class="td-label">Carrier Landing</td><td class="td-value">350 ft (touchdown zone)</td></tr>
<tr><td class="td-label">Combat Radius (4× Phoenix)</td><td class="td-value">840 nm</td></tr>
<tr><td class="td-label">Max Sustained Turn Rate</td><td class="td-value">12.5°/sec at Mach 0.9 / 15kft</td></tr>
</table>`,

    radar: `<h3>AN/AWG-9 Radar Operations</h3>
<h4>Mode Selection</h4>
<p>Mode selection via throttle paddle switch or ICP keyboard. Mode automatically selected based on threat geometry and range.</p>
<ul>
<li><strong>STT:</strong> Select ONE target. Full radar power dedicated. Manual or auto lock. Max range 115 nm.</li>
<li><strong>TWS:</strong> Scans and tracks up to 24 targets. Auto-priority ranking. Medium PRF. Range 100 nm.</li>
<li><strong>RWS:</strong> Range-while-scan. Lower PRF for maximum range (200 nm). No track files maintained.</li>
<li><strong>ACM:</strong> Auto acquisition mode. 30° cone, 10° cone, or boresight. Instant lock. Range 20 nm.</li>
</ul>
<h4>IFF Integration</h4>
<p>IFF Mode 4 challenge automatic with radar contact. Mode C altitude reporting. Mode 1/2 selective identification.</p>`,

    phnx: `<h3>AIM-54 Phoenix — Employment</h3>
<h4>Launch Sequence</h4>
<ol>
<li>Radar contacts target, generates track file in TWS</li>
<li>Phoenix selected via weapons system selector (priority 1–6)</li>
<li>RIO verifies track quality, authorizes weapons release</li>
<li>Pilot presses trigger — missile launches</li>
<li>Data link updates every 2 seconds from AWG-9</li>
<li>At ~15 nm: missile transitions to terminal guidance</li>
<li>CW illuminator locks target for terminal SARH</li>
<li>Warhead detonates proximity or direct impact</li>
</ol>
<h4>Limitations</h4>
<ul>
<li>Minimum range: 3 nm — missile cannot guide inside this envelope</li>
<li>Target must be in radar lock for terminal phase</li>
<li>Illuminator required for terminal guidance — blocks simultaneous multi-target engagement</li>
<li>Engagement envelope highly dependent on altitude and target aspect</li>
</ul>`,

    cat: `<h3>Catapult Launch Procedures</h3>
<h4>Pre-Launch</h4>
<ul>
<li>Flyplane bars SET by catapult officer</li>
<li>Launch bar extended, catapult shuttle engaged</li>
<li>Hold brakes, run engines to MIL or AB as briefed</li>
<li>CDC (Catapult Decision Course) aligned with end of stroke</li>
<li>Hold handle — await catapult officer signal</li>
</ul>
<h4>Launch</h4>
<ul>
<li>Catapult officer: "launch signal given"</li>
<li>Apply full afterburner (or MIL per briefing)</li>
<li>Catapult fires — acceleration ~4G</li>
<li>At end of stroke: rotate nose to +15° immediately</li>
<li>Positive rate of climb: raise landing gear</li>
<li>Below 250 kts: extend wing sweep to mission setting</li>
</ul>
<h4>Bolter Procedure</h4>
<ul>
<li>If miss arresting gear: GO AROUND</li>
<li>Apply full AB, pitch up to 15°</li>
<li>Raise gear below 250 kts</li>
<li>Level off, clean up aircraft</li>
<li>Declare: "Bolter, request recover"</li>
</ul>`,
  };

  function init() {
    const toc = document.getElementById('manualTOC');
    if (!toc) return;

    let html = '';
    sections.forEach(sec => {
      html += `<div class="mtoc-section">${sec.section}</div>`;
      sec.items.forEach(item => {
        html += `<div class="mtoc-entry" data-id="${item.id}">${item.title}</div>`;
      });
    });
    toc.innerHTML = html;

    // Click handlers
    toc.querySelectorAll('.mtoc-entry').forEach(el => {
      el.addEventListener('click', () => {
        toc.querySelectorAll('.mtoc-entry').forEach(e => e.classList.remove('active'));
        el.classList.add('active');
        showSection(el.dataset.id);
      });
    });

    // Show first section
    showSection('lim');
  }

  function showSection(id) {
    const contentEl = document.getElementById('manualContent');
    if (!contentEl) return;
    contentEl.innerHTML = content[id] || `<p style="color:var(--text3)">Section ${id} — content under development.</p>`;
  }

  return { init };
})();
