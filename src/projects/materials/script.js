"use strict";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { HDRLoader } from "three/examples/jsm/Addons.js";

/**
 * Debug
 */
const gui = new GUI();
const doorFolder = gui.addFolder("Door");
const othersFolder = gui.addFolder("Others");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("./assets/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./assets/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./assets/textures/door/ambientOcclusion.jpg",
);
const doorHeightTexture = textureLoader.load(
  "./assets/textures/door/height.jpg",
);
const doorNormalTexture = textureLoader.load(
  "./assets/textures/door/normal.jpg",
);
const doorMetalnessTexture = textureLoader.load(
  "./assets/textures/door/metalness.jpg",
);
const doorRoughnessTexture = textureLoader.load(
  "./assets/textures/door/roughness.jpg",
);
const matcapTexture = textureLoader.load("./assets/textures/matcaps/8.png");
const gradientTexture = textureLoader.load("./assets/textures/gradients/5.jpg");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambientLight)

// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

/**
 * Environment map
 */
const hdrLoader = new HDRLoader();
hdrLoader.load("./assets/textures/environmentMap/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

/**
 * Objects
 */
// MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.color = new THREE.Color('#ff0000')
// material.wireframe = true
// material.transparent = true
// material.opacity = 0.5
// material.alphaMap = doorAlphaTexture
// material.side = THREE.DoubleSide

// MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// MeshDepthMaterial
// const material = new THREE.MeshDepthMaterial()

// MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial()

// MeshPhongMaterial
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff)

// MeshToonMaterial
// const material = new THREE.MeshToonMaterial()
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false
// material.gradientMap = gradientTexture

/**
 * MeshStandardMaterial
 */
const standardMaterial = new THREE.MeshStandardMaterial();
standardMaterial.metalness = 1;
standardMaterial.roughness = 1;
standardMaterial.map = doorColorTexture;
standardMaterial.aoMap = doorAmbientOcclusionTexture;
standardMaterial.aoMapIntensity = 1;
standardMaterial.displacementMap = doorHeightTexture;
standardMaterial.displacementScale = 0.1;
standardMaterial.metalnessMap = doorMetalnessTexture;
standardMaterial.roughnessMap = doorRoughnessTexture;
standardMaterial.normalMap = doorNormalTexture;
standardMaterial.normalScale.set(0.5, 0.5);
standardMaterial.transparent = true;
standardMaterial.alphaMap = doorAlphaTexture;
standardMaterial.side = THREE.DoubleSide;

doorFolder.add(standardMaterial, "metalness").min(0).max(1).step(0.0001);
doorFolder.add(standardMaterial, "roughness").min(0).max(1).step(0.0001);

/**
 * MeshPhysicalMaterial
 */
// Base material
const physicalMaterial = new THREE.MeshPhysicalMaterial();
physicalMaterial.metalness = 0;
physicalMaterial.roughness = 0.15;
// physicalMaterial.map = doorColorTexture
// physicalMaterial.aoMap = doorAmbientOcclusionTexture
// physicalMaterial.aoMapIntensity = 1
// physicalMaterial.displacementMap = doorHeightTexture
// physicalMaterial.displacementScale = 0.1
// physicalMaterial.metalnessMap = doorMetalnessTexture
// physicalMaterial.roughnessMap = doorRoughnessTexture
// physicalMaterial.normalMap = doorNormalTexture
// physicalMaterial.normalScale.set(0.5, 0.5)
// physicalMaterial.transparent = true
// physicalMaterial.alphaMap = doorAlphaTexture

othersFolder.add(physicalMaterial, "metalness").min(0).max(1).step(0.0001);
othersFolder.add(physicalMaterial, "roughness").min(0).max(1).step(0.0001);

// Clearcoat
physicalMaterial.clearcoat = 1;
physicalMaterial.clearcoatRoughness = 0;

othersFolder.add(physicalMaterial, "clearcoat").min(0).max(1).step(0.0001);
othersFolder
  .add(physicalMaterial, "clearcoatRoughness")
  .min(0)
  .max(1)
  .step(0.0001);

// Sheen
physicalMaterial.sheen = 1;
physicalMaterial.sheenRoughness = 0.25;
physicalMaterial.sheenColor.set(1, 1, 1);

othersFolder.add(physicalMaterial, "sheen").min(0).max(1).step(0.0001);
othersFolder.add(physicalMaterial, "sheenRoughness").min(0).max(1).step(0.0001);
othersFolder.addColor(physicalMaterial, "sheenColor");

// Iridescence
physicalMaterial.iridescence = 1;
physicalMaterial.iridescenceIOR = 1;
physicalMaterial.iridescenceThicknessRange = [100, 800];

othersFolder.add(physicalMaterial, "iridescence").min(0).max(1).step(0.0001);
othersFolder
  .add(physicalMaterial, "iridescenceIOR")
  .min(1)
  .max(2.333)
  .step(0.0001);
othersFolder
  .add(physicalMaterial.iridescenceThicknessRange, "0")
  .min(1)
  .max(1000)
  .step(1);
othersFolder
  .add(physicalMaterial.iridescenceThicknessRange, "1")
  .min(1)
  .max(1000)
  .step(1);

// Transmission
physicalMaterial.transmission = 1;
physicalMaterial.ior = 5;
physicalMaterial.thickness = 0.5;

othersFolder.add(physicalMaterial, "transmission").min(0).max(1).step(0.0001);
othersFolder.add(physicalMaterial, "ior").min(1).max(10).step(0.0001);
othersFolder.add(physicalMaterial, "thickness").min(0).max(1).step(0.0001);

// Objects
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 64, 64),
  physicalMaterial,
);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5, 100, 100),
  standardMaterial,
);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  physicalMaterial,
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = -0.15 * elapsedTime;
  plane.rotation.x = -0.15 * elapsedTime;
  torus.rotation.x = -0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
