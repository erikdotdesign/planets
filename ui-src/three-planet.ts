import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextureMap, PlanetryObject } from './constants';

export type PlanetOptions = {
  type: PlanetryObject;
  textures: TextureMap;
  radius?: number; // in Three units
  rotationSpeed?: number; // radians per second
  background?: string; // CSS color
};

export class PlanetViewer {
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  private renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  private sphere?: THREE.Mesh;
  private frameId?: number;
  private start = performance.now();
  private atmosphere?: THREE.Mesh;
  private ring?: THREE.Mesh;
  private controls?: OrbitControls;
  private rotationSpeed = 0.5;

  constructor(private host: HTMLElement) {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(host.clientWidth, host.clientHeight, false);
    host.appendChild(this.renderer.domElement);

    this.camera.position.set(0, 0, 2.2);
    this.camera.position.z = 3;
    this.camera.position.set(0, 5, 5);
    this.camera.lookAt(0, 0, 0);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;   // smooth motion
    this.controls.dampingFactor = 0.1;
    this.controls.enablePan = false;      // optional: disable panning
    this.controls.enableZoom = true;      // allow scroll wheel zoom
    this.controls.minDistance = 1.5;      // min zoom (closer)
    this.controls.maxDistance = 10;       // max zoom (farther)

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(5, 3, 5);
    this.scene.add(ambient, key);

    // Resize handling
    const onResize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h, false);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(host);
  }

  createRingMesh (texture: THREE.Texture): THREE.Mesh {
    const innerRadius = 1.2;
    const outerRadius = 2.5;
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);
    const pos = ringGeometry.attributes.position;

    const uv = ringGeometry.attributes.uv;
    for (let i = 0; i < uv.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const r = Math.sqrt(x * x + y * y);            // distance from center
      uv.setXY(i, (r - innerRadius) / (outerRadius - innerRadius), 0.5);
    }
    uv.needsUpdate = true;

    const ringMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
    });

    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    rings.receiveShadow = true;
    rings.rotation.x = Math.PI / 2; // tilt to lie flat
    return rings;
  }

  async setPlanet(opts: PlanetOptions) {
    const { type, textures, radius = 1, background, rotationSpeed } = opts;

    if (background) this.host.style.background = background;

    const loader = new THREE.TextureLoader();
    const loadTex = (url?: string) =>
      url
        ? new Promise<THREE.Texture>((resolve, reject) =>
            loader.load(url, resolve, undefined, reject)
          ).then(tex => {
            tex.colorSpace = THREE.SRGBColorSpace;
            return tex;
          })
        : Promise.resolve(undefined);

    // Load all textures in parallel
    const [baseTex, bumpTex, specTex, atmTex, atmAlpha, ringTex] = await Promise.all([
      loadTex(textures.map),
      loadTex(textures.bump),
      loadTex(textures.specular),
      loadTex(textures.atmosphere),
      loadTex(textures.atmosphereAlpha),
      loadTex(textures.ring)
    ]);

    // Clean up old meshes
    if (this.sphere) {
      (this.sphere.material as THREE.Material).dispose();
      (this.sphere.geometry as THREE.BufferGeometry).dispose();
      this.scene.remove(this.sphere);
    }
    if (this.atmosphere) {
      (this.atmosphere.material as THREE.Material).dispose();
      (this.atmosphere.geometry as THREE.BufferGeometry).dispose();
      this.scene.remove(this.atmosphere);
    }
    if (this.ring) {
      (this.ring.material as THREE.Material).dispose();
      (this.ring.geometry as THREE.BufferGeometry).dispose();
      this.scene.remove(this.ring);
    }

    // Main planet mesh
    const geom = new THREE.SphereGeometry(radius, 96, 96);
    let mat;
    if (type === "star") {
      mat = new THREE.MeshBasicMaterial({
        map: baseTex,
        lightMapIntensity: 2,
        toneMapped: false,
        color: new THREE.Color(2.5, 2.5, 2.5),
      });
    } else {
      mat = new THREE.MeshPhongMaterial({
        map: baseTex,
        bumpMap: bumpTex,
        bumpScale: bumpTex ? 0.05 : 0,
        specularMap: specTex,
        shininess: specTex ? 30 : 0
      });
    }
    this.sphere = new THREE.Mesh(geom, mat);
    this.scene.add(this.sphere);

    // Optional atmosphere shell
    if (atmTex) {
      const atmGeom = new THREE.SphereGeometry(radius * 1.02, 96, 96);
      const atmMat = new THREE.MeshPhongMaterial({
        map: atmTex,
        alphaMap: textures.atmosphereAlpha ? atmAlpha : undefined,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      this.atmosphere = new THREE.Mesh(atmGeom, atmMat);
      this.sphere.add(this.atmosphere);
    }
    if (ringTex) {
      this.ring = this.createRingMesh(ringTex);
      this.scene.add(this.ring);
    }
  }

  setRotationSpeed(radPerSec: number) {
    this.rotationSpeed = radPerSec;
  }

  startLoop() {
    const tick = (t: number) => {
      const dt = (t - this.start) / 1000;
      this.start = t;

      // Only rotate if rotationSpeed > 0
      if (this.sphere && this.rotationSpeed !== 0) {
        this.sphere.rotation.y += this.rotationSpeed * dt;
      }

      this.controls?.update();
      this.renderer.render(this.scene, this.camera);

      this.frameId = requestAnimationFrame(tick);
    };
    if (!this.frameId) this.frameId = requestAnimationFrame(tick);
  }

  stopLoop() {
    // Instead of killing the loop, just stop rotation
    this.rotationSpeed = 0;
  }

  getCanvas(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  // snapshot(width = 1200, height = 1200): Uint8Array {
  //   const prevSize = this.renderer.getSize(new THREE.Vector2());
  //   const prevPixelRatio = this.renderer.getPixelRatio();

  //   this.renderer.setPixelRatio(1);
  //   this.renderer.setSize(width, height, false);
  //   this.renderer.render(this.scene, this.camera);

  //   const dataURL = this.renderer.domElement.toDataURL('image/png');

  //   // restore
  //   this.renderer.setPixelRatio(prevPixelRatio);
  //   this.renderer.setSize(prevSize.x, prevSize.y, false);

  //   // Convert dataURL to bytes
  //   const base64 = dataURL.split(',')[1];
  //   const raw = atob(base64);
  //   const bytes = new Uint8Array(raw.length);
  //   for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  //   return bytes;
  // }
}