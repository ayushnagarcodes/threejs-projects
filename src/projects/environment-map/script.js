import * as THREE from "three";
import GUI from "lil-gui";
import {
  GLTFLoader,
  OrbitControls,
  HDRLoader,
  EXRLoader,
  GroundedSkybox,
} from "three/examples/jsm/Addons.js";

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const hdrLoader = new HDRLoader();
const exrLoader = new EXRLoader();
const textureLoader = new THREE.TextureLoader();

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Environment map
 */
scene.environmentIntensity = 1;
scene.backgroundBlurriness = 0;
scene.backgroundIntensity = 1;
scene.backgroundRotation.y = 0;
scene.environmentRotation.y = 0;

gui.add(scene, "environmentIntensity").min(0).max(10).step(0.01);
gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.01);
gui.add(scene, "backgroundIntensity").min(0).max(10).step(0.01);
gui
  .add(scene.backgroundRotation, "y")
  .min(0)
  .max(Math.PI * 2)
  .step(0.01)
  .name("backgroundRotationY");
gui
  .add(scene.environmentRotation, "y")
  .min(0)
  .max(Math.PI * 2)
  .step(0.01)
  .name("environmentRotationY");

// LDR (low dynamic range) Cube Texture
// const environmentMap = cubeTextureLoader.load([
//   "./assets/environmentMaps/0/px.png",
//   "./assets/environmentMaps/0/nx.png",
//   "./assets/environmentMaps/0/py.png",
//   "./assets/environmentMaps/0/ny.png",
//   "./assets/environmentMaps/0/pz.png",
//   "./assets/environmentMaps/0/nz.png",
// ]);

// scene.environment = environmentMap;
// scene.background = environmentMap;

// HDR (high dynamic range) Equirectangular
// hdrLoader.load("./assets/environmentMaps/studio-2k.hdr", (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;

//   scene.environment = environmentMap;
//   // scene.background = environmentMap;
// });

// EXR (Extended Range - HDR with layers & alpha channel) Equirectangular
// exrLoader.load(
//   "./assets/environmentMaps/nvidiaCanvas-4k.exr",
//   (environmentMap) => {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping;

//     scene.environment = environmentMap;
//     scene.background = environmentMap;
//   },
// );

// LDR Equirectangular
// const environmentMap = textureLoader.load(
//   "./assets/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg",
// );
// environmentMap.mapping = THREE.EquirectangularReflectionMapping;
// environmentMap.colorSpace = THREE.SRGBColorSpace;
// scene.environment = environmentMap;
// scene.background = environmentMap;

// Ground Projected Environment Map
// hdrLoader.load("./assets/environmentMaps/2/2k.hdr", (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//   scene.environment = environmentMap;

//   // Skybox
//   const skybox = new GroundedSkybox(environmentMap, 15, 70);
//   // skybox.material.wireframe = true;
//   skybox.position.y = 16.5;
//   scene.add(skybox);
// });

/**
 * Real-time Environment map
 */
const environmentMap = textureLoader.load(
  "./assets/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg",
);
environmentMap.mapping = THREE.EquirectangularReflectionMapping;
environmentMap.colorSpace = THREE.SRGBColorSpace;
scene.background = environmentMap;

/**
 * Donut
 */
const donut = new THREE.Mesh(
  new THREE.TorusGeometry(8, 0.5),
  new THREE.MeshBasicMaterial({ color: new THREE.Color(10, 4, 2) }),
);
donut.layers.enable(1);
donut.position.y = 3.5;
scene.add(donut);

// Cube Render Target
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
  type: THREE.HalfFloatType,
});
scene.environment = cubeRenderTarget.texture;

// Cube Camera
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
cubeCamera.layers.set(1);

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.6, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({
    roughness: 0,
    metalness: 1,
    color: 0xaaaaaa,
  }),
);
// torusKnot.material.envMap = environmentMap;
torusKnot.position.x = -4;
torusKnot.position.y = 4;
scene.add(torusKnot);

/**
 * Models
 */
gltfLoader.load(
  "./assets/models/FlightHelmet/glTF/FlightHelmet.gltf",
  (gltf) => {
    gltf.scene.scale.set(6, 6, 6);
    gltf.scene.position.y = 1.5;
    scene.add(gltf.scene);
  },
);

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
camera.position.set(4, 5, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
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
  // Time
  const elapsedTime = clock.getElapsedTime();

  if (donut) {
    donut.rotation.x = Math.sin(elapsedTime) * 2;

    cubeCamera.update(renderer, scene);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
