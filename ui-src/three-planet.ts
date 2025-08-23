import * as THREE from 'three';
import nx from "./textures/environment/nx.png";
import ny from "./textures/environment/ny.png";
import nz from "./textures/environment/nz.png";
import px from "./textures/environment/px.png";
import py from "./textures/environment/py.png";
import pz from "./textures/environment/pz.png";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextureMap, PlanetryObject } from './constants';

export type PlanetOptions = {
  type: PlanetryObject;
  textures: TextureMap;
  radius?: number; // in Three units
  rotationSpeed?: number; // radians per second
  background?: boolean;
  controls?: boolean;
};

export type LightMode = "sun" | "soft" | "neutral";

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
  private showEnvironment = true;
  private ambientLight?: THREE.AmbientLight;
  private keyLight?: THREE.DirectionalLight;
  private pointLight?: THREE.PointLight;

  constructor(host: HTMLCanvasElement, {
    headless = false, 
    width = host.clientWidth,
    height = host.clientHeight,
    lightMode = "sun", 
    environment = true, 
    controls = true
  }: {
    headless?: boolean;
    width?: number;
    height?: number;
    lightMode?: LightMode;
    environment?: boolean;
    controls?: boolean;
  }) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: host,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height, false);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.camera.position.set(0, 5, 5);
    this.camera.lookAt(0, 0, 0);

    if (controls && !headless) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;   // smooth motion
      this.controls.dampingFactor = 0.1;
      this.controls.enablePan = false;      // optional: disable panning
      this.controls.enableZoom = true;      // allow scroll wheel zoom
      this.controls.minDistance = 1.5;      // min zoom (closer)
      this.controls.maxDistance = 10;       // max zoom (farther)
    }

    // Lights
    // const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    // const key = new THREE.DirectionalLight(0xffffff, 1.0);
    // key.position.set(5, 3, 5);
    // this.scene.add(ambient, key);

    // Environment
    if (environment) this.createEnvironment();

    this.setLighting(lightMode);

    // Resize handling
    if (!headless) {
      const onResize = () => {
        const { clientWidth: w, clientHeight: h } = host;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h, false);
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(host);
    }
  }

  setLighting(mode: LightMode) {
    // Remove previous lights
    if (this.ambientLight) this.scene.remove(this.ambientLight);
    if (this.keyLight) this.scene.remove(this.keyLight);
    if (this.pointLight) this.scene.remove(this.pointLight);

    switch(mode) {
      case 'sun':
        // Very low ambient
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.05);

        // Strong directional light (sun)
        this.keyLight = new THREE.DirectionalLight(0xfff1e0, 3.0); // warm sunlight
        this.keyLight.position.set(10, 5, 5);
        this.keyLight.castShadow = true;
        this.keyLight.shadow.mapSize.width = 2048;
        this.keyLight.shadow.mapSize.height = 2048;
        this.keyLight.shadow.bias = -0.0001;

        this.scene.add(this.ambientLight, this.keyLight);
        break;
      case 'neutral':
      default:
        this.ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        this.keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
        this.keyLight.position.set(5, 3, 5);
        this.scene.add(this.ambientLight, this.keyLight);
        break;
    }
  }

  createEnvironment() {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([px, nx, py, ny, pz, nz]);
    this.scene.background = texture;
  }

  toggleEnvironment(showEnvironment: boolean) {
    this.showEnvironment = showEnvironment;
    if (showEnvironment) {
      this.createEnvironment();
    } else {
      this.scene.background = null;
    }
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
    const { type, textures, radius = 1 } = opts;

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

  // New method for offscreen thumbnail capture
  async renderOnce(): Promise<string> {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        this.renderer.render(this.scene, this.camera);
        resolve(this.renderer.domElement.toDataURL("image/png"));
      });
    });
  }
}