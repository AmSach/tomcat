// js/core/audio.js — F-14 Tomcat Synthesized Audio Engine (Web Audio API)

window.F14Audio = (function() {
  let ctx = null;
  let masterGain = null;
  let engineOsc1 = null, engineOsc2 = null;
  let noiseSource = null;
  let started = false;
  let gain1, gain2, abGain;

  function init() {
    if (started) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.35;
    masterGain.connect(ctx.destination);

    // Engine tone 1 (low)
    engineOsc1 = ctx.createOscillator();
    engineOsc1.type = 'sawtooth';
    engineOsc1.frequency.value = 80;
    gain1 = ctx.createGain();
    gain1.gain.value = 0.15;
    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.value = 400;
    engineOsc1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(masterGain);

    // Engine tone 2 (high)
    engineOsc2 = ctx.createOscillator();
    engineOsc2.type = 'sawtooth';
    engineOsc2.frequency.value = 160;
    gain2 = ctx.createGain();
    gain2.gain.value = 0.08;
    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.value = 800;
    engineOsc2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(masterGain);

    // AB hiss (noise)
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    abGain = ctx.createGain();
    abGain.gain.value = 0;
    const abFilter = ctx.createBiquadFilter();
    abFilter.type = 'bandpass';
    abFilter.frequency.value = 3000;
    abFilter.Q.value = 0.5;
    noiseSource.connect(abFilter);
    abFilter.connect(abGain);
    abGain.connect(masterGain);

    // Start
    engineOsc1.start();
    engineOsc2.start();
    noiseSource.start();
    started = true;
  }

  function update(state) {
    if (!started) return;
    const now = ctx.currentTime;
    const t = clamp01(state.throttle / 100);
    const rpm = clamp01(state.rpm / 100);

    // Frequency follows throttle/RPM
    const freq1 = 60 + rpm * 180; // 60-240 Hz
    const freq2 = freq1 * 2.05; // slight detuning
    engineOsc1.frequency.setTargetAtTime(freq1, now, 0.3);
    engineOsc2.frequency.setTargetAtTime(freq2, now, 0.3);

    // Volume
    gain1.gain.setTargetAtTime(0.08 + t * 0.18, now, 0.2);
    gain2.gain.setTargetAtTime(0.04 + t * 0.12, now, 0.2);

    // Afterburner hiss
    const abVol = state.afterburner ? clamp01((t - 0.7) / 0.3) * 0.25 : 0;
    abGain.gain.setTargetAtTime(abVol, now, 0.1);
  }

  function playLaunch() {
    if (!started) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 200;
    osc.frequency.linearRampToValueAtTime(80, now + 1.5);
    g.gain.value = 0.3;
    g.gain.linearRampToValueAtTime(0, now + 1.5);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(now);
    osc.stop(now + 1.5);
  }

  function playExplosion() {
    if (!started) return;
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const ns = ctx.createBufferSource();
    ns.buffer = noiseBuffer;
    const g = ctx.createGain();
    g.gain.value = 0.5;
    g.gain.exponentialRampToValueAtTime(0.001, now + 2);
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 400;
    ns.connect(f);
    f.connect(g);
    g.connect(masterGain);
    ns.start(now);
    ns.stop(now + 2);
  }

  function setMasterVolume(v) {
    if (masterGain) masterGain.gain.value = clamp(v, 0, 1) * 0.5;
  }

  function clamp01(v) { return Math.max(0, Math.min(1, v)); }
  function start() { init(); }
  function stop() {
    if (ctx) ctx.suspend();
  }

  return { start, stop, update, playLaunch, playExplosion, setMasterVolume };
})();
