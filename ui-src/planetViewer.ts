import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { TextureMap, PlanetryObject } from "./planets";

// Environment textures
import envNx from "./textures/environment/nx.png";
import envNy from "./textures/environment/ny.png";
import envNz from "./textures/environment/nz.png";
import envPx from "./textures/environment/px.png";
import envPy from "./textures/environment/py.png";
import envPz from "./textures/environment/pz.png";

const ENVIRONMENT_TEXTURES = [envPx, envNx, envPy, envNy, envPz, envNz];

// === Config Constants ===
const CAMERA_FOV = 45;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 1000;
const PLANET_RADIUS = 1;
const RING_INNER_RADIUS = 1.2;
const RING_OUTER_RADIUS = 2.5;

export type PlanetOptions = {
  type: PlanetryObject;
  textures: TextureMap;
  radius?: number;
  tilt?: number;
  rotationSpeed?: number;
  rotationDirection?: "prograde" | "retrograde" | "synchronous";
};

export type LightMode = "sun" | "neutral";

export interface ViewerOptions {
  headless?: boolean;
  width?: number;
  height?: number;
  lightMode?: LightMode;
  environment?: boolean;
  controls?: boolean;
  onZoomChange?: (zoom: number) => void; // <── new
}

// === Helpers ===
const loadTexture = (url?: string): Promise<THREE.Texture | undefined> => {
  if (!url) return Promise.resolve(undefined);
  return new Promise<THREE.Texture>((resolve, reject) => {
    new THREE.TextureLoader().load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        resolve(tex);
      },
      undefined,
      reject
    );
  });
}

const disposeAndRemove = (scene: THREE.Scene, mesh?: THREE.Mesh) => {
  if (!mesh) return;
  (mesh.material as THREE.Material).dispose();
  (mesh.geometry as THREE.BufferGeometry).dispose();
  scene.remove(mesh);
}

const degreesToRadians = (degrees: number): number => {
  return (Math.PI * degrees) / 180;
};

