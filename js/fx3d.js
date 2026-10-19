/* ================================================
   FX3D: WebGL layer (three.js, vendored, lazy-loaded by motion.js)

   1. World: one fixed full-page canvas behind the content.
      - Hero: a neural core (nodes + pulsing links) that bends toward the cursor.
      - Scroll: the camera flies out through the core and down a tunnel,
        passing one glowing gate per section. Scroll velocity stretches
        starlight into warp streaks, so jumps between sections feel fast.
   2. Signature: a chrome "N" monogram in the contact section (own small canvas).

   Everything is progressive enhancement: any failure leaves the 2D site intact.
   ================================================ */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/RoomEnvironment.js';

const root = document.documentElement;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const rand = (a, b) => a + Math.random() * (b - a);

const BLUE = new THREE.Color('#3a4eff');
const CYAN = new THREE.Color('#00c8ff');
const VIOLET = new THREE.Color('#6c63ff');
const PALETTE = [BLUE, CYAN, VIOLET];

/* ---------- world ---------- */
export function startWorld({ mobile }) {
  const renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
  const dprCap = mobile ? 1.25 : 1.75;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.className = 'fx3d-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const scene = new THREE.Scene();
  const FOV = 55, CAM0 = 9, SP = 11; // camera start z, distance between section stops
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 160);
  camera.position.set(0, 0, CAM0);
  const px = () => renderer.getPixelRatio();

  /* --- neural core --- */
  const core = new THREE.Group();
  scene.add(core);
  const N = mobile ? 130 : 300;
  const R = mobile ? 3.3 : 4.3;
  const pos = [], phase = [], size = [];
  for (let i = 0; i < N; i++) {
    const inner = i > N * 0.78;
    const y = 1 - (i / (N - 1)) * 2, rr = Math.sqrt(1 - y * y), th = i * 2.399963;
    const radius = inner ? R * rand(0.15, 0.7) : R * rand(0.88, 1.12);
    pos.push(Math.cos(th) * rr * radius, y * radius, Math.sin(th) * rr * radius);
    phase.push(Math.random());
    size.push(inner ? rand(0.5, 1.0) : rand(0.7, 2.0));
  }
  // links: each node to its 2-3 nearest neighbours
  const edges = new Set(), segPos = [], segNode = [], segAlong = [], segPh = [];
  for (let i = 0; i < N; i++) {
    const d = [];
    for (let j = 0; j < N; j++) {
      if (i === j) continue;
      const dx = pos[i * 3] - pos[j * 3], dy = pos[i * 3 + 1] - pos[j * 3 + 1], dz = pos[i * 3 + 2] - pos[j * 3 + 2];
      d.push([dx * dx + dy * dy + dz * dz, j]);
    }
    d.sort((a, b) => a[0] - b[0]);
    for (let k = 0; k < (i % 3 === 0 ? 3 : 2); k++) {
      const j = d[k][1], key = i < j ? i + '_' + j : j + '_' + i;
      if (edges.has(key)) continue;
      edges.add(key);
      const ph = Math.random();
      [[i, 0], [j, 1]].forEach(([n, along]) => {
        segPos.push(pos[n * 3], pos[n * 3 + 1], pos[n * 3 + 2]);
        segNode.push(phase[n]); segAlong.push(along); segPh.push(ph);
      });
    }
  }

  const coreUniforms = {
    uTime: { value: 0 }, uMouse: { value: new THREE.Vector3(99, 99, 99) }, uExplode: { value: 0 },
    uAlpha: { value: 1 }, uPx: { value: px() }, uC1: { value: CYAN }, uC2: { value: BLUE },
  };
  const DISPLACE = /* glsl */`
    uniform float uTime; uniform vec3 uMouse; uniform float uExplode;
    vec3 displace(vec3 p, float ph) {
      p += normalize(p + 1e-4) * sin(uTime * 0.7 + ph * 6.2831) * 0.07;
      float f = smoothstep(1.9, 0.0, distance(p, uMouse));
      p += (uMouse - p) * f * 0.28;
      p *= 1.0 + uExplode * (1.2 + ph * 2.2);
      return p;
    }`;

  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  pg.setAttribute('aPh', new THREE.Float32BufferAttribute(phase, 1));
  pg.setAttribute('aSize', new THREE.Float32BufferAttribute(size, 1));
  const pointsMat = new THREE.ShaderMaterial({
    uniforms: coreUniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: DISPLACE + /* glsl */`
      attribute float aPh; attribute float aSize; uniform float uPx;
      varying float vPh; varying float vTw;
      void main() {
        vec3 p = displace(position, aPh);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vPh = aPh; vTw = 0.65 + 0.35 * sin(uTime * 1.6 + aPh * 40.0);
        gl_PointSize = 72.0 * aSize * uPx * vTw / -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 uC1; uniform vec3 uC2; uniform float uAlpha; varying float vPh; varying float vTw;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = pow(smoothstep(0.5, 0.0, d), 1.7);
        gl_FragColor = vec4(mix(uC1, uC2, vPh) * 1.7, a * vTw * uAlpha);
      }`,
  });
  core.add(new THREE.Points(pg, pointsMat));

  const lg = new THREE.BufferGeometry();
  lg.setAttribute('position', new THREE.Float32BufferAttribute(segPos, 3));
  lg.setAttribute('aNode', new THREE.Float32BufferAttribute(segNode, 1));
  lg.setAttribute('aAlong', new THREE.Float32BufferAttribute(segAlong, 1));
  lg.setAttribute('aPh', new THREE.Float32BufferAttribute(segPh, 1));
  const linesMat = new THREE.ShaderMaterial({
    uniforms: coreUniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: DISPLACE + /* glsl */`
      attribute float aNode; attribute float aAlong; attribute float aPh;
      varying float vAlong; varying float vPh;
      void main() {
        vAlong = aAlong; vPh = aPh;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displace(position, aNode), 1.0);
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 uC1; uniform vec3 uC2; uniform float uAlpha; uniform float uTime;
      varying float vAlong; varying float vPh;
      void main() {
        float t = fract(uTime * 0.22 + vPh);
        float head = smoothstep(0.16, 0.0, abs(vAlong - t));
        gl_FragColor = vec4(mix(uC1, uC2, vPh) * 1.3, (0.17 + head * 0.9) * uAlpha);
      }`,
  });
  core.add(new THREE.LineSegments(lg, linesMat));

  /* --- tunnel: starlight, warp streaks, section gates --- */
  const secs = [...document.querySelectorAll('section[data-app]')];
  const GATES = secs.length;
  const ZMIN = -(SP * GATES + 24);
  const tunnelUniforms = { uTint: { value: BLUE.clone() }, uPx: { value: px() }, uLen: { value: 0 }, uStreak: { value: 0 } };

  const TN = mobile ? 650 : 1500;
  const tp = [], tph = [];
  for (let i = 0; i < TN; i++) {
    const a = Math.random() * Math.PI * 2, r = 2.2 + Math.pow(Math.random(), 0.6) * 13;
    tp.push(Math.cos(a) * r, Math.sin(a) * r, rand(ZMIN, 0));
    tph.push(Math.random());
  }
  const tg = new THREE.BufferGeometry();
  tg.setAttribute('position', new THREE.Float32BufferAttribute(tp, 3));
  tg.setAttribute('aPh', new THREE.Float32BufferAttribute(tph, 1));
  const FADE = /* glsl */`float fade(float z) { return smoothstep(70.0, 12.0, z) * smoothstep(0.4, 3.0, z); }`;
  scene.add(new THREE.Points(tg, new THREE.ShaderMaterial({
    uniforms: tunnelUniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: FADE + /* glsl */`
      attribute float aPh; uniform float uPx; varying float vA; varying float vPh;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vA = fade(-mv.z); vPh = aPh;
        gl_PointSize = (24.0 + aPh * 40.0) * uPx / max(-mv.z, 0.5);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 uTint; varying float vA; varying float vPh;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = pow(smoothstep(0.5, 0.0, d), 1.8);
        gl_FragColor = vec4(mix(uTint, vec3(1.0), vPh * 0.35), a * vA * (0.6 + vPh * 0.6));
      }`,
  })));

  const SN = mobile ? 220 : 520, sp = [], se = [];
  for (let i = 0; i < SN; i++) {
    const a = Math.random() * Math.PI * 2, r = 1.6 + Math.pow(Math.random(), 0.7) * 11, z = rand(ZMIN, 0);
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    sp.push(x, y, z, x, y, z); se.push(0, 1);
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  sg.setAttribute('aEnd', new THREE.Float32BufferAttribute(se, 1));
  const streaks = new THREE.LineSegments(sg, new THREE.ShaderMaterial({
    uniforms: tunnelUniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: FADE + /* glsl */`
      attribute float aEnd; uniform float uLen; varying float vA; varying float vE;
      void main() {
        vec3 p = position; p.z += aEnd * uLen;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vA = fade(-mv.z); vE = 1.0 - aEnd;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 uTint; uniform float uStreak; varying float vA; varying float vE;
      void main() { gl_FragColor = vec4(mix(uTint, vec3(1.0), 0.5), vA * vE * uStreak); }`,
  }));
  streaks.frustumCulled = false;
  scene.add(streaks);

  const gateMats = [], gates = [], gateOp = [];
  for (let i = 1; i < GATES; i++) {
    [[6.2, 0.028, 0.42], [9.5, 0.018, 0.2]].forEach(([rad, tube, op], k) => {
      const m = new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false });
      const mesh = new THREE.Mesh(new THREE.TorusGeometry(rad, tube, 6, mobile ? 64 : 120), m);
      mesh.position.z = CAM0 - i * SP - 4 - k * 2.5;
      scene.add(mesh); gateMats.push(m); gates.push(mesh); gateOp.push(op * 1.5);
    });
  }

  /* --- layout and scroll mapping --- */
  let vw = 0, vh = 0, tops = [], coreScale = 1;
  const portrait = document.querySelector('.hud-frame');
  const layout = () => {
    const nw = window.innerWidth, nh = window.innerHeight;
    if (nw === vw && Math.abs(nh - vh) < 120) return; // ignore mobile URL-bar jitter
    vw = nw; vh = nh;
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh; camera.updateProjectionMatrix();
    measure();
  };
  const measure = () => {
    tops = secs.map(s => s.getBoundingClientRect().top + window.scrollY);
    const halfH = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAM0, halfW = halfH * camera.aspect;
    if (portrait && vw >= 900) {
      const r = portrait.getBoundingClientRect(), sy = window.scrollY;
      core.position.set(((r.left + r.width / 2) / vw * 2 - 1) * halfW * 0.86, -(((r.top + sy + r.height / 2) / vh) * 2 - 1) * halfH, 0);
      coreScale = 1;
    } else {
      core.position.set(0, halfH * 0.1, 0);
      coreScale = 0.78;
    }
    core.scale.setScalar(coreScale);
  };
  const progress = () => { // fractional section index of the viewport line
    const y = window.scrollY + vh * 0.4;
    let i = 0;
    for (let k = 0; k < tops.length; k++) if (y >= tops[k]) i = k;
    const next = tops[i + 1] ?? (document.documentElement.scrollHeight);
    return i + clamp((y - tops[i]) / Math.max(next - tops[i], 1), 0, 1);
  };
  layout();
  window.addEventListener('resize', layout, { passive: true });
  window.addEventListener('load', measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  if (window.ScrollTrigger) window.ScrollTrigger.addEventListener('refresh', measure);

  /* --- pointer --- */
  const ndc = new THREE.Vector2(2, 2), ndcS = new THREE.Vector2(0, 0);
  window.addEventListener('pointermove', e => { ndc.set((e.clientX / vw) * 2 - 1, -(e.clientY / vh) * 2 + 1); }, { passive: true });
  const tmp = new THREE.Vector3(), mouseW = new THREE.Vector3();
  const mouseOnPlane = () => {
    tmp.set(ndc.x, ndc.y, 0.5).unproject(camera).sub(camera.position).normalize();
    const t = (core.position.z - camera.position.z) / tmp.z;
    return mouseW.copy(camera.position).addScaledVector(tmp, t);
  };

  /* --- loop --- */
  let cz = CAM0, last = performance.now(), warpShown = 0, running = true, shown = false;
  const tint = new THREE.Color();
  const frame = now => {
    if (!running) return;
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    const idx = progress();
    const target = CAM0 - idx * SP;
    const vel = target - cz;
    cz += vel * Math.min(1, dt * 5);

    ndcS.lerp(ndc.x > 1.5 ? ndcS : ndc, Math.min(1, dt * 4));
    camera.position.set(ndcS.x * 0.45, ndcS.y * 0.3, cz);
    camera.rotation.z = clamp(-vel * 0.004, -0.06, 0.06);

    // core
    const hp = clamp(idx, 0, 1.6);
    core.visible = idx < 1.7;
    if (core.visible) {
      coreUniforms.uTime.value += dt;
      coreUniforms.uExplode.value = smooth(0.35, 1.0, hp) * 1.6;
      coreUniforms.uAlpha.value = (1 - smooth(0.55, 1.15, hp)) * (vw < 900 ? 0.55 : 1);
      core.rotation.y += dt * 0.09;
      core.rotation.x += ((ndcS.y * 0.25) - core.rotation.x) * Math.min(1, dt * 2);
      core.updateMatrixWorld();
      coreUniforms.uMouse.value.copy(core.worldToLocal(mouseOnPlane()));
      if (ndc.x > 1.5) coreUniforms.uMouse.value.set(99, 99, 99);
    }

    // section colour grade
    const fi = Math.floor(idx) % PALETTE.length, f = idx - Math.floor(idx);
    tint.copy(PALETTE[fi]).lerp(PALETTE[(fi + 1) % PALETTE.length], smooth(0.6, 1, f));
    tunnelUniforms.uTint.value.copy(tint);
    gateMats.forEach(m => m.color.copy(tint));
    gates.forEach((g, i) => {
      g.rotation.z += dt * (i % 2 ? 0.05 : -0.04);
      const d = cz - g.position.z; // gates only appear once the camera is close
      gateMats[i].opacity = gateOp[i] * smooth(12, 6, d) * smooth(0.6, 3, d);
    });

    // warp
    const v = Math.abs(vel);
    tunnelUniforms.uLen.value = clamp(vel * 0.55, -26, 26);
    tunnelUniforms.uStreak.value = clamp(v * 0.07, 0, 0.9);
    const w = clamp(v / 14, 0, 1);
    if (Math.abs(w - warpShown) > 0.02) { warpShown = w; root.style.setProperty('--warp', w.toFixed(2)); }

    renderer.render(scene, camera);
    if (!shown) { shown = true; root.classList.add('fx3d'); }
  };
  requestAnimationFrame(frame);

  document.addEventListener('visibilitychange', () => {
    const vis = !document.hidden;
    if (vis && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
    else if (!vis) running = false;
  });
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); running = false; root.classList.remove('fx3d'); });
}

