// js/data/engines.js — F-14 J79-GE-400 Engine Technical Data

window.F14_ENGINES = {
  general: {
    engineModel: "General Electric J79-GE-400A",
    type: "Axial-flow turbojet with afterburner",
    units: "2",
    totalDryThrust: { value: 31200, unit: "lbf", kN: 138.8 },
    totalABThrust: { value: 47000, unit: "lbf", kN: 209.1 },
    bypassRatio: 0.20,
    overallPressureRatio: 21.4,
    turbineInletTemp: "1,850°F (max AB)",
    egtMax: { value: 1185, unit: "°F", celsius: 641 },
    spoolUpTime: "4 sec to full AB",
    spoolDownTime: "8 sec from full AB",
    relightAltitude: "50,000 ft",
  },

  dimensions: {
    length: { value: 158.5, unit: "in", meter: 4.026 },
    maxDiameter: { value: 34.8, unit: "in", meter: 0.884 },
    weight: { value: 3560, unit: "lb", kg: 1615 },
    inletDiameter: { value: 34.8, unit: "in" },
  },

  compressor: {
    stages: {
      lowPressure: { stages: 6, pressureRatio: "3.8:1", rpm: "8600-9400" },
      highPressure: { stages: 7, pressureRatio: "5.6:1", rpm: "10400-11100" },
    },
    totalStages: 13,
    bleedValves: "5-stage (low), 9-stage (high) auto-bleed",
    stallMargin: "20% at military power",
  },

  combustion: {
    type: "Can-annular",
    fuelInjectors: 16,
    ignition: "Capacitor discharge, dual plugs",
    starting: "Air turbine starter (Hartzell) / APU",
  },

  turbine: {
    highPressure: { stages: 1, inletTemp: "1850°F", material: "Inconel 713C" },
    lowPressure: { stages: 3, inletTemp: "1550°F", material: "Inconel 738" },
    powerTurbineSpeed: { rpm: "8600-9400", outputHp: "15,200 hp equivalent" },
  },

  afterburner: {
    type: "Variable-area exhaust nozzle (convergent-divergent)",
    fuel: "JP-4 or engine fuel",
    ignition: "Spark igniter (4 total, 2 per engine)",
    tempRise: "+665°F turbine outlet",
    thrustIncrease: "+75% over military power",
    nozzleControl: "Electronic hydro-mechanical",
  },

  fuelConsumption: {
    militaryPower: { value: 0.74, unit: "lb/lbf-hr", notes: "at max continuous" },
    maxAB: { value: 1.75, unit: "lb/lbf-hr", notes: "at full afterburner" },
    sfcMilitary: { value: 0.74, unit: "lb/hr/lb thrust" },
    sfcAB: { value: 1.75, unit: "lb/hr/lb thrust" },
    fuelFlowIdle: { value: 1500, unit: "lb/hr", notes: "both engines combined" },
    fuelFlowMil: { value: 11520, unit: "lb/hr", notes: "both engines at max mil" },
    fuelFlowAB: { value: 41125, unit: "lb/hr", notes: "both engines at max AB" },
  },

  rpm: {
    idle: { lo: 6400, hi: 6800, unit: "rpm" },
    military: { lo: 8600, hi: 9400, unit: "rpm" },
    maxAB: { lo: 10400, hi: 11100, unit: "rpm" },
    starterCutout: { rpm: 5400, unit: "rpm" },
    overspeedWarning: { rpm: 11600, unit: "rpm" },
  },

  performanceTable: [
    { altitudeFt: 0, mach: 0, thrust: "100%", ab: false, fuelFlowLbh: 11520, egtF: 1025 },
    { altitudeFt: 0, mach: 0.9, thrust: "92%", ab: false, fuelFlowLbh: 13400, egtF: 1065 },
    { altitudeFt: 30000, mach: 0.8, thrust: "85%", ab: false, fuelFlowLbh: 9800, egtF: 1005 },
    { altitudeFt: 30000, mach: 1.5, thrust: "78%", ab: false, fuelFlowLbh: 11750, egtF: 1070 },
    { altitudeFt: 30000, mach: 2.0, thrust: "72%", ab: false, fuelFlowLbh: 13100, egtF: 1100 },
    { altitudeFt: 50000, mach: 1.5, thrust: "65%", ab: false, fuelFlowLbh: 8200, egtF: 980 },
    { altitudeFt: 50000, mach: 2.0, thrust: "58%", ab: false, fuelFlowLbh: 9400, egtF: 1030 },
    { altitudeFt: 0, mach: 0, thrust: "175%", ab: true, fuelFlowLbh: 41125, egtF: 1850 },
    { altitudeFt: 30000, mach: 1.5, thrust: "160%", ab: true, fuelFlowLbh: 38000, egtF: 1800 },
    { altitudeFt: 30000, mach: 2.34, thrust: "145%", ab: true, fuelFlowLbh: 42000, egtF: 1780 },
  ],

  operatingLimits: {
    maxRPM: { value: 11100, unit: "rpm" },
    maxEGT: { value: 1185, unit: "°F" },
    maxOilTemp: { value: 230, unit: "°F" },
    minOilPressure: { value: 40, unit: "psi" },
    maxOilPressure: { value: 75, unit: "psi" },
    maxFuelPressure: { value: 55, unit: "psi" },
    maxVibration: { value: 0.002, unit: "in/sec" }, // MIL spec
  },

  throttleSettings: [
    { name: "CUTOFF", position: 0, description: "Fuel shut off, engine at rest", n1: 0, n2: 0 },
    { name: "IDLE", position: 1, description: "Minimum self-sustaining RPM", n1: 28, n2: 58 },
    { name: "MIL", position: 2, description: "Military power — max continuous", n1: 76, n2: 84 },
    { name: "MAX", position: 3, description: "Maximum rated thrust (5 min limit)", n1: 92, n2: 96 },
    { name: "A/B", position: 4, description: "Afterburner — full thrust", n1: 100, n2: 100 },
  ],

  oilSystem: {
    type: "Pressure + scavenge, dry sump",
    capacity: { value: 7.5, unit: "qt", liter: 7.1 },
    pressure: { value: 45, unit: "psi" },
    filter: "15 micron full-flow",
    cooler: "Fuel-oil heat exchanger",
  },

  ignition: {
    starting: "Air turbine starter (0.5 sec cranking)",
    mainIgnition: "Capacitor discharge, dual plugs",
    exciterVoltage: "4000V primary",
    plugs: "2 per engine (Navy special)",

  },
};
