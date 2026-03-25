// js/data/avionics.js — F-14 Tomcat Avionics Suite

window.F14_AVIONICS = {
  radar: {
    model: "AN/AWG-9",
    type: "Pulse-Doppler, X-band",
    frequency: "8-12.5 GHz (X-band)",
    peakPower: { value: 10.0, unit: "kW" },
    averagePower: { value: 600, unit: "W" },
    prf: { low: 200, high: 1200, unit: "pps" },
    pulseWidth: { short: 1.3, medium: 3.5, long: 13.0, unit: "µs" },
    rangeScales: [10, 25, 50, 75, 100, 150, 200, "nm"],
    rangeResolution: { value: 200, unit: "m" },
    azimuthCoverage: { value: 120, unit: "°" },
    elevationCoverage: { value: 65, unit: "°" },
    modes: [
      { code: "STT", name: "Single Target Track", description: "Lock-on and continuous track of one target. Full AWG-9 power dedicated. Updates every 0.1 sec. Range: 115 nm.", maxTargets: 1 },
      { code: "TWS", name: "Track While Scan", description: "Scans volume while maintaining up to 24 track files. Medium PRF. Range: 100 nm. Auto-priority ranking.", maxTargets: 24 },
      { code: "RWS", name: "Range While Scan", description: "Search mode with range info. Lower PRF for longer range. Updates 0.5 sec. Range: 200 nm.", maxTargets: "unlimited" },
      { code: "ACM", name: "Air Combat Mode", description: "Boresight acquisition. Instant lock within 10° cone. Sub-modes: 30°, 10°, boresight. Range: 20 nm.", maxTargets: 1 },
      { code: "MAP", name: "Map", description: "Ground mapping. Medium PRF. Two resolutions: 2 nm and 5 nm beamwidth.", maxTargets: "n/a" },
      { code: "SEA", name: "Sea", description: "Maritime search mode. Clutter suppression for over-water targets.", maxTargets: "unlimited" },
    ],
    detectionRanges: [
      { target: "F-4 sized fighter", rcs: 3, detectionNm: 145, trackNm: 95 },
      { target: "Bomber (Tu-95)", rcs: 100, detectionNm: 270, trackNm: 210 },
      { target: "Cruise missile", rcs: 0.1, detectionNm: 40, trackNm: 22 },
      { target: "Helicopter", rcs: 3, detectionNm: 28, trackNm: 15 },
    ],
    clutter: {
      seaState: "7 levels, auto-detected",
      rain: "3 attenuation levels",
      chaff: "Auto-chaff rejection algorithm",
    },
    display: "AN/ASA-140 display (12\" CRT, green phosphor)",
    antenna: "Slotted waveguide array, 30\" diameter",
    coolant: "Freon-12 refrigeration unit",
  },

  ida: {
    model: "AN/ASG-32 IDA",
    type: "Digital fire control computer",
    manufacturer: "Lear Siegler",
    processor: "16-bit, 256K memory",
    throughput: "2 million operations/sec",
    functions: [
      "AIM-54 mid-course guidance updates",
      "AIM-7 Sparrow semi-active illumination control",
      "AIM-9 Sidewinder slaving",
      "Gun sight computation",
      "Target ordnance compatibility",
      "A/A radar mode control",
    ],
    displayInterface: "Dual HUD channels, TV camera for RIO",
  },

  identification: {
    model: "AN/APX-76",
    type: "IFF transponder (Mode 4 / Mode C)",
    modelB: "AN/APX-111",
    typeB: "Combined IFF/SIF",
    modes: ["Mode 1", "Mode 2", "Mode 3/A", "Mode 4", "Mode C"],
  },

  tacan: {
    model: "AN/ARN-118",
    channels: 126,
    type: "UHF tactical air navigation",
    range: { value: 390, unit: "nm" },
    accuracy: { value: 0.5, unit: "nm" },
  },

  vhffhf: {
    model: "AN/ARC-159",
    type: "VHF/FM radio",
    frequency: "225-399.975 MHz",
    channels: 7600,
    power: { value: 10, unit: "W" },
    antares: "Combined VHF AM / UHF AM / FM",
  },

  uhf: {
    model: "AN/ARC-182",
    type: "UHF/AM radio",
    frequency: "225-399.975 MHz",
    guardFrequency: 243.0,
    channels: 9200,
  },

  inertial: {
    model: "AN/ASN-92 (A)",
    type: "Inertial Navigation System",
    manufacturer: "Delco",
    accuracy: { value: 1.0, unit: "nm/hr CEP" },
    alignmentTime: { cold: "12 min", warm: "3 min" },
    dataUpdate: "32 Hz to weapons system",
  },

  ecm: {
    model: "AN/ALR-67",
    type: "Radar warning receiver",
    coverage: "360°",
    frequencyRange: "2-18 GHz (NATO I/J bands)",
    sensitivity: { value: -60, unit: "dBm" },
    responseTime: { value: 50, unit: "ns" },
    display: "Left console (pilot), dedicated panel",
    jamming: "Potentially paired with AN/ALQ-126 or AN/ALQ-167",
  },

  electronicWarfare: {
    jammer: {
      model: "AN/ALQ-126 (A/B) / AN/ALQ-167 (D)",
      type: "Deception jammer",
      band: "I/J (8-18 GHz)",
      effectiveRadiatedPower: { value: 1.0, unit: "kW" },
    },
    chaff: {
      model: "AN/ALE-39",
      capacity: { value: 420, unit: "rounds" },
      types: ["Dipole", "箔条", "corner reflector"],
      deployment: "Semi-automatic or manual",
    },
    flares: {
      model: "AN/ALE-45",
      type: "Infrared countermeasures",
      rounds: 30,
    },
  },

  landing: {
    model: "AN/SPN-46",
    type: "Carrier landing radar (precision approach)",
    frequency: "15 GHz (Ku-band)",
    accuracy: { azimuth: "±0.5°", elevation: "±0.2°", range: "±50 ft" },
    mode: "Automatic carrier landing system (ACLS)",
    backup: "Manual waveoff capability",
  },

  altimeter: {
    model: "AN/APN-194",
    type: "Radar altimeter",
    range: { min: 0, max: 50000, unit: "ft" },
    accuracy: { value: "2% (~100 ft)", unit: "%" },
  },

  inertial: {
    model: "AN/ASN-92",
    type: "Inertial navigation and weapon aiming",
    gyro: "GEC-Marconi HMG-07",
    alignment: "Carrier stored heading + GPS updates",
  },

  hud: {
    model: "A-4J HUD (A) / AN/ASG-32 IDA HUD (D)",
    type: "Head-up display, optical projection",
    fieldsOfView: "20° × 25°",
    symbols: "72 symbol alphabet",
    brightness: "2000 fL (day), 10 fL (night)",
    dataDisplayed: [
      "Airspeed (knots / mach)",
      "Altitude (barometric / radar)",
      "Heading",
      "Pitch ladder",
      "Flight path marker",
      "Velocity vector",
      "Target designation",
      "Weapon reticle",
      "G-meter",
      "Heading bug",
    ],
  },

  weaponsSystem: {
    trainable: {
      model: "M61A1 or GE GAU-15/A",
      type: "6-barrel rotary cannon",
      caliber: "20×102mm",
      rateOfFire: { value: 6000, unit: "rpm" },
      muzzleVelocity: { value: 3380, unit: "ft/s", mps: 1030 },
      ammoCapacity: { value: 600, unit: "rounds" },
      cyclicRate: { value: 100, unit: "rps" },
      barrelLength: { value: 60, unit: "in" },
      weightLoaded: { value: 410, unit: "lb" },
    },
  },
};
