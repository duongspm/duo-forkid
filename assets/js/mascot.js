/* ============================================
   Mascot — low-poly bunny "Bo" built from Three.js
   primitives. Lightweight enough for tablets.
   ============================================ */

function createMascot(canvas, opts = {}) {
  const size = opts.size || 220;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 1.4, 7);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(size, size);

  // Soft lighting — warm key + cool fill, no harsh shadows (friendly toy look)
  const key = new THREE.DirectionalLight(0xfff1d6, 1.1);
  key.position.set(3, 5, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x6ec6e8, 0.5);
  fill.position.set(-4, 2, -3);
  scene.add(fill);
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));

  const bunny = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, flatShading: true });
  const pinkMat = new THREE.MeshStandardMaterial({ color: 0xffb3c1, roughness: 0.5, flatShading: true });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x4a3b52, roughness: 0.4, flatShading: true });

  // Body
  const body = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 1), bodyMat);
  body.scale.set(1, 0.92, 1);
  body.position.y = -0.6;
  bunny.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.85, 1), bodyMat);
  head.position.y = 0.75;
  bunny.add(head);

  // Ears
  const earGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.9, 6);
  const earL = new THREE.Mesh(earGeo, bodyMat);
  earL.position.set(-0.32, 1.75, 0);
  earL.rotation.z = 0.18;
  bunny.add(earL);
  const earR = earL.clone();
  earR.position.x = 0.32;
  earR.rotation.z = -0.18;
  bunny.add(earR);

  const earInnerGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.55, 6);
  const earInL = new THREE.Mesh(earInnerGeo, pinkMat);
  earInL.position.set(-0.32, 1.72, 0.1);
  earInL.rotation.z = 0.18;
  bunny.add(earInL);
  const earInR = earInL.clone();
  earInR.position.x = 0.32;
  earInR.rotation.z = -0.18;
  bunny.add(earInR);

  // Cheeks (blush)
  const cheekGeo = new THREE.CircleGeometry(0.14, 12);
  const cheekL = new THREE.Mesh(cheekGeo, pinkMat);
  cheekL.position.set(-0.42, 0.6, 0.76);
  bunny.add(cheekL);
  const cheekR = cheekL.clone();
  cheekR.position.x = 0.42;
  bunny.add(cheekR);

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.09, 8, 8);
  const eyeL = new THREE.Mesh(eyeGeo, darkMat);
  eyeL.position.set(-0.3, 0.82, 0.78);
  bunny.add(eyeL);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.3;
  bunny.add(eyeR);

  // Nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), pinkMat);
  nose.position.set(0, 0.66, 0.85);
  bunny.add(nose);

  // Tail
  const tail = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 10), bodyMat);
  tail.position.set(0, -0.6, -1.1);
  bunny.add(tail);

  bunny.scale.set(0.85, 0.85, 0.85);
  scene.add(bunny);

  // Idle animation: gentle bob + sway via GSAP
  gsap.to(bunny.position, { y: 0.18, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to(bunny.rotation, { y: 0.28, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to(earL.rotation, { z: 0.34, duration: 1.9, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.1 });
  gsap.to(earR.rotation, { z: -0.34, duration: 1.9, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.1 });

  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();

  return {
    hop() {
      const tl = gsap.timeline();
      tl.to(bunny.scale, { y: 0.6, x: 1.05, z: 1.05, duration: 0.12, ease: 'power1.in' })
        .to(bunny.position, { y: 0.9, duration: 0.22, ease: 'power2.out' }, '<')
        .to(bunny.scale, { y: 0.85, x: 0.85, z: 0.85, duration: 0.18 }, '>-0.05')
        .to(bunny.position, { y: 0, duration: 0.28, ease: 'bounce.out' });
    },
    say() {
      gsap.to(bunny.rotation, { z: 0.12, duration: 0.15, yoyo: true, repeat: 3, ease: 'sine.inOut' });
    }
  };
}
