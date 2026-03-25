// js/render/viewer3d.js — F-14 Tomcat Three.js 3D Viewer
// THREE is set globally by three-iife.js loaded via <script> tag
window.F14Viewer3D = (function() {
  var THREE = window.THREE; // use global set by three-iife.js
  let scene, camera, renderer, airplane;
  let wingLeft, wingRight, fairingLeft, fairingRight;
  let stabilizerLeft, stabilizerRight;
  let cockpitGroup, gearGroup, flapLeft, flapRight;
  let hotspotMeshes = {};
  let currentView = 'external';
  let animFrame = null;
  let isNightCVW = false;
  let inited = false;

  const SCALE = 0.015; // feet to Three.js units

  function init(containerId) {
    if (inited) return;
    if (!window.THREE) {
      console.warn('F14Viewer3D: Three.js not loaded');
      return;
    }
    inited = true;

    const container = document.getElementById(containerId);
    if (!container) return;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060810);
    scene.fog = new THREE.Fog(0x060810, 80, 200);

    // Camera
    camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 500);
    camera.position.set(20, 12, 20);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0x334455, 0.6);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xfff5e0, 1.2);
    sun.position.set(30, 40, 20);
    sun.castShadow = true;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x4466aa, 0.4);
    fill.position.set(-20, 10, -10);
    scene.add(fill);

    // Ground grid
    const grid = new THREE.GridHelper(100, 40, 0x1a2a3a, 0x0d1520);
    grid.position.y = -5;
    scene.add(grid);

    // Build the Tomcat
    buildTomcat();

    // Orbit controls (manual)
    setupControls(container);

    // Resize
    window.addEventListener('resize', onResize);

    // Render loop
    animate();
  }

  function buildTomcat() {
    airplane = new THREE.Group();
    scene.add(airplane);

    const mat = {
      body: new THREE.MeshPhongMaterial({ color: 0x8a9a8a, shininess: 60 }),
      bodyDark: new THREE.MeshPhongMaterial({ color: 0x6a7a6a, shininess: 40 }),
      nacelle: new THREE.MeshPhongMaterial({ color: 0x5a6a5a, shininess: 70 }),
      nacelleHot: new THREE.MeshPhongMaterial({ color: 0x3a4a5a, shininess: 80 }),
      glass: new THREE.MeshPhongMaterial({ color: 0x223344, transparent: true, opacity: 0.7, shininess: 100 }),
      black: new THREE.MeshPhongMaterial({ color: 0x111111 }),
      white: new THREE.MeshPhongMaterial({ color: 0xeeeeee }),
      amber: new THREE.MeshPhongMaterial({ color: 0xffaa00, emissive: 0x442200 }),
      red: new THREE.MeshPhongMaterial({ color: 0xcc2200, emissive: 0x220500 }),
      green: new THREE.MeshPhongMaterial({ color: 0x22cc44, emissive: 0x001100 }),
      titanium: new THREE.MeshPhongMaterial({ color: 0x7a8a9a, shininess: 80 }),
    };

    // ── Fuselage (torpedo shape) ──
    const fuseGroup = new THREE.Group();
    airplane.add(fuseGroup);

    // Main fuselage body
    const fuseGeom = new THREE.CylinderGeometry(0.85, 0.5, 9.5, 16);
    fuseGeom.rotateZ(Math.PI / 2);
    const fuse = new THREE.Mesh(fuseGeom, mat.body);
    fuse.position.set(0, 0, 0);
    fuse.castShadow = true;
    fuseGroup.add(fuse);

    // Nose cone
    const noseGeom = new THREE.ConeGeometry(0.85, 2.5, 16);
    noseGeom.rotateZ(-Math.PI / 2);
    const nose = new THREE.Mesh(noseGeom, mat.titanium);
    nose.position.set(-6, 0, 0);
    nose.castShadow = true;
    fuseGroup.add(nose);

    // Tail cone
    const tailGeom = new THREE.CylinderGeometry(0.5, 0.2, 2.0, 12);
    tailGeom.rotateZ(Math.PI / 2);
    const tailCone = new THREE.Mesh(tailGeom, mat.bodyDark);
    tailCone.position.set(5.5, 0, 0);
    fuseGroup.add(tailCone);

    // ── Canopy ──
    cockpitGroup = new THREE.Group();
    cockpitGroup.position.set(-1.5, 0, 0.6);
    const canopyGeom = new THREE.SphereGeometry(0.55, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2);
    const canopy = new THREE.Mesh(canopyGeom, mat.glass);
    canopy.position.y = 0.6;
    cockpitGroup.add(canopy);

    // Canopy frame
    const frameGeom = new THREE.TorusGeometry(0.55, 0.02, 4, 24, Math.PI * 2);
    frameGeom.rotateX(Math.PI / 2);
    const frame = new THREE.Mesh(frameGeom, mat.black);
    frame.position.y = 0.6;
    cockpitGroup.add(frame);
    fuseGroup.add(cockpitGroup);

    // ── AN/AWG-9 Radome ──
    const radomeGeom = new THREE.SphereGeometry(0.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const radome = new THREE.Mesh(radomeGeom, mat.titanium);
    radome.position.set(-5.0, 0, 0);
    radome.rotation.z = -Math.PI / 2;
    fuseGroup.add(radome);
    addHotspot(radome, 'radome', 'AN/AWG-9 Radome\nX-band pulse-Doppler radar\nPeak power: 10kW\nDetection: 145nm (fighter)');

    // ── Variable-Sweep Wings ──
    wingLeft = buildWing(-1, mat);
    wingRight = buildWing(1, mat);
    airplane.add(wingLeft);
    airplane.add(wingRight);

    // Wing glove (fixed root extension)
    const gloveGeom = new THREE.BoxGeometry(3, 0.05, 3.5);
    const gloveLeft = new THREE.Mesh(gloveGeom, mat.body);
    gloveLeft.position.set(1, -0.05, -2.0);
    const gloveRight = new THREE.Mesh(gloveGeom, mat.body);
    gloveRight.position.set(1, -0.05, 2.0);
    airplane.add(gloveLeft);
    airplane.add(gloveRight);

    // ── Tail Fairings ──
    fairingLeft = new THREE.Group();
    fairingRight = new THREE.Group();
    buildFairing(fairingLeft, -1, mat);
    buildFairing(fairingRight, 1, mat);
    airplane.add(fairingLeft);
    airplane.add(fairingRight);

    // ── Engine nacelles ──
    const nacelleGeom = new THREE.CylinderGeometry(0.45, 0.38, 4.5, 12);
    nacelleGeom.rotateZ(Math.PI / 2);
    const nacelleLeft = new THREE.Mesh(nacelleGeom, mat.nacelle);
    nacelleLeft.position.set(2, -1.0, -2.2);
    nacelleLeft.castShadow = true;
    const nacelleRight = new THREE.Mesh(nacelleGeom, mat.nacelle);
    nacelleRight.position.set(2, -1.0, 2.2);
    nacelleRight.castShadow = true;
    airplane.add(nacelleLeft);
    airplane.add(nacelleRight);
    addHotspot(nacelleLeft, 'engine', 'J79-GE-400 Turbojet\nDry: 15,600 lbf\nAB: 23,500 lbf\nSFC: 0.74 lb/lbf-hr');

    // Intake ramps
    const rampGeom = new THREE.BoxGeometry(0.8, 0.15, 0.8);
    const rampLeft = new THREE.Mesh(rampGeom, mat.bodyDark);
    rampLeft.position.set(-0.5, 0.1, -2.2);
    const rampRight = new THREE.Mesh(rampGeom, mat.bodyDark);
    rampRight.position.set(-0.5, 0.1, 2.2);
    airplane.add(rampLeft);
    airplane.add(rampRight);

    // ── Stabilizers (all-moving) ──
    buildStabilizers(mat);

    // ── Landing Gear ──
    gearGroup = new THREE.Group();
    buildLandingGear(gearGroup, mat);
    airplane.add(gearGroup);

    // ── Phoenix launcher rails ──
    const launcherGeom = new THREE.CylinderGeometry(0.06, 0.06, 4, 6);
    launcherGeom.rotateZ(Math.PI / 2);
    const launcherLeft = new THREE.Mesh(launcherGeom, mat.black);
    launcherLeft.position.set(-0.5, -0.8, -1.5);
    const launcherRight = new THREE.Mesh(launcherGeom, mat.black);
    launcherRight.position.set(-0.5, -0.8, 1.5);
    airplane.add(launcherLeft);
    airplane.add(launcherRight);
    addHotspot(launcherLeft, 'launcher', 'AIM-54 Phoenix Launcher\nMax 6 stations\nRange: 100nm\nSpeed: Mach 5');

    // Position whole airplane
    airplane.rotation.y = 0.3;
  }

  function buildWing(side, mat) {
    const wing = new THREE.Group();
    wing.userData.side = side;

    // Wing panel (pivot at 25% chord, ~x=0)
    const pivotX = 0;
    wing.position.set(pivotX, 0, side * 2.5);

    // Main wing surface
    const chord = 3.5;
    const halfSpan = 3.8;
    const sweep = 0; // Will be rotated
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(-chord, 0);
    shape.lineTo(-chord * 0.4, halfSpan);
    shape.lineTo(0, halfSpan * 0.8);
    shape.closePath();

    const extSettings = { depth: 0.08, bevelEnabled: false };
    const wingGeom = new THREE.ExtrudeGeometry(shape, extSettings);
    wingGeom.rotateX(-Math.PI / 2);
    wingGeom.translate(0, 0, -halfSpan * 0.8);
    const wingMesh = new THREE.Mesh(wingGeom, mat.body);
    wingMesh.castShadow = true;
    wing.add(wingMesh);

    // Trailing edge
    const teGeom = new THREE.BoxGeometry(chord * 0.7, 0.03, halfSpan);
    const teMesh = new THREE.Mesh(teGeom, mat.bodyDark);
    teMesh.position.set(-chord * 0.3, 0, halfSpan / 2 - 0.2);
    wing.add(teMesh);

    // Slat
    const slatGeom = new THREE.BoxGeometry(0.4, 0.04, halfSpan * 0.7);
    const slat = new THREE.Mesh(slatGeom, mat.titanium);
    slat.position.set(-chord + 0.1, 0.1, halfSpan / 2);
    wing.add(slat);

    // Tip
    const tipGeom = new THREE.BoxGeometry(0.2, 0.15, 0.08);
    const tip = new THREE.Mesh(tipGeom, mat.body);
    tip.position.set(-chord + 0.1, 0, halfSpan - 0.05);
    wing.add(tip);

    // AIM-54 on wing pylon (visible detail)
    const pylonGeom = new THREE.BoxGeometry(0.8, 0.08, 0.08);
    const pylon = new THREE.Mesh(pylonGeom, mat.black);
    pylon.position.set(-0.5, -0.2, halfSpan * 0.6);
    wing.add(pylon);

    // Flaperon
    flapLeft = new THREE.Mesh(new THREE.BoxGeometry(chord * 0.4, 0.04, halfSpan * 0.35), mat.bodyDark);
    flapLeft.position.set(-chord * 0.5, -0.1, halfSpan * 0.6);
    wing.add(flapLeft);

    addHotspot(wing, 'wing', `Variable-Sweep Wing\nPivot: 25% chord\nSweep: 20°-68°\nArea: 565 ft²\nAspect: 7.3 (spread)`);

    return wing;
  }

  function buildFairing(group, side, mat) {
    group.position.set(0, 0, side * 1.5);

    // Main fairing
    const fGeom = new THREE.BoxGeometry(5, 0.4, 1.2);
    const fairing = new THREE.Mesh(fGeom, mat.bodyDark);
    group.add(fairing);

    // Tailhook
    const hookGeom = new THREE.CylinderGeometry(0.03, 0.02, 2.5, 6);
    const hook = new THREE.Mesh(hookGeom, mat.titanium);
    hook.position.set(1.5, -1.2, 0);
    group.add(hook);
  }

  function buildStabilizers(mat) {
    // All-moving stabilators (twin)
    const stabShape = new THREE.Shape();
    stabShape.moveTo(0, 0);
    stabShape.lineTo(-2.2, 0);
    stabShape.lineTo(-1.8, 1.5);
    stabShape.lineTo(0, 1.2);
    stabShape.closePath();
    const stabGeom = new THREE.ExtrudeGeometry(stabShape, { depth: 0.06, bevelEnabled: false });
    stabGeom.rotateX(-Math.PI / 2);
    stabGeom.translate(0, 0, -1.5);

    stabilizerLeft = new THREE.Mesh(stabGeom, mat.body);
    stabilizerLeft.position.set(4, 0.2, -2.5);
    stabilizerLeft.castShadow = true;
    airplane.add(stabilizerLeft);

    stabilizerRight = new THREE.Mesh(stabGeom, mat.body);
    stabilizerRight.position.set(4, 0.2, 2.5);
    stabilizerRight.scale.z = -1;
    stabilizerRight.castShadow = true;
    airplane.add(stabilizerRight);

    addHotspot(stabilizerLeft, 'tail', 'All-Moving Stabilators\nTwin stabilators\nSpan: 33.25 ft\nArea: 64 ft²\nProvides pitch + directional control');
  }

  function buildLandingGear(group, mat) {
    const strutGeom = new THREE.CylinderGeometry(0.08, 0.06, 1.5, 8);

    // Nose gear
    const noseStrut = new THREE.Mesh(strutGeom, mat.black);
    noseStrut.position.set(-4.0, -1.5, 0);
    const noseWheelGeom = new THREE.TorusGeometry(0.15, 0.05, 8, 16);
    const noseWheel = new THREE.Mesh(noseWheelGeom, mat.black);
    noseWheel.position.set(-4.0, -2.3, 0);
    group.add(noseStrut);
    group.add(noseWheel);

    // Main gears
    const mainStrut = new THREE.Mesh(strutGeom, mat.black);
    mainStrut.position.set(1.0, -1.2, -2.2);
    const mainWheelGeom = new THREE.TorusGeometry(0.2, 0.07, 8, 16);
    const mainWheel = new THREE.Mesh(mainWheelGeom, mat.black);
    mainWheel.position.set(1.0, -2.0, -2.2);
    group.add(mainStrut);
    group.add(mainWheel);

    const mainStrutR = new THREE.Mesh(strutGeom, mat.black);
    mainStrutR.position.set(1.0, -1.2, 2.2);
    const mainWheelR = new THREE.Mesh(mainWheelGeom, mat.black);
    mainWheelR.position.set(1.0, -2.0, 2.2);
    group.add(mainStrutR);
    group.add(mainWheelR);
  }

  function addHotspot(mesh, name, description) {
    mesh.userData.hotspot = name;
    mesh.userData.description = description;
    hotspotMeshes[name] = mesh;
  }

  // ── Wing Sweep Animation ──
  function setWingSweep(degrees) {
    const sweep = THREE.MathUtils.degToRad(degrees);
    const sign = 1; // wing side
    if (wingLeft) wingLeft.rotation.y = -sweep;
    if (wingRight) wingRight.rotation.y = sweep;
  }

  // ── Toggle Surfaces ──
  function setGearDown(down) {
    if (!gearGroup) return;
    gearGroup.visible = down;
  }

  function setFlaps(deg) {
    if (flapLeft) flapLeft.rotation.x = THREE.MathUtils.degToRad(deg * 0.6);
    if (flapRight) flapRight.rotation.x = THREE.MathUtils.degToRad(deg * 0.6);
  }

  function setViewMode(mode) {
    currentView = mode;
    const pos = {
      external:   { x: 22, y: 12, z: 18, target: [0, 0, 0] },
      'cockpit-front': { x: -2, y: 1.5, z: 0.5, target: [-10, 0, 0] },
      'cockpit-rio':    { x: -2, y: 1.5, z: -0.5, target: [-10, 0, 0] },
      carrier:     { x: 0, y: -8, z: 15, target: [0, 0, 0] },
      night:       { x: 25, y: 8, z: 15, target: [0, 0, 0] },
    };
    const p = pos[mode] || pos.external;
    camera.position.set(p.x, p.y, p.z);
    camera.lookAt(...p.target);

    isNightCVW = mode === 'night';
    if (isNightCVW) {
      scene.background = new THREE.Color(0x020508);
      scene.fog = new THREE.Fog(0x020508, 40, 120);
    } else {
      scene.background = new THREE.Color(0x060810);
      scene.fog = new THREE.Fog(0x060810, 80, 200);
    }
  }

  function selectComponent(name) {
    // Highlight selected component
    Object.values(hotspotMeshes).forEach(m => {
      if (m.material && m.material.emissive) {
        m.material.emissive.setHex(0x000000);
      }
    });
    const mesh = hotspotMeshes[name];
    if (mesh && mesh.material && mesh.material.emissive) {
      mesh.material.emissive.setHex(0x224400);
    }
  }

  function getHotspotInfo(name) {
    const mesh = hotspotMeshes[name];
    return mesh ? mesh.userData.description : '';
  }

  // ── Simple Orbit Controls ──
  let controls = { isDragging: false, lastX: 0, lastY: 0 };
  let spherical = { theta: 0.4, phi: 0.8, radius: 35 };

  function setupControls(container) {
    container.addEventListener('mousedown', e => {
      controls.isDragging = true;
      controls.lastX = e.clientX;
      controls.lastY = e.clientY;
    });
    window.addEventListener('mouseup', () => { controls.isDragging = false; });
    window.addEventListener('mousemove', e => {
      if (!controls.isDragging) return;
      const dx = e.clientX - controls.lastX;
      const dy = e.clientY - controls.lastY;
      spherical.theta -= dx * 0.005;
      spherical.phi = clamp(spherical.phi + dy * 0.005, 0.1, Math.PI / 2 - 0.1);
      controls.lastX = e.clientX;
      controls.lastY = e.clientY;
    });
    container.addEventListener('wheel', e => {
      spherical.radius = clamp(spherical.radius + e.deltaY * 0.05, 8, 100);
    });
    // Click for hotspots
    container.addEventListener('click', e => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width * 2 - 1;
      const y = -(e.clientY - rect.top) / rect.height * 2 + 1;
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({ x, y }, camera);
      const hits = raycaster.intersectObjects(Object.values(hotspotMeshes), true);
      if (hits.length > 0) {
        let obj = hits[0].object;
        while (obj && !obj.userData.hotspot) obj = obj.parent;
        if (obj && obj.userData.hotspot) {
          showHotspotLabel(obj.userData.hotspot, obj.userData.description);
          selectComponent(obj.userData.hotspot);
        }
      }
    });
  }

  function showHotspotLabel(name, desc) {
    const label = document.getElementById('hotspot-label');
    if (!label) return;
    label.textContent = name.toUpperCase();
    label.classList.remove('hidden');
    setTimeout(() => label.classList.add('hidden'), 3000);

    // Show info panel
    const panel = document.getElementById('infoPanel');
    const content = document.getElementById('infoPanelContent');
    if (panel && content) {
      content.innerHTML = `<h3>${name.toUpperCase()}</h3><pre style="font-family:var(--mono);font-size:11px;color:var(--text2);line-height:1.6">${desc}</pre>`;
      panel.classList.remove('hidden');
    }
  }

  function onResize() {
    const container = document.getElementById('canvas3d');
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function animate() {
    animFrame = requestAnimationFrame(animate);

    // Orbit camera
    if (currentView === 'external' || currentView === 'night') {
      spherical.theta += 0.001;
      const x = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      const y = spherical.radius * Math.cos(spherical.phi);
      const z = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.set(x, y, z);
      camera.lookAt(0, 0, 0);
    }

    renderer.render(scene, camera);
  }

  function dispose() {
    if (animFrame) cancelAnimationFrame(animFrame);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
  }

  return { init, setWingSweep, setGearDown, setFlaps, setViewMode, selectComponent, getHotspotInfo, dispose };
})();
