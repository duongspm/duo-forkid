/* ============================================
   Critter Builder — low-poly, plush-toy style
   animals assembled from Three.js primitives.
   One factory, many species, kept lightweight.
   ============================================ */

const ANIMALS = [
  { id: 'cat',      name: 'Con Mèo',  sound: 'Meo meo!',   body: 0xF6A854, secondary: 0xFFFFFF, ears: 'pointy',  tail: 'long',   feature: 'whiskers' },
  { id: 'cow',       name: 'Con Bò',   sound: 'Ụmbò!',      body: 0xFFFFFF, secondary: 0x4A3B52, ears: 'floppy',  tail: 'tuft',   feature: 'horns' },
  { id: 'elephant',  name: 'Con Voi',  sound: 'Pò pò!',     body: 0xB7B7C9, secondary: 0xE7A9C4, ears: 'giant',   tail: 'thin',   feature: 'trunk' },
  { id: 'duck',      name: 'Con Vịt',  sound: 'Cạp cạp!',   body: 0xFFD166, secondary: 0xF2653A, ears: 'none',    tail: 'stub',   feature: 'beak' },
  { id: 'fish',      name: 'Con Cá',   sound: 'Bloop bloop!', body: 0x6EC6E8, secondary: 0xFFD166, ears: 'none',  tail: 'fin',    feature: 'finTop' },
  { id: 'lion',      name: 'Sư Tử',    sound: 'Gầm gầm!',   body: 0xF2AE2E, secondary: 0xE8871E, ears: 'round',   tail: 'tuft',   feature: 'mane' },
];

