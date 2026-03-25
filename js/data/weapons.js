// js/data/weapons.js — F-14 Tomcat Weapons Systems

window.F14_WEAPONS = {

  missiles: {

    AIM54_PHOENIX: {
      designation: "AIM-54A/C/EC Phoenix",
      natoName: "Phoenix",
      manufacturer: "Raytheon / General Dynamics",
      firstUse: "1981",
      length: { value: 13.0, unit: "ft", m: 3.96 },
      bodyDiameter: { value: 15.0, unit: "in", m: 0.38 },
      wingSpan: { value: 36.0, unit: "in", m: 0.91 },
      weight: { total: { value: 1520, unit: "lb", kg: 690 }, warhead: { value: 135, unit: "lb", kg: 61 } },
      speed: { max: { value: 5, unit: "Mach", mph: 3800, kph: 6100 }, cruise: { value: 3, unit: "Mach", mph: 2280, kph: 3670 } },
      range: {
        min: { value: 3, unit: "nm", km: 5.6 },
        max: { value: 100, unit: "nm", km: 184 },
        effective: { value: 80, unit: "nm", km: 148 },
      },
      altitude: { min: { value: 500, unit: "ft" }, max: { value: 98000, unit: "ft" } },
      guidance: {
        midCourse: "Data link from AN/AWG-9 radar (mid-course updates every 2 sec)",
        terminal: "Semi-active radar homing (ASRH)",
        doppler: "Continuous wave illuminator required for terminal phase",
      },
      warhead: {
        type: "Blast fragmentation",
        weight: { value: 135, unit: "lb", kg: 61 },
        explosionRadius: { value: 40, unit: "ft", m: 12 },
      },
      propulsion: {
        type: "Solid-fuel rocket motor",
        manufacturer: "Hercules",
        burnTime: { value: 17, unit: "sec" },
      },
      reliability: { value: 0.85, percent: "85% overall" },
      launchPlatform: "F-14A/B/D, S-3B, F-15 (trial)",
      stations: 6, // 2 × TER on each wing pylon = 4 + 2 fuselage = 6 max
      engagementSequence: [
        { step: 1, action: "AWG-9 detects and tracks target in TWS/RWS" },
        { step: 2, action: "Phoenix selected, launch authorized" },
        { step: 3, action: "Missile launched, data link provides mid-course corrections" },
        { step: 4, action: "Missile transitions to terminal homing on reflected radar energy" },
        { step: 5, action: "CW illuminator locks onto target for terminal guidance" },
        { step: 6, action: "Warhead detonates on proximity or direct impact" },
      ],
      engagementTable: [
        { altitudeFt: 10000, rangeNm: 20, probability: 0.78, notes: "Maximum p(sub|k)" },
        { altitudeFt: 30000, rangeNm: 40, probability: 0.72, notes: "High altitude long range" },
        { altitudeFt: 50000, rangeNm: 60, probability: 0.65, notes: "Excellent at altitude" },
        { altitudeFt: 50000, rangeNm: 100, probability: 0.48, notes: "Maximum Phoenix range" },
      ],
    },

    AIM9_SIDEWINDER: {
      designation: "AIM-9L/M/N/P Sidewinder",
      natoName: "Sidewinder",
      length: { value: 9.4, unit: "ft", m: 2.87 },
      diameter: { value: 5.0, unit: "in", m: 0.127 },
      weight: { total: { value: 188, unit: "lb", kg: 85 }, warhead: { value: 20, unit: "lb", kg: 9.1 } },
      speed: { max: { value: 2.5, unit: "Mach", mph: 1900, kph: 3050 } },
      range: {
        min: { value: 0.5, unit: "nm", km: 0.9 },
        max: { value: 10, unit: "nm", km: 18 },
        effective: { value: 6, unit: "nm", km: 11 },
      },
      altitude: { min: { value: 0, unit: "ft" }, max: { value: 50000, unit: "ft" } },
      guidance: {
        type: "Passive infrared homing (heat seeking)",
        seeker: "Lead sulfide (PbS) detector, 360° acquisition (later models)",
        coolant: "Argon gas (early), thermoelectric (later)",
        coolingTime: "30 sec activation",
      },
      warhead: {
        type: "Blast fragmentation",
        weight: { value: 20, unit: "lb", kg: 9.1 },
        proximity: "Electronic fuzing",
      },
      propulsion: {
        type: "Solid-fuel rocket motor",
        burnTime: { value: 4.8, unit: "sec" },
      },
      stations: 4, // 2 per wing glove pylon
      notes: "First used by US Navy from F-14 in 1981 over Gulf of Sidra",
    },

    AIM7_SPARROW: {
      designation: "AIM-7F/M Sparrow",
      natoName: "Sparrow",
      length: { value: 12.0, unit: "ft", m: 3.66 },
      diameter: { value: 8.0, unit: "in", m: 0.203 },
      wingSpan: { value: 40.0, unit: "in", m: 1.02 },
      weight: { total: { value: 510, unit: "lb", kg: 231 }, warhead: { value: 70, unit: "lb", kg: 32 } },
      speed: { max: { value: 4.0, unit: "Mach", mph: 3000, kph: 4800 } },
      range: {
        min: { value: 1.0, unit: "nm", km: 1.85 },
        max: { value: 24, unit: "nm", km: 44 },
        effective: { value: 18, unit: "nm", km: 33 },
      },
      altitude: { min: { value: 0, unit: "ft" }, max: { value: 60000, unit: "ft" } },
      guidance: {
        type: "Semi-active radar homing (SARH)",
        requirement: "Continuous wave illuminator radar lock required",
        illuminator: "AN/AWG-9 dedicated CW mode",
        updateRate: "50 Hz",
      },
      warhead: {
        type: "Blast fragmentation",
        weight: { value: 70, unit: "lb", kg: 32 },
        proximity: "RF proximity fuze",
      },
      propulsion: {
        type: "Solid-fuel rocket motor",
        burnTime: { value: 6.0, unit: "sec" },
      },
      stations: 6, // Same as Phoenix (TERs)
      notes: "Primary beyond-visual-range missile before Phoenix. Requires continuous radar lock.",
    },
  },

  gun: {
    model: "GE GAU-15/A (M61A1 variant)",
    type: "6-barrel rotary cannon",
    caliber: "20×102mm",
    rateOfFire: { value: 6000, unit: "rpm", rps: 100 },
    cyclicRate: { value: 100, unit: "rounds/sec" },
    muzzleVelocity: { value: 3380, unit: "ft/s", mps: 1030 },
    barrelLength: { value: 60, unit: "in", m: 1.52 },
    weight: { empty: { value: 265, unit: "lb", kg: 120 }, loaded: { value: 410, unit: "lb", kg: 186 } },
    ammunition: {
      type: "20mm PGU-28/A (armor-piercing incendiary)",
      capacity: { value: 600, unit: "rounds" },
      distribution: "150 rounds per barrel × 4",
    },
    recoilForce: { value: 600, unit: "lb", note: "per burst of 100 rounds" },
    effectiveRange: { value: 4000, unit: "ft" },
    maxRange: { value: 6000, unit: "ft" },
    firingModes: ["Single", "Burst (100 rd)", "Continuous (100 rd burst)" ],
    notes: "Selected over the M61A1 for F-14 due to rate/range. PGU-28 has better armor penetration than standard M56.",
  },

  loadoutConfigurations: [
    {
      name: "Fleet Defense (Standard)",
      stations: 6,
      weapons: [
        { type: "AIM-54", qty: 4, location: "Under-wing TERs (2 each side)" },
        { type: "AIM-9", qty: 2, location: "Wing glove pylons" },
      ],
      totalMissiles: 6,
      notes: "Standard carrier air patrol configuration",
    },
    {
      name: "Interceptor",
      stations: 6,
      weapons: [
        { type: "AIM-54", qty: 6, location: "4 under-wing + 2 fuselage stations" },
      ],
      totalMissiles: 6,
      notes: "Maximum Phoenix load, no Sidewinders",
    },
    {
      name: "Close Combat",
      stations: 6,
      weapons: [
        { type: "AIM-7", qty: 4, location: "Under-wing TERs" },
        { type: "AIM-9", qty: 2, location: "Wing glove pylons" },
        { type: "GAU-15/A", qty: 1, location: "Fuselage gun pack" },
      ],
      totalMissiles: 6,
      notes: " Sparrow + Sidewinder + gun for close-in work",
    },
    {
      name: "Bombing (LADD)",
      stations: 4,
      weapons: [
        { type: "AIM-54", qty: 2, location: "Fuselage stations" },
        { type: "GBU-10", qty: 2, location: "Under-wing pylons" },
        { type: "GAU-15/A", qty: 1, location: "Fuselage gun pack" },
      ],
      totalMissiles: 2,
      notes: "Low altitude direct dive — desert storm configuration",
    },
  ],

  pylons: {
    fuselage: [
      { station: "L1/R1", location: "Fuselage shoulder", capacity: { value: 2500, unit: "lb", kg: 1134 } },
    ],
    wing: [
      { station: "L2/R2", location: "Wing glove pylon", capacity: { value: 1000, unit: "lb", kg: 454 } },
      { station: "L3/R3", location: "Under-wing TER", capacity: { value: 2000, unit: "lb", kg: 907 } },
    ],
    ter: "Triple ejector rack — carries 2 missiles per rack",
  },

  weaponSelectionSystem: {
    computer: "AN/ASG-32 IDA",
    selectionModes: ["Phoenix", "Sparrow", "Sidewinder", "Gun", "Mixed"],
    firingSequence: "Priority 1-6, select quantity, fire",
    masterArm: "3-position (SAFE / TRAIN / ARM)",
    releaseAuthority: "Pilot (override) or RIO (primary)",
  },

};
