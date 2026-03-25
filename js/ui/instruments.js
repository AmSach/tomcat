// js/ui/instruments.js — F-14 Tomcat Instrument Rendering

window.F14Instruments = (function() {

  let simCanvas, simCtx, gaugeCanvas, gaugeCtx;
  let raf = null;
  let lastState = null;

  function init() {
    simCanvas = document.getElementById('simCanvas');
    simCtx = simCanvas ? simCanvas.getContext('2d') : null;
    gaugeCanvas = document.getElementById('gaugeCanvas');
    gaugeCtx = gaugeCanvas ? gaugeCanvas.getContext('2d') : null;

    if (simCanvas) {
      simCanvas.width = simCanvas.clientWidth || 700;
      simCanvas.height = simCanvas.clientHeight || 420;
    }
    if (gaugeCanvas) {
      gaugeCanvas.width = gaugeCanvas.clientWidth || 600;
      gaugeCanvas.height = 100;
    }
  }

  function drawSim(state) {
    if (!simCtx || !simCanvas) return;
    const ctx = simCtx;
    const W = simCanvas.width, H = simCanvas.height;
    ctx.clearRect(0, 0, W, H);

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
    skyGrad.addColorStop(0, '#050a14');
    skyGrad.addColorStop(1, '#0a1a2e');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // Horizon line
    const horizonY = H / 2 + (state.pitch || 0) * 2;
    const bank = state.roll || 0;

    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(-bank * Math.PI / 180);

    // Ground
    const groundGrad = ctx.createLinearGradient(0, horizonY, 0, H);
    groundGrad.addColorStop(0, '#2a3a2a');
    groundGrad.addColorStop(1, '#1a2a1a');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(-W, horizonY, W * 2, H);

    // Sky
    ctx.fillStyle = '#0a1428';
    ctx.fillRect(-W, -H, W * 2, horizonY + H);

    // Pitch ladder
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.5)';
    ctx.lineWidth = 1;
    for (let p = -30; p <= 30; p += 10) {
      if (p === 0) ctx.strokeStyle = 'rgba(74, 222, 128, 0.9)';
      const y = horizonY + p * 3;
      const halfWidth = p === 0 ? W : 80 - Math.abs(p) * 2;
      ctx.beginPath();
      ctx.moveTo(-halfWidth, y);
      ctx.lineTo(halfWidth, y);
      ctx.stroke();
      if (p !== 0 && p % 20 === 0) {
        ctx.fillStyle = 'rgba(74, 222, 128, 0.6)';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText(`${Math.abs(p)}`, -halfWidth - 25, y + 3);
        ctx.fillText(`${Math.abs(p)}`, halfWidth + 8, y + 3);
      }
      if (p === 0) ctx.strokeStyle = 'rgba(74, 222, 128, 0.5)';
    }

    // Aircraft symbol
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    // Fuselage line
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(5, 0);
    ctx.stroke();
    // Wing
    ctx.beginPath();
    ctx.moveTo(-5, -25);
    ctx.lineTo(-5, 25);
    ctx.stroke();
    // Tail
    ctx.beginPath();
    ctx.moveTo(5, -12);
    ctx.lineTo(5, 12);
    ctx.stroke();
    // Nose
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(-35, 0);
    ctx.stroke();

    ctx.restore();

    // Flight director
    drawFD(ctx, W, H, state);

    // Update instruments
    updateInstruments(state);
  }

  function drawFD(ctx, W, H, state) {
    const fdsym = (state.heading || 0) % 360;
    ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
    ctx.font = '9px JetBrains Mono';
    ctx.fillText(`HDG ${fdsym.toString().padStart(3,'0')}`, W/2 - 20, 20);
  }

  function updateInstruments(state) {
    setEl('instSpeed', Math.round(state.speed || 0));
    setEl('instMach', (state.mach || 0).toFixed(2));
    setEl('instAlt', Math.round(state.altitude || 0));
    setEl('instAOA', (state.aoa || 0).toFixed(1));
    setEl('instG', (state.gForce || 1).toFixed(1));
    setEl('instHdg', Math.round(state.heading || 0).toString().padStart(3,'0'));
    setEl('instFuel', Math.round(state.fuel || 0).toLocaleString());
    setEl('instRPM', Math.round(state.rpm || 0));
    setEl('instEGT', Math.round(state.egt || 0));
    setEl('instSweep', `${Math.round(state.wingSweep || 28)}°`);
    setEl('instThrust', Math.round(state.thrust || 0).toLocaleString());
  }

  function setEl(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function drawGauges(state) {
    if (!gaugeCtx || !gaugeCanvas) return;
    const ctx = gaugeCtx;
    const W = gaugeCanvas.width, H = gaugeCanvas.height;
    ctx.clearRect(0, 0, W, H);

    // Engine gauge (RPM + EGT)
    const sections = [
      { label: 'N1', value: (state.rpm || 0) / 100, max: 100, color: '#4ade80', x: 50 },
      { label: 'EGT', value: Math.min((state.egt || 0) / 1850, 1), max: 1850, color: '#fbbf24', x: 180 },
      { label: 'THRUST', value: Math.min((state.thrust || 0) / 47000, 1), max: 47000, color: '#22c55e', x: 310 },
      { label: 'FUEL', value: (state.fuel || 0) / 36845, max: 36845, color: '#60a5fa', x: 440 },
    ];

    sections.forEach(sec => {
      // Background bar
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(sec.x, 20, 110, 12);

      // Fill
      ctx.fillStyle = sec.color;
      ctx.fillRect(sec.x, 20, 110 * sec.value, 12);

      // Border
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.strokeRect(sec.x, 20, 110, 12);

      // Label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px JetBrains Mono';
      ctx.fillText(sec.label, sec.x, 16);

      // Value
      ctx.fillStyle = sec.color;
      ctx.fillText(sec.label === 'EGT' ? `${state.egt||0}°F` :
                    sec.label === 'THRUST' ? `${Math.round(state.thrust/1000)}k` :
                    sec.label === 'FUEL' ? `${Math.round(state.fuel/1000)}k` :
                    `${Math.round(state.rpm)}%`, sec.x + 3, 30);
    });
  }

  function update(state) {
    if (!lastState || JSON.stringify(lastState) !== JSON.stringify(state)) {
      drawSim(state);
      drawGauges(state);
      lastState = { ...state };
    }
  }

  return { init, update };
})();