function buildCritter(spec) {
  const group = new THREE.Group();
  const mat = (hex) => new THREE.MeshStandardMaterial({ color: hex, roughness: 0.55, flatShading: true });
  const bodyMat = mat(spec.body);
  const secMat = mat(spec.secondary);
  const darkMat = mat(0x4a3b52);

  // Body
  const body = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), bodyMat);
  body.scale.set(1, 0.95, spec.id === 'fish' ? 1.35 : 1.05);
  body.position.y = -0.55;
  group.add(body);

  // Head
  const headSize = spec.id === 'elephant' ? 0.95 : 0.8;
  const head = new THREE.Mesh(new THREE.IcosahedronGeometry(headSize, 1), bodyMat);
  head.position.y = 0.7;
  head.position.z = spec.id === 'fish' ? 0.3 : 0;
  group.add(head);

  // Ears
  if (spec.ears === 'pointy') {
    const earGeo = new THREE.ConeGeometry(0.28, 0.5, 4);
    [-1, 1].forEach(s => {
      const e = new THREE.Mesh(earGeo, bodyMat);
      e.position.set(s * 0.45, 1.35, 0);
      e.rotation.z = s * -0.15;
      group.add(e);
    });
  } else if (spec.ears === 'floppy') {
    const earGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.4, 6);
    [-1, 1].forEach(s => {
      const e = new THREE.Mesh(earGeo, secMat);
      e.position.set(s * 0.7, 0.85, 0.1);
      e.rotation.z = s * 0.9;
      group.add(e);
    });
  } else if (spec.ears === 'giant') {
    const earGeo = new THREE.CircleGeometry(0.55, 16);
    [-1, 1].forEach(s => {
      const e = new THREE.Mesh(earGeo, secMat);
      e.position.set(s * 0.9, 0.75, -0.1);
      e.rotation.y = s * 0.7;
      group.add(e);
    });
  } else if (spec.ears === 'round') {
    const earGeo = new THREE.SphereGeometry(0.3, 10, 10);
    [-1, 1].forEach(s => {
      const e = new THREE.Mesh(earGeo, bodyMat);
      e.position.set(s * 0.62, 1.28, 0);
      group.add(e);
    });
  }

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.1, 8, 8);
  [-1, 1].forEach(s => {
    const e = new THREE.Mesh(eyeGeo, darkMat);
    e.position.set(s * 0.32, 0.78, headSize * 0.78 + (spec.id === 'fish' ? 0.3 : 0));
    group.add(e);
  });

  // Snout / beak / trunk features
  if (spec.feature === 'trunk') {
    const trunkMat = bodyMat;
    for (let i = 0; i < 4; i++) {
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.16 - i * 0.02, 0.18 - i * 0.02, 0.32, 8), trunkMat);
      seg.position.set(0, 0.35 - i * 0.28, headSize * 0.75 + 0.05 + i * 0.05);
      seg.rotation.x = 0.5 + i * 0.25;
      group.add(seg);
    }
  } else if (spec.feature === 'beak') {
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.4, 4), secMat);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0.6, headSize * 0.85);
    group.add(beak);
  } else if (spec.feature === 'horns') {
    const hornGeo = new THREE.ConeGeometry(0.08, 0.28, 6);
    [-1, 1].forEach(s => {
      const h = new THREE.Mesh(hornGeo, secMat);
      h.position.set(s * 0.35, 1.25, 0.1);
      h.rotation.z = s * -0.3;
      group.add(h);
    });
  } else if (spec.feature === 'mane') {
    const maneGroup = new THREE.Group();
    const maneMat = mat(0xC9701A);
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const tuft = new THREE.Mesh(new THREE.SphereGeometry(0.22, 6, 6), maneMat);
      tuft.position.set(Math.cos(a) * 0.85, 0.7 + Math.sin(a) * 0.85 * 0.6, Math.sin(a) * 0.3 - 0.2);
      maneGroup.add(tuft);
    }
    group.add(maneGroup);
  } else if (spec.feature === 'whiskers') {
    const whiskerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    [-1, 1].forEach(s => {
      for (let i = 0; i < 2; i++) {
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.5, 4), whiskerMat);
        w.position.set(s * 0.55, 0.62 - i * 0.08, 0.55);
        w.rotation.z = Math.PI / 2 + s * (0.25 + i * 0.15);
        group.add(w);
      }
    });
  } else if (spec.feature === 'finTop') {
    const fin = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.5, 4), secMat);
    fin.position.set(0, 1.15, -0.2);
    fin.rotation.x = Math.PI;
    group.add(fin);
  }

  // Tail
  let tail;
  if (spec.tail === 'long') {
    tail = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.9, 6), bodyMat);
    tail.position.set(0, -0.5, -1.15);
    tail.rotation.x = 0.6;
  } else if (spec.tail === 'tuft') {
    tail = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), bodyMat);
    tail.position.set(0, -0.55, -1.2);
  } else if (spec.tail === 'thin') {
    tail = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 6), bodyMat);
    tail.position.set(0, -0.6, -1.25);
    tail.rotation.x = 0.9;
  } else if (spec.tail === 'fin') {
    tail = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.7, 4), secMat);
    tail.position.set(0, -0.55, -1.5);
    tail.rotation.x = Math.PI / 2;
    tail.rotation.z = Math.PI / 4;
  } else {
    tail = new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 6), bodyMat);
    tail.position.set(0, -0.55, -1.1);
  }
  group.add(tail);

  group.scale.set(0.72, 0.72, 0.72);
  return group;
}

function createCritterViewer(canvas, size = 320) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 1.1, 6.5);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(size, size);

  const key = new THREE.DirectionalLight(0xfff1d6, 1.15);
  key.position.set(3, 5, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x6ec6e8, 0.5);
  fill.position.set(-4, 2, -3);
  scene.add(fill);
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  let current = null;

  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();

  return {
    show(animalId, { spin = true } = {}) {
      if (current) scene.remove(current);
      const spec = ANIMALS.find(a => a.id === animalId);
      current = buildCritter(spec);
      current.rotation.y = -0.4;
      scene.add(current);

      gsap.killTweensOf(current.rotation);
      gsap.killTweensOf(current.position);
      gsap.fromTo(current.scale, { x: 0.1, y: 0.1, z: 0.1 }, { x: 0.72, y: 0.72, z: 0.72, duration: 0.5, ease: 'back.out(2.2)' });
      if (spin) {
        gsap.to(current.rotation, { y: current.rotation.y + Math.PI * 2, duration: 5, ease: 'none', repeat: -1 });
      }
      gsap.to(current.position, { y: 0.15, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      return spec;
    },
    bounce() {
      if (!current) return;
      gsap.to(current.scale, {
        x: 0.85, y: 0.6, z: 0.85, duration: 0.14, ease: 'power1.in', yoyo: true, repeat: 1
      });
    }
  };
}
