// js/data/flight.js — F-14 Tomcat Flight Performance Data

window.F14_FLIGHT = {
  performance: {
    maxSpeed: {
      mach: 2.34,
      mph: 1544,
      kph: 2485,
      atAltitude: { value: 40000, unit: "ft" },
      note: "At military power above 36,089 ft (Mach 1 = 658 mph at altitude)"
    },
    maxSpeedAB: {
      mach: 2.34,
      note: "AB provides little additional speed at altitude due to drag",
      mph: 1544,
    },
    maxLevelSpeed: {
      mach: 1.6,
      note: "With minimum drag (clean, max sweep)",
      mph: 1200,
    },
    maxSustainedTurnRate: { value: 12.5, unit: "deg/sec", note: "At Mach 0.9, 15,000 ft" },
    maxInstantTurnRate: { value: 20, unit: "deg/sec", note: "At Mach 0.5, sea level" },
    maxG: { positive: 7.5, negative: 2.0, note: "At max takeoff weight" },
    serviceCeiling: { value: 60000, unit: "ft", m: 18288 },
    rateOfClimb: { value: 45000, unit: "ft/min", mps: 229, note: "Sea level, max AB" },
    takeoffDistance: { carrier: { value: 290, unit: "ft", m: 88 }, land: { value: 3000, unit: "ft", m: 914 } },
    landingDistance: { carrier: { value: 350, unit: "ft", m: 107 }, land: { value: 3000, unit: "ft", m: 914 } },
    takeoffWeight: { value: 61000, unit: "lb", note: "Typical catapult launch" },
  },

  flightEnvelope: {
    vnDiagram: {
      maxG: 7.5,
      minG: -2.0,
      maxSpeedMach: 2.34,
      minSpeedFlaps: { value: 140, unit: "kts" },
      minSpeedGear: { value: 210, unit: "kts" },
      stallSpeed: { value: 115, unit: "kts", note: "Landing config, max weight" },
      maneuverSpeed: { value: 350, unit: "kts", note: "Max sustained turn" },
      neverExceed: { value: 600, unit: "kts", note: "Structural limit" },
    },
    altitudeBands: [
      { band: "0-3000 ft", limitations: "Gear, flaps operating, carrier ops" },
      { band: "3000-15000 ft", limitations: "Normal operations" },
      { band: "15000-40000 ft", limitations: "High altitude performance peak" },
      { band: "40000-60000 ft", limitations: "Reduced maneuverability" },
    ],
  },

  range: {
    combatRadius: { value: 840, unit: "nm", km: 1556, note: "With 4 Phoenix, 2 Sidewinders, internal fuel" },
    ferryRange: { value: 2050, unit: "nm", km: 3796, note: "With conformal tanks, no weapons" },
    loiter: { value: 180, unit: "min", note: "At 40,000 ft, 200 nm from carrier" },
    dashRange: { value: 460, unit: "nm", note: "At Mach 1.8, high altitude" },
    fuelAtStart: { value: 36800, unit: "lb" },
  },

  catapult: {
    launchSpeed: { value: 165, unit: "kts", note: "Typical catapult end speed" },
    launchWeight: { value: 61000, unit: "lb", note: "Maximum catapult launch weight" },
    launchAngle: { value: 15, unit: "deg", note: "Nose-up at release" },
    arrester: { type: "MK-7 Mod 3", maxCaptureWeight: { value: 85000, unit: "lb" } },
  },

  gEnvelope: [
    { weight: 40000, positive: 7.0, negative: -2.0, maneuvering: 6.5 },
    { weight: 50000, positive: 6.5, negative: -2.0, maneuvering: 5.8 },
    { weight: 60000, positive: 5.5, negative: -2.0, maneuvering: 5.0 },
    { weight: 70000, positive: 4.5, negative: -1.5, maneuvering: 4.0 },
  ],

  approachSpeed: {
    flaperon: { value: 135, unit: "kts", note: "3 units, max landing weight" },
    flaps: { value: 130, unit: "kts", note: "Full flaps" },
    idle: { value: 125, unit: "kts", note: "No thrust" },
  },

  wingSweepPerformance: [
    { sweep: 20, purpose: "Takeoff / Landing / Low speed", maxSpeedMach: 0.72, turnRate: 14, liftCoeff: 1.2, dragCoeff: 0.12 },
    { sweep: 28, purpose: "Climb / Intercept", maxSpeedMach: 0.95, turnRate: 12, liftCoeff: 1.0, dragCoeff: 0.09 },
    { sweep: 35, purpose: "Approach / Combat (subsonic)", maxSpeedMach: 1.2, turnRate: 11, liftCoeff: 0.85, dragCoeff: 0.07 },
    { sweep: 50, purpose: "Transonic / Low supersonic", maxSpeedMach: 1.6, turnRate: 9, liftCoeff: 0.65, dragCoeff: 0.05 },
    { sweep: 68, purpose: "High speed dash / Supersonic", maxSpeedMach: 2.34, turnRate: 6, liftCoeff: 0.40, dragCoeff: 0.03 },
  ],

  aerodynamics: {
    liftCoefficient: { max: 1.4, note: "With slats deployed, 20° sweep" },
    dragCoefficient: { min: 0.03, note: "At 68° sweep, clean" },
    liftToDrag: { max: 9.5, note: "Best L/D at 35° sweep, 0.8 mach" },
    oswaldEfficiency: { value: 0.75, note: "Span efficiency factor" },
    aspectRatio: { spread: 7.3, swept: 3.2 },
  },

  fuelConsumptionMission: [
    { phase: "Warm-up + Taxi", duration: 5, fuelBurn: 200, fuelRemaining: 36400 },
    { phase: "Takeoff + Climb", duration: 8, fuelBurn: 2800, fuelRemaining: 33600 },
    { phase: "Cruise to station (Mach 0.8, 35kft)", duration: 60, fuelBurn: 8400, fuelRemaining: 25200 },
    { phase: "Combat patrol (1 hr)", duration: 60, fuelBurn: 12000, fuelRemaining: 13200 },
    { phase: "Return cruise", duration: 50, fuelBurn: 7200, fuelRemaining: 6000 },
    { phase: "Approach + Landing", duration: 10, fuelBurn: 1000, fuelRemaining: 5000 },
  ],

  environmental: {
    temperatureLimits: { min: { value: -65, unit: "°F" }, max: { value: 115, unit: "°F" } },
    windLimits: { crosswind: { value: 40, unit: "kts" }, headwind: { value: 60, unit: "kts" } },
    visibilityMin: { value: 0.5, unit: "nm", note: "Carrier landing minimum" },
    ceiling: { value: 300, unit: "ft", note: "Landing minimum" },
    carrierWaveLimit: { value: 20, unit: "ft", note: "Max wave height for ops" },
  },
};
