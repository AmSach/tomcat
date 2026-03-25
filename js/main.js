// js/main.js — F-14 Tomcat Digital Twin — Main Entry Point

document.addEventListener('DOMContentLoaded', async () => {

  // ── Init subsystems ─────────────────────────────────────
  // Loading screen — dismiss after init
  const loadingScreen = document.getElementById('loadingScreen');

  if (document.getElementById('canvas3d')) {
    window.F14Viewer3D.init('canvas3d');
    window.F14Viewer3D.setViewMode('external');
  }
  window.F14Instruments.init();
  window.F14Manual.init();

  // Dismiss loading screen
  if (loadingScreen) {
    loadingScreen.style.transition = 'opacity 0.5s';
    loadingScreen.style.opacity = '0';
    setTimeout(() => loadingScreen.remove(), 500);
  }

  // ── Tab navigation ─────────────────────────────────────
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('tab-' + tab)?.classList.add('active');
      btn.classList.add('active');
    });
  });

  // ── 3D viewer viewpoint buttons ─────────────────────────
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.F14Viewer3D.setViewMode(btn.dataset.view);
      document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Wing sweep slider (3D viewer)
  const wingSweepEl = document.getElementById('wingSweep');
  const sweepDegEl = document.getElementById('sweepDeg');
  if (wingSweepEl) {
    wingSweepEl.addEventListener('input', e => {
      const deg = parseInt(e.target.value);
      window.F14Sim.setState({ wingSweep: deg });
      window.F14Viewer3D.setWingSweep(deg);
      if (sweepDegEl) sweepDegEl.textContent = `${deg}°`;
      updateSweepPerf(deg);
    });
  }

  // Surface toggles
  document.getElementById('toggleGear')?.addEventListener('change', e => {
    window.F14Viewer3D.setGearDown(e.target.checked);
  });
  document.getElementById('toggleFlaps')?.addEventListener('change', e => {
    window.F14Viewer3D.setFlaps(e.target.checked ? 35 : 0);
  });

  // ── Simulation controls ───────────────────────────────
  document.getElementById('btnStart')?.addEventListener('click', () => {
    window.F14Sim.start();
    window.F14Audio.start();
    const btnStop = document.getElementById('btnStop');
    const btnStart = document.getElementById('btnStart');
    if (btnStart) btnStart.style.display = 'none';
    if (btnStop) btnStop.classList.remove('hidden');
  });

  document.getElementById('btnStop')?.addEventListener('click', () => {
    window.F14Sim.stop();
    if (btnStart) btnStart.style.display = '';
    if (btnStop) btnStop.classList.add('hidden');
  });

  document.getElementById('btnReset')?.addEventListener('click', () => {
    window.F14Sim.reset();
    window.F14Sim.setState({ wingSweep: 28 });
    window.F14Viewer3D.setWingSweep(28);
    window.F14Audio.playExplosion();
    renderSimState(window.F14Sim.getState());
  });

  // Throttle slider
  const throttleEl = document.getElementById('throttleSlider');
  const throttleValEl = document.getElementById('throttleVal');
  if (throttleEl) {
    throttleEl.addEventListener('input', e => {
      const t = parseInt(e.target.value);
      window.F14Sim.setState({ throttle: t, afterburner: t > 75 });
      if (throttleValEl) throttleValEl.textContent = `${t}%`;
    });
  }

  // Wing sweep slider (sim panel)
  const sweepEl = document.getElementById('sweepSlider');
  const sweepValEl = document.getElementById('sweepVal');
  if (sweepEl) {
    sweepEl.addEventListener('input', e => {
      const deg = parseInt(e.target.value);
      window.F14Sim.setState({ wingSweep: deg });
      window.F14Viewer3D.setWingSweep(deg);
      if (sweepValEl) sweepValEl.textContent = `${deg}°`;
      updateSweepPerf(deg);
    });
  }

  // Sweep presets
  document.querySelectorAll('[data-sweep]').forEach(btn => {
    btn.addEventListener('click', () => {
      const deg = parseInt(btn.dataset.sweep);
      window.F14Sim.setState({ wingSweep: deg });
      window.F14Viewer3D.setWingSweep(deg);
      if (sweepEl) sweepEl.value = deg;
      if (sweepValEl) sweepValEl.textContent = `${deg}°`;
      updateSweepPerf(deg);
    });
  });

  // ── Keyboard controls ──────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'Escape') {
      document.getElementById('searchOverlay')?.classList.add('hidden');
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('searchOverlay')?.classList.remove('hidden');
      document.getElementById('searchInput')?.focus();
      return;
    }
    const s = window.F14Sim.getState();
    switch (e.key) {
      case 'ArrowUp':    window.F14Sim.setState({ throttle: Math.min(100, s.throttle + 2) }); break;
      case 'ArrowDown':  window.F14Sim.setState({ throttle: Math.max(0, s.throttle - 2) }); break;
      case 'w': case 'W': window.F14Sim.setState({ afterburner: !s.afterburner }); break;
      case 'g': case 'G': window.F14Sim.setState({ gearDown: !s.gearDown }); window.F14Viewer3D.setGearDown(!s.gearDown); break;
      case 'f': case 'F': window.F14Sim.setState({ flaps: s.flaps > 0 ? 0 : 35 }); break;
      case 'b': case 'B': window.F14Sim.setState({ airbrake: !s.airbrake }); break;
    }
    const ns = window.F14Sim.getState();
    if (throttleEl) throttleEl.value = ns.throttle;
    if (throttleValEl) throttleValEl.textContent = `${ns.throttle}%`;
  });

  // ── Sim update loop ────────────────────────────────────
  window.F14Sim.onUpdate = state => {
    renderSimState(state);
    window.F14Audio.update(state);
    window.F14Instruments.update(state);
  };

  // ── Systems sub-tabs ───────────────────────────────────
  document.querySelectorAll('.sys-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sys-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window.F14Panels.switchSystems(btn.dataset.sys);
    });
  });

  // ── Weapon sub-tabs ────────────────────────────────────
  document.querySelectorAll('.ws-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ws-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window.F14Panels.switchWeapon(btn.dataset.weapon);
    });
  });

  // ── Search ─────────────────────────────────────────────
  document.getElementById('searchToggle')?.addEventListener('click', () => {
    document.getElementById('searchOverlay')?.classList.toggle('hidden');
    document.getElementById('searchInput')?.focus();
  });
  document.getElementById('searchInput')?.addEventListener('input', e => {
    const q = e.target.value.trim();
    const results = q.length >= 2 ? window.F14Search.search(q) : [];
    renderSearchResults(results);
  });
  document.getElementById('searchOverlay')?.addEventListener('click', e => {
    if (e.target.id === 'searchOverlay') e.target.classList.add('hidden');
  });

  // ── History panel ──────────────────────────────────────
  window.F14Panels.renderHistory();

  // ── Defaults ───────────────────────────────────────────
  renderSimState(window.F14Sim.getState());
  updateSweepPerf(28);
  window.F14Viewer3D.setWingSweep(28);
  window.F14Panels.switchSystems('dimensions');
  window.F14Panels.switchWeapon('phoenix');
});