/* ---------- signature object: chrome N ---------- */
export function startSignature(host, { mobile }) {
  host.classList.add('is-live'); // reveal the host first so it can be measured
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0, 7.4);

  const H = 2.2, W = 1.75, w = 0.46;
  const rect = (x0, y0, x1, y1) => new THREE.Shape([[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(p => new THREE.Vector2(...p)));
  const diag = new THREE.Shape([[0, H], [w * 1.15, H], [W, 0], [W - w * 1.15, 0]].map(p => new THREE.Vector2(...p)));
  const ext = (shape, depth) => new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.06, bevelSegments: 5, curveSegments: 4 });
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xe4e9ff, metalness: 1, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.06,
    iridescence: 0.6, iridescenceIOR: 1.5, envMapIntensity: 3.2, emissive: 0x0c1440, emissiveIntensity: 0.6,
  });
  const logo = new THREE.Group();
  [[rect(0, 0, w, H), 0.5], [rect(W - w, 0, W, H), 0.5], [diag, 0.46]].forEach(([s, d]) => {
    const m = new THREE.Mesh(ext(s, d), mat); m.position.z = -d / 2; logo.add(m);
  });
  logo.position.set(-W / 2, -H / 2, 0);
  const pivot = new THREE.Group();
  pivot.add(logo);
  scene.add(pivot);

  const halo = [0, 1].map(i => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(2.0 + i * 0.35, 0.012, 6, 140),
      new THREE.MeshBasicMaterial({ color: i ? CYAN : BLUE, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
    m.rotation.set(1.2 + i * 0.5, 0.3, i * 1.1);
    scene.add(m); return m;
  });
  const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(-3, 4, 5); scene.add(key);
  const l1 = new THREE.PointLight(0x3a4eff, 90, 20); l1.position.set(-4, 2, 4); scene.add(l1);
  const l2 = new THREE.PointLight(0x00c8ff, 80, 20); l2.position.set(4, -2, 3); scene.add(l2);

  const size = () => {
    const r = host.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height; camera.updateProjectionMatrix();
  };
  size();
  window.addEventListener('resize', size, { passive: true });

  const aim = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  window.addEventListener('pointermove', e => {
    const r = host.getBoundingClientRect();
    aim.x = clamp((e.clientX - (r.left + r.width / 2)) / window.innerWidth, -0.5, 0.5);
    aim.y = clamp((e.clientY - (r.top + r.height / 2)) / window.innerHeight, -0.5, 0.5);
  }, { passive: true });
  let spin = 0;
  host.addEventListener('click', () => { if (window.gsap) window.gsap.to({ v: 0 }, { v: 1, duration: 1.6, ease: 'expo.out', onUpdate() { spin = this.targets()[0].v * Math.PI * 2; } }); });

  let visible = false, running = false, last = performance.now(), t = 0;
  const frame = now => {
    if (!visible || document.hidden) { running = false; return; }
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05); last = now; t += dt;
    cur.x += (aim.x - cur.x) * Math.min(1, dt * 4); cur.y += (aim.y - cur.y) * Math.min(1, dt * 4);
    pivot.rotation.y = cur.x * 2.4 + spin + Math.sin(t * 0.6) * 0.25;
    pivot.rotation.x = cur.y * 1.6 + Math.cos(t * 0.5) * 0.08;
    pivot.position.y = Math.sin(t * 1.1) * 0.08;
    halo.forEach((h, i) => { h.rotation.z += dt * (i ? -0.35 : 0.25); h.rotation.x += dt * 0.08; });
    renderer.render(scene, camera);
  };
  const wake = () => { if (!running && visible && !document.hidden) { running = true; last = performance.now(); requestAnimationFrame(frame); } };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); }, { rootMargin: '80px' }).observe(host);
  document.addEventListener('visibilitychange', wake);
}
