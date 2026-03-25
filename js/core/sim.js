// js/core/sim.js — F-14 Tomcat Flight Simulation Engine

window.F14Sim = (function() {
  // ── Constants ──────────────────────────────────────────────
  const G = 32.174; // ft/s²
  const LB_TO_KG = 0.453592;
  const FT_TO_M = 0.3048;

  // ── F-14 Physical Constants ────────────────────────────────
  const WING_AREA = 565; // ft²
  const WEIGHT_EMPTY = 39900; // lb
  const WEIGHT_NORMAL = 61000; // lb
  const WEIGHT_MAX = 74350; // lb
  const WING_SPAN_SPREAD = 64; // ft
  const WING_SPAN_SWEEP = 38; // ft
  const ASPECT_SPREAD = 7.3;
  const ASPECT_SWEEP = 3.2;
  const CDo = 0.022; // zero-lift drag coefficient
  const CL_MAX = 1.4; // max lift coefficient (with slats)

  // ── J79 Engine Constants ─────────────────────────────────
  const THRUST_DRY = 15600; // lbf per engine
  const THRUST_AB = 23500; // lbf per engine (afterburner)
  const MAX_FUEL_FLOW_MIL = 5760; // lb/hr per engine at mil
  const MAX_FUEL_FLOW_AB = 20562; // lb/hr per engine at AB
  const SFC_MIL = 0.74; // lb/lbf-hr
  const SFC_AB = 1.75; // lb/lbf-hr

  // ── State ────────────────────────────────────────────────
  let state = {
    // Position & motion
    x: 0, y: 0, z: 0, // ft (x=North, y=East, z=Down)
    vNorth: 0, vEast: 0, vDown: 0, // ft/s
    speed: 300, // knots
    mach: 0.5,
    altitude: 10000, // ft MSL
    heading: 0, // degrees
    pitch: 0, roll: 0, yaw: 0, // degrees
    aoa: 5, // degrees

    // Controls
    throttle: 60, // 0-100
    afterburner: false,
    wingSweep: 28, // degrees

    // Systems
    weight: WEIGHT_NORMAL,
    fuel: 36485, // lb
    gForce: 1.0,
    stallWarning: false,

    // Derived
    thrust: 0,
    drag: 0,
    lift: 0,
    cl: 0,
    cd: 0,
    lDrate: 0, // lift/drag ratio
    roc: 0, // rate of climb ft/min

    // Engine state
    rpm: 80,
    egt: 800, // °F
    fuelFlow: 0, // lb/hr total

    // Landing gear / flaps
    gearDown: true,
    flaps: 0, // degrees
    slats: true, // auto
    airbrake: false,
    canopy: true,

    // Time
    running: false,
    time: 0, // sim seconds elapsed
    lastUpdate: null,
  };

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function toRad(d) { return d * Math.PI / 180; }
  function toDeg(r) { return r * 180 / Math.PI; }
  function sinD(d) { return Math.sin(toRad(d)); }
  function cosD(d) { return Math.cos(toRad(d)); }
  function tanD(d) { return Math.tan(toRad(d)); }

  // ── Atmosphere (International Standard) ──────────────────
  function atmosphere(alt) {
    const T0 = 518.67, P0 = 2116.22, rho0 = 0.002377;
    const lapse = 0.00356; // °R/ft to 36089 ft
    const T = T0 - lapse * alt;
    const P = P0 * Math.pow(T / T0, 5.256);
    const rho = rho0 * Math.pow(T / T0, 4.256);
    const speedOfSound = Math.sqrt(1.4 * 1716.3 * T);
    return { T, P, rho, a: speedOfSound };
  }

  // ── Wing Geometry ─────────────────────────────────────────
  function effectiveAspect(sweep) {
    // Aspect ratio drops as sweep increases
    return lerp(ASPECT_SPREAD, ASPECT_SWEEP, (sweep - 20) / (68 - 20));
  }
  function effectiveSpan(sweep) {
    return lerp(WING_SPAN_SPREAD, WING_SPAN_SWEEP, (sweep - 20) / (68 - 20));
  }
  function effectiveArea(sweep) {
    // Area is roughly constant
    return WING_AREA;
  }

  // ── Aerodynamics ──────────────────────────────────────────
  function aeroCoefficients(speed, alt, aoa, wingSweep, gearDown, flaps) {
    const { a } = atmosphere(alt);
    const mach = speed * 1.68876 / a; // kts to ft/s

    // Wing lift curve slope (per radian, approx)
    const beta = Math.sqrt(Math.max(0, 1 - mach * mach));
    const bEff = effectiveSpan(wingSweep);
    const SEff = effectiveArea(wingSweep);
    const AR = (bEff * bEff) / SEff;
    const ClAlpha = 2 * Math.PI * AR / (AR + 2);

    // Oswald efficiency (decreases with sweep)
    const e = lerp(0.82, 0.65, (wingSweep - 20) / (68 - 20));

    // Lift coefficient
    let cl = ClAlpha * toRad(aoa);

    // Flap contribution
    if (flaps > 0) cl += 0.15 * (flaps / 35);

    // Gear / store drag
    let cdGear = gearDown ? 0.015 : 0;
    let cdBase = CDo + cdGear;

    // Wave drag (transonic)
    let cdWave = 0;
    if (mach > 0.9) {
      const Mco = 0.9 + 0.1 * (1 - (wingSweep - 20) / (68 - 20));
      cdWave = 0.1 * Math.pow((mach - Mco) / (1 - Mco), 2);
    }

    // Induced drag
    const cdInduced = cl * cl / (Math.PI * AR * e);

    const cd = cdBase + cdInduced + cdWave;

    return { cl: clamp(cl, -0.5, CL_MAX), cd, clMax: CL_MAX, mach, beta, AR };
  }

  // ── Engine Model ─────────────────────────────────────────
  function engineModel(throttle, alt, afterburner) {
    const { a } = atmosphere(alt);
    const mach = state.speed * 1.68876 / a;
    const altFactor = 1 - 0.00006 * alt; // rough thrust lapse
    const machFactor = 1 - 0.08 * mach; // velocity term

    let thrustPC = afterburner ? THRUST_AB : THRUST_DRY;
    thrustPC *= Math.max(0.3, altFactor * machFactor);

    // Throttle factor
    const throttleFactor = clamp((throttle - 20) / 80, 0, 1);
    const thrust = 2 * thrustPC * throttleFactor; // 2 engines

    // Fuel flow
    let ff = 0;
    if (throttle > 5) {
      const baseFF = afterburner ? MAX_FUEL_FLOW_AB : MAX_FUEL_FLOW_MIL;
      ff = 2 * baseFF * throttleFactor;
    }

    // RPM (approximation)
    const rpm = lerp(30, 100, throttleFactor);

    // EGT
    const egtIdle = 600, egtMil = 1025, egtAB = 1650;
    const egt = afterburner ? egtAB : lerp(egtIdle, egtMil, throttleFactor);

    return { thrust, fuelFlow: ff, rpm, egt: Math.round(egt) };
  }

  // ── Main Update ───────────────────────────────────────────
  function update(dt) {
    if (!state.running) return;
    dt = clamp(dt, 0, 0.05); // max 50ms step

    const { rho, a } = atmosphere(state.altitude);
    const speedFPS = state.speed * 1.68876; // knots → ft/s
    const q = 0.5 * rho * speedFPS * speedFPS; // dynamic pressure

    // Wing geometry
    const SEff = effectiveArea(state.wingSweep);

    // Aerodynamics
    const { cl, cd, clMax } = aeroCoefficients(
      state.speed, state.altitude, state.aoa,
      state.wingSweep, state.gearDown, state.flaps
    );
    const mach = speedFPS / a;

    // Physics
    const { thrust, fuelFlow, rpm, egt } = engineModel(state.throttle, state.altitude, state.afterburner);
    state.thrust = thrust;
    state.drag = q * cd * SEff;
    state.lift = q * cl * SEff;
    state.cl = cl;
    state.cd = cd;
    state.lDrate = cl / Math.max(cd, 0.001);

    // Weight change from fuel
    state.fuel = Math.max(0, state.fuel - fuelFlow * dt / 3600);
    const weight = WEIGHT_EMPTY + state.fuel + 2000; // + crew + gear

    // Net forces
    const netUp = state.lift - weight;
    const netForward = state.thrust - state.drag;

    // G-force
    const loadFactor = clamp(state.lift / weight, -2, 7.5);
    state.gForce = lerp(state.gForce, loadFactor, 0.2);

    // Pitch (simple stability model)
    const pitchRate = 2.0; // deg/s
    const targetPitch = clamp(netUp / 1000, -15, 30);
    state.pitch = lerp(state.pitch, targetPitch, 0.05);

    // Rate of climb
    state.roc = (state.lift > weight) ? (state.lift - weight) / weight * 30000 / 60 : -5000 / 60;
    state.roc = clamp(state.roc, -5000, 45000);

    // Altitude change
    state.altitude += state.roc * dt / 60;

    // Speed change
    const accel = (netForward / weight) * G;
    const speedChangeKts = (accel / G) * (speedFPS / 1.68876) * dt;
    state.speed = Math.max(0, state.speed + speedChangeKts);

    // Mach
    state.mach = clamp(state.speed * 1.68876 / a, 0, 2.5);

    // AoA (angle of attack)
    if (state.roc > 100) state.aoa = lerp(state.aoa, 4, 0.05);
    else if (state.roc < -100) state.aoa = lerp(state.aoa, 8, 0.05);

    // Stall warning
    const clRequired = weight * G / (q * SEff);
    state.stallWarning = clRequired > clMax * 0.85;

    // Heading (slight turn rate from bank)
    if (state.roll !== 0) {
      const turnRate = 3.5 * tanD(Math.min(state.roll, 30)) / (speedFPS / 1000);
      state.heading += turnRate * dt;
    }

    // Update engines
    state.rpm = Math.round(rpm);
    state.egt = Math.round(egt);
    state.fuelFlow = Math.round(fuelFlow);

    // Time
    state.time += dt;
  }

  // ── Wing sweep performance ────────────────────────────────
  function sweepPerformance(sweep) {
    const entries = [
      { s: 20, mach: 0.72, turn: 14, lift: 1.2, drag: 0.12 },
      { s: 28, mach: 0.95, turn: 12, lift: 1.0, drag: 0.09 },
      { s: 35, mach: 1.2, turn: 11, lift: 0.85, drag: 0.07 },
      { s: 50, mach: 1.6, turn: 9, lift: 0.65, drag: 0.05 },
      { s: 68, mach: 2.34, turn: 6, lift: 0.40, drag: 0.03 },
    ];
    // Interpolate
    const lo = entries.filter(e => e.s <= sweep).pop();
    const hi = entries.find(e => e.s > sweep);
    if (!lo) return entries[0];
    if (!hi) return entries[entries.length - 1];
    const t = (sweep - lo.s) / (hi.s - lo.s);
    return {
      maxMach: lerp(lo.mach, hi.mach, t),
      turnRate: lerp(lo.turn, hi.turn, t),
      liftCoeff: lerp(lo.lift, hi.lift, t),
      dragCoeff: lerp(lo.drag, hi.drag, t),
    };
  }

  // ── Fuel tanks ────────────────────────────────────────────
  function fuelTanks() {
    const total = 36485;
    const used = 36485 - state.fuel;
    const pct = state.fuel / total;
    return [
      { name: "#1 Fwd Fuselage", max: 3840, current: Math.round(3840 * pct) },
      { name: "#2 Intermediate", max: 3420, current: Math.round(3420 * pct) },
      { name: "#3 Aft Fuselage", max: 3780, current: Math.round(3780 * pct) },
      { name: "#4 Left Wing Inbd", max: 2940, current: Math.round(2940 * pct) },
      { name: "#5 Right Wing Inbd", max: 2940, current: Math.round(2940 * pct) },
      { name: "#6 Left Wing Out", max: 1530, current: Math.round(1530 * pct) },
      { name: "#7 Right Wing Out", max: 1530, current: Math.round(1530 * pct) },
      { name: "Conformal Tanks", max: 5220, current: Math.round(5220 * pct) },
    ];
  }

  // ── Public API ────────────────────────────────────────────
  function getState() { return { ...state }; }

  function setState(patch) {
    Object.assign(state, patch);
  }

  function reset() {
    state = {
      x: 0, y: 0, z: 0,
      vNorth: 0, vEast: 0, vDown: 0,
      speed: 300, mach: 0.5, altitude: 10000,
      heading: 0, pitch: 0, roll: 0, yaw: 0, aoa: 5,
      throttle: 60, afterburner: false, wingSweep: 28,
      weight: WEIGHT_NORMAL, fuel: 36485, gForce: 1.0, stallWarning: false,
      thrust: 0, drag: 0, lift: 0, cl: 0, cd: 0, lDrate: 0, roc: 0,
      rpm: 80, egt: 800, fuelFlow: 0,
      gearDown: true, flaps: 0, slats: true, airbrake: false, canopy: true,
      running: false, time: 0, lastUpdate: null,
    };
  }

  function start() {
    state.running = true;
    state.lastUpdate = performance.now();
    loop();
  }

  function stop() { state.running = false; }

  let raf = null;
  function loop() {
    if (!state.running) return;
    const now = performance.now();
    const dt = (now - state.lastUpdate) / 1000;
    state.lastUpdate = now;
    update(dt);
    // Notify listeners
    if (window.F14Sim && window.F14Sim.onUpdate) window.F14Sim.onUpdate(getState());
    raf = requestAnimationFrame(loop);
  }

  function getSweepPerf() { return sweepPerformance(state.wingSweep); }
  function getFuelTanks() { return fuelTanks(); }

  return { getState, setState, reset, start, stop, getSweepPerf, getFuelTanks, onUpdate: null };
})();