// ── Render Sim State ───────────────────────────────────────
function renderSimState(s) {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  // Flight data panel (center)
  set('dispSpeed', Math.round(s.speed));
  set('dispMach', s.mach.toFixed(2));
  set('dispAlt', Math.round(s.altitude).toLocaleString());
  set('dispROC', `${s.roc > 0 ? '+' : ''}${Math.round(s.roc)}`);
  set('dispHdg', Math.round(s.heading).toString().padStart(3,'0'));
  set('dispPitch', `${s.pitch > 0 ? '+' : ''}${s.pitch.toFixed(1)}`);
  set('dispG', s.gForce.toFixed(1));
  set('dispAoA', `${s.aoa.toFixed(1)}`);
  set('dispThrust', (s.thrust / 1000).toFixed(1));
  set('dispDrag', (s.drag / 1000).toFixed(1));
  set('dispLD', s.lDrate.toFixed(1));
  set('dispStall', s.stallWarning ? 'STALL' : 'CLEAR');
  set('dispFuel', (s.fuel / 1000).toFixed(1));
  set('dispFuelGal', Math.round(s.fuel / 10).toLocaleString());
  set('dispRPM', `${Math.round(s.rpm)}`);
  set('dispEGT', `${Math.round(s.egt)}`);
  set('dispFF', (s.fuelFlow / 1000).toFixed(1));

  // Control toggles display
  set('dispAB', s.afterburner ? 'AB ON' : 'OFF');
  set('dispGear', s.gearDown ? 'DOWN' : 'UP');
  set('dispFlaps', `${s.flaps}°`);

  // Fuel bar
  const fuelBar = document.getElementById('fuelBar');
  if (fuelBar) fuelBar.style.width = `${(s.fuel / 36485 * 100).toFixed(1)}%`;

  // Fuel tanks
  const tanks = window.F14Sim.getFuelTanks();
  const tankGrid = document.getElementById('tankGrid');
  if (tankGrid && tanks) {
    tankGrid.innerHTML = tanks.map(t => `
      <div class="tg-tank">
        <div class="tg-label">${t.name}</div>
        <div class="tg-bar"><div class="tg-fill" style="width:${(t.current/t.max*100).toFixed(0)}%"></div></div>
        <div class="tg-val">${t.current}</div>
      </div>`).join('');
  }
}

// ── Sweep Performance ─────────────────────────────────────
function updateSweepPerf(deg) {
  const perf = window.F14Sim.getSweepPerf();
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('spMaxMach', perf.maxMach.toFixed(2));
  set('spTurnRate', `${perf.turnRate}°/s`);
  set('spLift', perf.liftCoeff.toFixed(2));
  set('spDrag', perf.dragCoeff.toFixed(3));
  // Also update 3D viewer panel
  set('sweepSpeed', `Mach ${perf.maxMach.toFixed(2)}`);
  set('sweepTurn', `${perf.turnRate}°/s`);
  set('sweepLift', perf.liftCoeff.toFixed(2));
}

// ── Search Results ─────────────────────────────────────────
function renderSearchResults(results) {
  const el = document.getElementById('searchResults');
  if (!el) return;
  if (results.length === 0) {
    el.innerHTML = '<div style="color:var(--text3);font-size:12px;padding:8px">Type to search all F-14 technical data…</div>';
    return;
  }
  el.innerHTML = results.map(r => `
    <div class="sr-item">
      <div class="sr-cat">${r.category}</div>
      <div class="sr-title">${r.title}</div>
      <div class="sr-text">${r.text}</div>
    </div>`).join('');
}
