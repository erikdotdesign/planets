import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer, EffectPass, RenderPass, SelectiveBloomEffect } from "postprocessing";

import { TextureMap, PLANETS } from "./planets";

// Environment textures
import envNx from "./textures/environment/nx.png";
import envNy from "./textures/environment/ny.png";
import envNz from "./textures/environment/nz.png";
import envPx from "./textures/environment/px.png";
import envPy from "./textures/environment/py.png";
import envPz from "./textures/environment/pz.png";

const ENVIRONMENT_TEXTURES = [envPx, envNx, envPy, envNy, envPz, envNz];
const CAMERA_FOV = 45;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 1000;
const PLANET_RADIUS = 1;

export type PlanetOptions = {
  planet: keyof typeof PLANETS;
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
  atmosphere?: boolean;
  controls?: boolean;
  onZoomChange?: (zoom: number) => void;
}

export class PlanetViewer {
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, CAMERA_NEAR, CAMERA_FAR);
  private renderer: THREE.WebGLRenderer;

  private composer?: EffectComposer;
  private bloomEffect?: SelectiveBloomEffect;

  private sphere?: THREE.Mesh;
  private atmosphere?: THREE.Mesh;
  private ring?: THREE.Mesh;
  private controls?: OrbitControls;

  private frameId?: number;
  private start = performance.now();

  private tiltEnabled = true;
  private baseTilt: number = 0;
  private rotationSpeed = 0.5;
  private showEnvironment = true;
  private showAtmosphere = true;
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
      atmosphere = true,
    } = opts;

    this.renderer = new THREE.WebGLRenderer({
      canvas: host,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height, false);

    this.initCamera(width, height);
    if (controls && !headless) this.initControls();
    if (environment) this.createEnvironment();
    this.showAtmosphere = atmosphere;

    this.initComposer(width, height);
    this.setLightMode(lightMode);

    if (!headless) this.initResizeObserver(host);
  }

  // === Initialization ===
  private initCamera(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.camera.position.set(5, 1, 0.5);
    this.camera.lookAt(0, 0, 0);
  }

  private initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.enablePan = false;
    this.controls.enableZoom = true;
    this.controls.minDistance = 1.5;
    this.controls.maxDistance = 10;
  }

  private initResizeObserver(host: HTMLCanvasElement) {
    const onResize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h, false);
      this.composer?.setSize(w, h);
    };
    new ResizeObserver(onResize).observe(host);
  }

  private initComposer(width: number, height: number) {
    this.composer = new EffectComposer(this.renderer, { multisampling: 4 });
    const renderPass = new RenderPass(this.scene, this.camera);

    this.bloomEffect = new SelectiveBloomEffect(this.scene, this.camera, {
      mipmapBlur: true,
      luminanceThreshold: 0.0,
      intensity: 2.0,
      radius: 0.5,
    });

    const effectPass = new EffectPass(this.camera, this.bloomEffect);
    this.composer.addPass(renderPass);
    this.composer.addPass(effectPass);
    this.composer.setSize(width, height);
  }

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
    this.scene.background = show ? new THREE.CubeTextureLoader().load(ENVIRONMENT_TEXTURES) : null;
  }

  toggleAtmosphere(show: boolean) {
    this.showAtmosphere = show;
    if (this.atmosphere) this.atmosphere.visible = show;
  }

  toggleTilt(enabled: boolean) {
    this.tiltEnabled = enabled;
    if (!this.sphere) return;

    this.sphere.rotation.x = enabled ? this.baseTilt * -1 : 0;
    if (this.ring) this.ring.rotation.x = Math.PI / 2 - (enabled ? this.baseTilt : 0);
  }

  private degreesToRadians(deg: number) {
    return (Math.PI * deg) / 180;
  }

  private async loadTexture(url?: string) {
    if (!url) return undefined;
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

  private disposeAndRemove(mesh?: THREE.Mesh) {
    if (!mesh) return;
    (mesh.material as THREE.Material).dispose();
    (mesh.geometry as THREE.BufferGeometry).dispose();
    this.scene.remove(mesh);
  }

  private createRingMesh(texture: THREE.Texture): THREE.Mesh {
    const ringGeometry = new THREE.RingGeometry(1.2, 2.5, 128);
    const pos = ringGeometry.attributes.position;
    const uv = ringGeometry.attributes.uv;

    for (let i = 0; i < uv.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const r = Math.sqrt(x * x + y * y);
      uv.setXY(i, (r - 1.2) / (2.5 - 1.2), 0.5);
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
    const { planet, textures, rotationDirection = "prograde", tilt = 0, radius = 1 } = opts;
    this.currentRotationDirection = rotationDirection;

    const [baseTex, bumpTex, specTex, atmTex, atmAlpha, ringTex] =
      await Promise.all([
        this.loadTexture(textures.map),
        this.loadTexture(textures.bump),
        this.loadTexture(textures.specular),
        this.loadTexture(textures.atmosphere),
        this.loadTexture(textures.atmosphereAlpha),
        this.loadTexture(textures.ring),
      ]);

    this.disposeAndRemove(this.sphere);
    this.disposeAndRemove(this.atmosphere);
    this.disposeAndRemove(this.ring);

    const geom = new THREE.SphereGeometry(PLANET_RADIUS, 96, 96);
    let mat: THREE.Material;
    if (planet === "Sun") {
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
    this.baseTilt = this.degreesToRadians(tilt);
    this.sphere.rotation.x = this.tiltEnabled ? this.baseTilt * -1 : 0;
    this.scene.add(this.sphere);

    // Apply bloom only to Sun
    if (planet === "Sun" && this.bloomEffect) {
      this.bloomEffect.selection.add(this.sphere);
    }

    // Atmosphere
    if (atmTex) {
      const atmGeom = new THREE.SphereGeometry(PLANET_RADIUS * 1.02, 96, 96);
      const atmMat = new THREE.MeshPhongMaterial({
        map: atmTex,
        alphaMap: atmAlpha,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      this.atmosphere = new THREE.Mesh(atmGeom, atmMat);
      this.atmosphere.visible = this.showAtmosphere;
      this.sphere.add(this.atmosphere);
    }

    // Rings
    if (ringTex) {
      this.ring = this.createRingMesh(ringTex);
      this.scene.add(this.ring);
      this.ring.rotation.x = Math.PI / 2 - (this.tiltEnabled ? this.baseTilt : 0);
    }

    // Haumea egg shape
    if (planet === "Haumea") {
      this.sphere.scale.set(2.26, 1.66, 1.0);
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
      this.composer?.render();
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

  async renderOnce(): Promise<string> {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        this.composer?.render();
        resolve(this.renderer.domElement.toDataURL("image/png"));
      });
    });
  }
}