// === Class ===
export class PlanetViewer {
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    1,
    CAMERA_NEAR,
    CAMERA_FAR
  );
  private renderer: THREE.WebGLRenderer;

  private sphere?: THREE.Mesh;
  private atmosphere?: THREE.Mesh;
  private ring?: THREE.Mesh;
  private controls?: OrbitControls;

  private frameId?: number;
  private start = performance.now();

  private tiltEnabled = true; // new flag
  private baseTilt: number = 0; // store the original tilt
  private rotationSpeed = 0.5;
  private showEnvironment = true;
  private currentRotationDirection: "prograde" | "retrograde" | "synchronous" = "prograde";

  private lightGroup = new THREE.Group();

  constructor(host: HTMLCanvasElement, opts: ViewerOptions = {}) {
    const {
      headless = false,
      width = host.clientWidth,
      height = host.clientHeight,
      lightMode = "sun",
      environment = true,
      controls = true,
      onZoomChange
    } = opts;

    this.renderer = this.initRenderer(host, width, height);
    this.initCamera(width, height);

    if (controls && !headless) this.initControls(onZoomChange);
    if (environment) this.createEnvironment();

    this.setLightMode(lightMode);

    if (!headless) this.initResizeObserver(host);
  }

  // === Initialization ===
  private initRenderer(
    host: HTMLCanvasElement,
    width: number,
    height: number
  ): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
      canvas: host,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    return renderer;
  }

  private initCamera(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.camera.position.set(5, 1, 0.5); // slight angle
    this.camera.lookAt(0, 0, 0);
  }

  private initControls(onZoomChange?: (zoom: number) => void) {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.enablePan = false;
    this.controls.enableZoom = true;
    this.controls.minDistance = 1.5;
    this.controls.maxDistance = 10;
    
    if (onZoomChange) {
      this.controls.addEventListener("change", () => {
        const zoom = this.camera.position.distanceTo(this.controls!.target);
        onZoomChange(zoom);
      });
    }
  }

  private initResizeObserver(host: HTMLCanvasElement) {
    const onResize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h, false);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(host);
  }

  setZoomLevel(distance: number) {
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    this.camera.position.copy(dir.multiplyScalar(-distance));
    this.camera.updateProjectionMatrix();
  }

  // === Lighting ===
  setLightMode(mode: LightMode) {
    this.scene.remove(this.lightGroup);
    this.lightGroup.clear();

    if (mode === "sun") {
      const ambient = new THREE.AmbientLight(0xffffff, 0.05);
      const key = new THREE.DirectionalLight(0xfff1e0, 3.0);
      key.position.set(10, 5, 5);
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      key.shadow.bias = -0.0001;
      this.lightGroup.add(ambient, key);
    } else {
      const ambient = new THREE.AmbientLight(0xffffff, 1.5);
      const key = new THREE.DirectionalLight(0xffffff, 1.5);
      key.position.set(5, 3, 5);
      this.lightGroup.add(ambient, key);
    }

    this.scene.add(this.lightGroup);
  }

  // === Environment ===
  private createEnvironment() {
    const loader = new THREE.CubeTextureLoader();
    this.scene.background = loader.load(ENVIRONMENT_TEXTURES);
  }

  toggleEnvironment(show: boolean) {
    this.showEnvironment = show;
    this.scene.background = show
      ? new THREE.CubeTextureLoader().load(ENVIRONMENT_TEXTURES)
      : null;
  }

  toggleTilt(enabled: boolean) {
    this.tiltEnabled = enabled;
    if (!this.sphere) return;

    this.sphere.rotation.x = enabled ? this.baseTilt * -1 : 0;

    if (this.ring) {
      this.ring.rotation.x = Math.PI / 2 - (enabled ? this.baseTilt : 0);
    }
  }

  // === Planet Setup ===
  private createRingMesh(texture: THREE.Texture): THREE.Mesh {
    const ringGeometry = new THREE.RingGeometry(
      RING_INNER_RADIUS,
      RING_OUTER_RADIUS,
      128
    );
    const pos = ringGeometry.attributes.position;
    const uv = ringGeometry.attributes.uv;

    for (let i = 0; i < uv.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const r = Math.sqrt(x * x + y * y);
      uv.setXY(i, (r - RING_INNER_RADIUS) / (RING_OUTER_RADIUS - RING_INNER_RADIUS), 0.5);
    }
    uv.needsUpdate = true;

    const ringMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.receiveShadow = true;
    ring.rotation.x = Math.PI / 2;
    return ring;
  }

  async setPlanet(opts: PlanetOptions) {
    const { type, textures, rotationDirection = "prograde", tilt = 0, radius = 1 } = opts;
    this.currentRotationDirection = rotationDirection;

    const [baseTex, bumpTex, specTex, atmTex, atmAlpha, ringTex] =
      await Promise.all([
        loadTexture(textures.map),
        loadTexture(textures.bump),
        loadTexture(textures.specular),
        loadTexture(textures.atmosphere),
        loadTexture(textures.atmosphereAlpha),
        loadTexture(textures.ring),
      ]);

    // Clean up old
    disposeAndRemove(this.scene, this.sphere);
    disposeAndRemove(this.scene, this.atmosphere);
    disposeAndRemove(this.scene, this.ring);

    // Planet sphere
    const geom = new THREE.SphereGeometry(PLANET_RADIUS, 96, 96);
    let mat: THREE.Material;
    if (type === "star") {
      mat = new THREE.MeshBasicMaterial({
        map: baseTex,
        toneMapped: false,
        color: new THREE.Color(2.5, 2.5, 2.5),
      });
    } else {
      mat = new THREE.MeshPhongMaterial({
        map: baseTex,
        bumpMap: bumpTex,
        bumpScale: bumpTex ? radius / 350 : 0,
        specularMap: specTex,
        shininess: specTex ? 5 : 0,
      });
    }
    this.sphere = new THREE.Mesh(geom, mat);
    this.baseTilt = degreesToRadians(tilt);
    this.sphere.rotation.x = this.tiltEnabled ? this.baseTilt * -1 : 0;
    this.scene.add(this.sphere);

    // Atmosphere
    if (atmTex) {
      const atmGeom = new THREE.SphereGeometry(PLANET_RADIUS * 1.02, 96, 96);
      const atmMat = new THREE.MeshPhongMaterial({
        map: atmTex,
        alphaMap: atmAlpha,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      this.atmosphere = new THREE.Mesh(atmGeom, atmMat);
      this.sphere.add(this.atmosphere);
    }

    // Rings
    if (ringTex) {
      this.ring = this.createRingMesh(ringTex);
      this.scene.add(this.ring);
      this.ring.rotation.x = Math.PI / 2 - (this.tiltEnabled ? this.baseTilt : 0);
    }
  }

  // === Animation ===
  setRotationSpeed(radPerSec: number) {
    this.rotationSpeed = radPerSec;
  }

  startLoop() {
    const tick = (t: number) => {
      const dt = (t - this.start) / 1000;
      this.start = t;

      if (this.sphere && this.rotationSpeed !== 0) {
        let directionMultiplier = 1;
        if (this.currentRotationDirection === "retrograde") directionMultiplier = -1;
        else if (this.currentRotationDirection === "synchronous") directionMultiplier = 0;

        this.sphere.rotation.y += this.rotationSpeed * dt * directionMultiplier;
      }

      this.controls?.update();
      this.renderer.render(this.scene, this.camera);
      this.frameId = requestAnimationFrame(tick);
    };
    if (!this.frameId) this.frameId = requestAnimationFrame(tick);
  }

  stopLoop(fullStop = false) {
    if (fullStop && this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = undefined;
    }
    this.rotationSpeed = 0;
  }

  // === Utilities ===
  async renderOnce(): Promise<string> {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        this.renderer.render(this.scene, this.camera);
        resolve(this.renderer.domElement.toDataURL("image/png"));
      });
    });
  }
}