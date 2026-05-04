"use strict";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import CANNON from "cannon";

/**
 * Debug
 */
const debugObject = {};
const gui = new GUI();

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
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "./assets/textures/environmentMaps/0/px.png",
  "./assets/textures/environmentMaps/0/nx.png",
  "./assets/textures/environmentMaps/0/py.png",
  "./assets/textures/environmentMaps/0/ny.png",
  "./assets/textures/environmentMaps/0/pz.png",
  "./assets/textures/environmentMaps/0/nz.png",
]);

/**
 * Sounds
 */
const hitSound = new Audio("./assets/sounds/hit.mp3");

const playHitSound = (collision) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();

  if (impactStrength > 1.5) {
    hitSound.volume = Math.random();
    hitSound.currentTime = 0;
    hitSound.play();
  }
};

/**
 * Physics
 */
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, -9.82, 0);

// Materials
const defaultMaterial = new CANNON.Material("default");

const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  { friction: 0.1, restitution: 0.7 },
);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

// sphereBody.applyLocalForce(
//   new CANNON.Vec3(150, 0, 0),
//   new CANNON.Vec3(0, 0, 0),
// );

// Floor
const floorBody = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Plane(),
});
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  }),
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
camera.position.set(-5, 5, 5);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Utils
 */
const objectsToUpdate = [];

const material = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});

// Sphere
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const createSphere = (radius, position) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(sphereGeometry, material);
  mesh.position.copy(position);
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  scene.add(mesh);

  // Cannon.js body
  const body = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Sphere(radius),
  });
  body.position.copy(position);
  world.addBody(body);

  // Events
  body.addEventListener("collide", playHitSound);

  // Save in object to update
  objectsToUpdate.push({ mesh, body });
};

createSphere(0.5, { x: 0, y: 3, z: 0 });
debugObject.createSphere = () => {
  createSphere(Math.random(), {
    x: (Math.random() - 0.5) * 10,
    y: Math.random() * 5,
    z: (Math.random() - 0.5) * 10,
  });
};
gui.add(debugObject, "createSphere");

// Box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const createBox = (width, height, depth, position) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(boxGeometry, material);
  mesh.position.copy(position);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  scene.add(mesh);

  // Cannon.js body
  const body = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(
      new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5),
    ),
  });
  body.position.copy(position);
  world.addBody(body);

  // Events
  body.addEventListener("collide", playHitSound);

  // Save in object to update
  objectsToUpdate.push({ mesh, body });
};

createBox(0.5, 0.5, 0.5, { x: 0, y: 2, z: 3 });
debugObject.createBox = () => {
  createBox(Math.random(), Math.random(), Math.random(), {
    x: (Math.random() - 0.5) * 10,
    y: Math.random() * 5,
    z: (Math.random() - 0.5) * 10,
  });
};
gui.add(debugObject, "createBox");

/**
 * Reset
 */
debugObject.reset = () => {
  for (const { mesh, body } of objectsToUpdate) {
    // Remove three.js mesh
    scene.remove(mesh);

    // Remove physics body
    body.removeEventListener("collide", playHitSound);
    world.removeBody(body);
  }

  objectsToUpdate.splice(0, objectsToUpdate.length);
};
gui.add(debugObject, "reset");

/**
 * Animate
 */
let oldElapsedTime = 0;

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Wind
  // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);

  // Update the physics world
  world.step(1 / 60, deltaTime, 3);

  // Update the three.js world with the physics world
  // sphere.position.x = sphereBody.position.x;
  // sphere.position.y = sphereBody.position.y;
  // sphere.position.z = sphereBody.position.z;
  // sphere.position.copy(sphereBody.position);
  for (const { mesh, body } of objectsToUpdate) {
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
