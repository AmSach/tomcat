// js/ui/panels.js — Systems / Weapons / History panel content

window.F14Panels = (function() {

  function renderDimensions() {
    const d = window.F14_AIRFRAME.generalDimensions;
    return `
      <div class="spec-block">
        <h3>General Dimensions</h3>
        <table class="data-table">
          <tr><td class="td-label">Length</td><td>${d.length.value} ${d.length.unit} <span class="td-value">${d.length.meter} m</span></td></tr>
          <tr><td class="td-label">Height</td><td>${d.height.value} ${d.height.unit} <span class="td-value">${d.height.meter} m</span></td></tr>
          <tr><td class="td-label">Wingspan (spread)</td><td>${d.wingspanSpread.value} ${d.wingspanSpread.unit} <span class="td-value">${d.wingspanSpread.meter} m</span></td></tr>
          <tr><td class="td-label">Wingspan (swept)</td><td>${d.wingspanSwept.value} ${d.wingspanSwept.unit} <span class="td-value">${d.wingspanSwept.meter} m</span></td></tr>
          <tr><td class="td-label">Wing Area</td><td>${d.wingArea.value} ${d.wingArea.unit} <span class="td-value">${d.wingArea.sqMeter} m²</span></td></tr>
          <tr><td class="td-label">Wing Sweep Range</td><td>${d.wingSweepRange.min}° – ${d.wingSweepRange.max}°</td></tr>
          <tr><td class="td-label">Tail Span</td><td>${d.tailSpan.value} ${d.tailSpan.unit}</td></tr>
        </table>
      </div>
      <div class="spec-block">
        <h3>Weights</h3>
        <table class="data-table">
          <tr><td class="td-label">Empty Weight</td><td class="td-value">${window.F14_AIRFRAME.weight.empty.value.toLocaleString()} ${window.F14_AIRFRAME.weight.empty.unit}</td></tr>
          <tr><td class="td-label">Normal Takeoff</td><td class="td-value">${window.F14_AIRFRAME.weight.normalTakeoff.value.toLocaleString()} ${window.F14_AIRFRAME.weight.normalTakeoff.unit}</td></tr>
          <tr><td class="td-label">Max Takeoff</td><td class="td-value">${window.F14_AIRFRAME.weight.maxTakeoff.value.toLocaleString()} ${window.F14_AIRFRAME.weight.maxTakeoff.unit}</td></tr>
          <tr><td class="td-label">Max Fuel</td><td class="td-value">${window.F14_AIRFRAME.weight.fuelMax.value.toLocaleString()} ${window.F14_AIRFRAME.weight.fuelMax.unit}</td></tr>
          <tr><td class="td-label">Max Armament</td><td class="td-value">${window.F14_AIRFRAME.weight.armamentMax.value.toLocaleString()} ${window.F14_AIRFRAME.weight.armamentMax.unit}</td></tr>
        </table>
      </div>`;
  }

  function renderEngines() {
    const e = window.F14_ENGINES.general;
    return `
      <div class="spec-block">
        <h3>J79-GE-400A Turbojet</h3>
        <p>Twin General Electric J79-GE-400A axial-flow turbojet engines with afterburner. Each producing ${e.totalDryThrust.value.toLocaleString()} lbf dry and ${e.totalABThrust.value.toLocaleString()} lbf with afterburner.</p>
        <table class="data-table">
          <tr><td class="td-label">Type</td><td>${e.type}</td></tr>
          <tr><td class="td-label">Dry Thrust (each)</td><td class="td-value">${e.totalDryThrust.value.toLocaleString()} lbf</td></tr>
          <tr><td class="td-label">AB Thrust (each)</td><td class="td-value">${e.totalABThrust.value.toLocaleString()} lbf</td></tr>
          <tr><td class="td-label">Bypass Ratio</td><td class="td-value">${e.bypassRatio}</td></tr>
          <tr><td class="td-label">Overall Pressure Ratio</td><td class="td-value">${e.overallPressureRatio}:1</td></tr>
          <tr><td class="td-label">Max EGT</td><td class="td-value">${e.egtMax.value}°F</td></tr>
          <tr><td class="td-label">Length</td><td class="td-value">${window.F14_ENGINES.dimensions.length.value}" / ${window.F14_ENGINES.dimensions.length.meter} m</td></tr>
          <tr><td class="td-label">Weight (each)</td><td class="td-value">${window.F14_ENGINES.dimensions.weight.value.toLocaleString()} ${window.F14_ENGINES.dimensions.weight.unit}</td></tr>
        </table>
      </div>
      <div class="spec-block">
        <h3>Performance Table</h3>
        <table class="data-table">
          <thead><tr><th>ALT</th><th>MACH</th><th>THRUST</th><th>EGT °F</th><th>MODE</th></tr></thead>
          <tbody>
            ${window.F14_ENGINES.performanceTable.slice(0,5).map(r => `
              <tr><td>${r.altitudeFt.toLocaleString()} ft</td><td>${r.mach}</td><td class="td-value">${r.thrust}</td><td class="td-value">${r.egtF}</td><td>${r.ab ? 'AB' : 'MIL'}</td></tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  }

  function renderAvionics() {
    const r = window.F14_AVIONICS.radar;
    return `
      <div class="spec-block">
        <h3>AN/AWG-9 Radar</h3>
        <p>X-band pulse-Doppler radar with multiple engagement modes. Capable of tracking up to 24 targets simultaneously in TWS mode.</p>
        <table class="data-table">
          <tr><td class="td-label">Type</td><td>${r.type}</td></tr>
          <tr><td class="td-label">Peak Power</td><td class="td-value">${r.peakPower.value} ${r.peakPower.unit}</td></tr>
          <tr><td class="td-label">Frequency</td><td class="td-value">${r.frequency}</td></tr>
          <tr><td class="td-label">Range Scales</td><td class="td-value">${r.rangeScales.join(', ')} nm</td></tr>
        </table>
        <h4 style="color:var(--accent);margin:12px 0 6px">Modes</h4>
        ${r.modes.map(m => `
          <div style="margin-bottom:8px;padding:8px;background:var(--bg3);border-left:2px solid var(--accent);">
            <strong style="color:var(--amber)">[${m.code}]</strong> ${m.name}<br>
            <span style="font-size:11px;color:var(--text2)">${m.description}</span>
          </div>
        `).join('')}
      </div>`;
  }

  function renderFuelSystem() {
    const f = window.F14_AIRFRAME.structure.fuelSystem;
    return `
      <div class="spec-block">
        <h3>Fuel System</h3>
        <p>7 internal tanks plus 2 conformal tanks. Total capacity 36,485 lb (3,685 gal) of JP-4/JP-5/JP-8.</p>
        <div class="wd-diagram">${window.F14Diagram.renderFuelSystem()}</div>
      </div>
      <div class="spec-block">
        <h3>Tank Specifications</h3>
        <table class="data-table">
          <thead><tr><th>Tank</th><th>Capacity</th><th>Location</th></tr></thead>
          <tbody>
            ${f.tanks.map(t => `
              <tr>
                <td class="td-label">${t.name}</td>
                <td class="td-value">${t.capacityGal} gal</td>
                <td>${t.location}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  }

  function renderHydraulics() {
    return `
      <div class="spec-block">
        <h3>Hydraulic System</h3>
        <p>Three independent hydraulic subsystems at 3,000 psi. Any single system can maintain safe flight and landing.</p>
        <div class="wd-diagram">${window.F14Diagram.renderHydraulicSystem()}</div>
      </div>
      <div class="spec-block">
        <h3>System Details</h3>
        <table class="data-table">
          ${Object.entries({
            'System 1': window.F14_AIRFRAME.structure.hydraulics.system1,
            'System 2': window.F14_AIRFRAME.structure.hydraulics.system2,
            'System 3': window.F14_AIRFRAME.structure.hydraulics.system3,
            'Emergency Reserve': window.F14_AIRFRAME.structure.hydraulics.reserve,
          }).map(([name, s]) => `
            <tr><td class="td-label">${name}</td><td>${s.pressure} | ${s.fluid} | ${s.volume}</td><td>${s.purpose}</td></tr>
          `).join('')}
        </table>
      </div>`;
  }

  function renderStructural() {
    return `
      <div class="spec-block">
        <h3>Fuselage Structure</h3>
        <p>Semi-monocoque aluminum alloy construction. 16 station bulkheads with Z-section frames and 6 continuous longerons.</p>
        <table class="data-table">
          ${Object.entries(window.F14_AIRFRAME.structure.fuselage).map(([k, v]) =>
            typeof v === 'string' ? `<tr><td class="td-label">${k}</td><td>${v}</td></tr>` : ''
          ).join('')}
        </table>
      </div>
      <div class="spec-block">
        <h3>Wing Structure</h3>
        <p>Variable-sweep trapezoidal wing pivoting at 25% chord. 2-spar design with Z-section ribs. Automatic Krueger slats deploy below 30° AoA.</p>
        <table class="data-table">
          <tr><td class="td-label">Pivot Location</td><td>25% chord from leading edge root</td></tr>
          <tr><td class="td-label">Material</td><td class="td-value">Al 2024-T3 / Al 7075-T6</td></tr>
          <tr><td class="td-label">Wing Box Skin</td><td>0.020" to 0.040"</td></tr>
          <tr><td class="td-label">Slats</td><td>Krueger-type, auto-deployed</td></tr>
          <tr><td class="td-label">Flaps</td><td>Single-slotted, 0° to 35° deflection</td></tr>
        </table>
      </div>`;
  }

  function switchSystems(category) {
    const el = document.getElementById('systemsContent');
    if (!el) return;
    const renderers = {
      dimensions: renderDimensions,
      engines: renderEngines,
      avionics: renderAvionics,
      fuel: renderFuelSystem,
      hydraulics: renderHydraulics,
      structural: renderStructural,
    };
    const renderer = renderers[category] || renderers.dimensions;
    el.innerHTML = renderer();
  }

  // ── Weapons ──────────────────────────────────────────────
  function renderPhoenix() {
    const p = window.F14_WEAPONS.missiles.AIM54_PHOENIX;
    return `
      <div class="wd-header">
        <div class="wd-title">AIM-54 PHOENIX</div>
        <div class="wd-subtitle">Long-range air-to-air missile — NATO Codename: Phoenix</div>
      </div>
      <div class="wd-section">
        <h4>Specifications</h4>
        <div class="wd-stat-grid">
          <div class="wd-stat"><div class="ws-label">LENGTH</div><div class="ws-value">${p.length.value} ${p.length.unit}</div></div>
          <div class="wd-stat"><div class="ws-label">DIAMETER</div><div class="ws-value">${p.bodyDiameter.value}"</div></div>
          <div class="wd-stat"><div class="ws-label">WEIGHT</div><div class="ws-value">${p.weight.total.value} ${p.weight.total.unit}</div></div>
          <div class="wd-stat"><div class="ws-label">WARHEAD</div><div class="ws-value">${p.warhead.weight.value} ${p.warhead.weight.unit}</div></div>
          <div class="wd-stat"><div class="ws-label">SPEED</div><div class="ws-value">Mach ${p.speed.max.value}</div></div>
          <div class="wd-stat"><div class="ws-label">MAX RANGE</div><div class="ws-value">${p.range.max.value} ${p.range.max.unit}</div></div>
          <div class="wd-stat"><div class="ws-label">GUIDANCE</div><div class="ws-value">SARH + Data Link</div></div>
          <div class="wd-stat"><div class="ws-label">FIRST COMBAT USE</div><div class="ws-value">${p.firstUse}</div></div>
        </div>
      </div>
      <div class="wd-section">
        <h4>Engagement Sequence</h4>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${p.engagementSequence.map(s => `
            <div style="display:flex;gap:10px;align-items:flex-start">
              <span style="background:var(--amber);color:#000;font-size:10px;font-weight:700;padding:2px 6px;border-radius:2px;flex-shrink:0">${s.step}</span>
              <span style="color:var(--text2);font-size:12px">${s.action}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="wd-section">
        <h4>Engagement Probability Table</h4>
        <table class="range-table">
          <thead><tr><th>ALTITUDE</th><th>RANGE</th><th>P(kill)</th><th>NOTES</th></tr></thead>
          <tbody>
            ${p.engagementTable.map(r => `
              <tr><td>${r.altitudeFt.toLocaleString()} ft</td><td>${r.rangeNm} nm</td><td class="td-value">${(r.probability * 100).toFixed(0)}%</td><td>${r.notes}</td></tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  }

  function renderSidewinder() {
    const s = window.F14_WEAPONS.missiles.AIM9_SIDEWINDER;
    return `
      <div class="wd-header">
        <div class="wd-title">AIM-9 SIDEWINDER</div>
        <div class="wd-subtitle">Short-range infrared-homing air-to-air missile</div>
      </div>
      <div class="wd-stat-grid">
        <div class="wd-stat"><div class="ws-label">LENGTH</div><div class="ws-value">${s.length.value} ${s.length.unit}</div></div>
        <div class="wd-stat"><div class="ws-label">WEIGHT</div><div class="ws-value">${s.weight.total.value} ${s.weight.total.unit}</div></div>
        <div class="wd-stat"><div class="ws-label">MAX RANGE</div><div class="ws-value">${s.range.max.value} ${s.range.max.unit}</div></div>
        <div class="wd-stat"><div class="ws-label">GUIDANCE</div><div class="ws-value">Passive IR</div></div>
      </div>
      <p style="color:var(--text2);margin-top:12px;font-size:12px;line-height:1.6">
        Passive infrared homing. Requires target within seeker FOV. Launch zones determined by aspect angle and target heat signature. Effective within 6 nm. All-aspect capability on later models (L/M).
      </p>`;
  }

  function renderSparrow() {
    const s = window.F14_WEAPONS.missiles.AIM7_SPARROW;
    return `
      <div class="wd-header">
        <div class="wd-title">AIM-7 SPARROW</div>
        <div class="wd-subtitle">Medium-range semi-active radar homing missile</div>
      </div>
      <div class="wd-stat-grid">
        <div class="wd-stat"><div class="ws-label">LENGTH</div><div class="ws-value">${s.length.value} ${s.length.unit}</div></div>
        <div class="wd-stat"><div class="ws-label">WEIGHT</div><div class="ws-value">${s.weight.total.value} ${s.weight.total.unit}</div></div>
        <div class="wd-stat"><div class="ws-label">MAX RANGE</div><div class="ws-value">${s.range.max.value} ${s.range.max.unit}</div></div>
        <div class="wd-stat"><div class="ws-label">GUIDANCE</div><div class="ws-value">Semi-Active Radar</div></div>
      </div>
      <p style="color:var(--text2);margin-top:12px;font-size:12px;line-height:1.6">
        Requires continuous wave illuminator lock from AWG-9 radar. Illumination updates at 50 Hz. Primary beyond-visual-range weapon before Phoenix. Max effective range 18 nm in head-on engagements.
      </p>`;
  }

  function renderVulcan() {
    const g = window.F14_WEAPONS.gun;
    return `
      <div class="wd-header">
        <div class="wd-title">GAU-15/A (M61A1)</div>
        <div class="wd-subtitle">20mm 6-barrel rotary cannon — rate: 6,000 rpm</div>
      </div>
      <div class="wd-stat-grid">
        <div class="wd-stat"><div class="ws-label">CALIBER</div><div class="ws-value">20×102mm</div></div>
        <div class="wd-stat"><div class="ws-label">RATE OF FIRE</div><div class="ws-value">${g.rateOfFire.value} rpm</div></div>
        <div class="wd-stat"><div class="ws-label">MUZZLE VELOCITY</div><div class="ws-value">${g.muzzleVelocity.value} ft/s</div></div>
        <div class="wd-stat"><div class="ws-label">AMMUNITION</div><div class="ws-value">${g.ammunition.capacity.value} rds</div></div>
      </div>
      <p style="color:var(--text2);margin-top:12px;font-size:12px;line-height:1.6">
        GE rotary cannon with 6 barrels. Fires PGU-28/A armor-piercing incendiary. Gun pack weighs 410 lb loaded. Installed in lower left fuselage. Effective range 4,000 ft, max 6,000 ft.
      </p>`;
  }

  function renderLoadout() {
    const configs = window.F14_WEAPONS.loadoutConfigurations;
    return `
      <div class="wd-header"><div class="wd-title">LOADOUT CONFIGURATIONS</div></div>
      ${configs.map(c => `
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:4px;padding:14px;margin-bottom:12px">
          <div style="font-weight:700;color:var(--amber);font-size:13px;letter-spacing:1px">${c.name}</div>
          <div style="color:var(--text2);font-size:11px;margin:6px 0">${c.weapons.map(w => `${w.qty}× ${w.type} — ${w.location}`).join('<br>')}</div>
          <div style="color:var(--accent);font-size:11px">Total missiles: ${c.totalMissiles} | ${c.notes}</div>
        </div>
      `).join('')}
      <div class="wd-section"><h4>Pylon Stations</h4>
        <table class="range-table">
          <thead><tr><th>STATION</th><th>LOCATION</th><th>CAPACITY</th></tr></thead>
          <tbody>
            ${[{s:'L1/R1',l:'Fuselage shoulder',c:'2,500 lb'}, {s:'L2/R2',l:'Wing glove pylon',c:'1,000 lb'}, {s:'L3/R3',l:'Under-wing TER',c:'2,000 lb'}].map(r => `
              <tr><td>${r.s}</td><td>${r.l}</td><td class="td-value">${r.c}</td></tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  }

  function switchWeapon(weapon) {
    const el = document.getElementById('weaponDisplay');
    if (!el) return;
    const renderers = {
      phoenix: renderPhoenix,
      sidewinder: renderSidewinder,
      sparrow: renderSparrow,
      vulcan: renderVulcan,
      loadout: renderLoadout,
    };
    const renderer = renderers[weapon] || renderers.phoenix;
    el.innerHTML = renderer();
  }

  // ── History ──────────────────────────────────────────────
  function renderHistory() {
    const tl = window.F14_HISTORY.timeline;
    const surv = window.F14_HISTORY.survivors;

    // Timeline entries
    let timelineHTML = '';
    tl.forEach((entry, i) => {
      timelineHTML += `
        <div class="ht-entry${i === 0 ? ' active' : ''}" data-i="${i}">
          <div class="ht-year">${entry.year}</div>
          <div class="ht-title">${entry.title}</div>
        </div>`;
    });
    document.getElementById('historyTimeline').innerHTML = timelineHTML;

    // Survivor cards
    const survHTML = surv.map(s => `
      <div class="survivor-card">
        <div class="sc-name">${s.name}</div>
        <div class="sc-num">${s.type}</div>
        <div style="font-size:10px;color:var(--text2);margin-top:4px">${s.location}</div>
        <div class="sc-status">${s.status}</div>
        <div style="font-size:10px;color:var(--text3);margin-top:4px">${s.notes}</div>
      </div>`).join('');
    document.getElementById('survivorList').innerHTML = survHTML;

    // Detail
    renderHistoryEntry(0);

    // Click handlers
    document.querySelectorAll('.ht-entry').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelectorAll('.ht-entry').forEach(e => e.classList.remove('active'));
        el.classList.add('active');
        renderHistoryEntry(parseInt(el.dataset.i));
      });
    });
  }

  function renderHistoryEntry(i) {
    const entry = window.F14_HISTORY.timeline[i];
    if (!entry) return;
    document.getElementById('hdTitle').textContent = entry.title;
    document.getElementById('hdSubtitle').textContent = entry.year;
    document.getElementById('hdContent').innerHTML = `<p>${entry.detail}</p>`;
  }

  return { switchSystems, switchWeapon, renderHistory, renderHistoryEntry };
})();
