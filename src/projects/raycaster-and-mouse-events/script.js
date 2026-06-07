"use client";

import * as THREE from "three";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
import gsap from "gsap";

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
 * Loader
 */
const gltfLoader = new GLTFLoader();

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" }),
);
object1.position.x = -2;

// const object2 = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 16, 16),
//   new THREE.MeshBasicMaterial({ color: "#ff0000" }),
// );

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" }),
);
object3.position.x = 2;

scene.add(object1, object3);

/**
 * Model
 */
let duck = null;
gltfLoader.load("./assets/models/Duck/gltf-Binary/Duck.glb", (gltf) => {
  duck = gltf.scene;
  duck.position.y = -1;
  duck.rotation.y = -Math.PI;
  scene.add(duck);
});

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight("#fff", 0.9);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#fff", 2.1);
directionalLight.position.set(1, 2, 3);
scene.add(directionalLight);

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0);
// rayDirection.normalize();

// raycaster.set(rayOrigin, rayDirection);

// // Three.js updates the objects’ coordinates (called matrices) right before rendering them.
// // Since we do the ray casting immediately, none of the objects have been rendered and we
// // get incorrect info in logs. We can fix that by updating the matrices manually before ray casting
// object1.updateMatrixWorld();
// object2.updateMatrixWorld();
// object3.updateMatrixWorld();

// const intersect = raycaster.intersectObject(object3);
// console.log(intersect);

// const intersects = raycaster.intersectObjects([object1, object2, object3]);
// console.log(intersects);

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
 * Mouse
 */
const mouse = new THREE.Vector2(-1, 1);

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});

window.addEventListener("click", (e) => {
  if (objectEntered) console.log("clicking on an object:", objectEntered);
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
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const timer = new THREE.Timer();

let objectEntered = null;
let objectLeft = null;

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Animate objects
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  // object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  // Cast a ray
  // const rayOrigin = new THREE.Vector3(-3, 0, 0);
  // const rayDirection = new THREE.Vector3(1, 0, 0);
  // rayDirection.normalize();
  // raycaster.set(rayOrigin, rayDirection);

  raycaster.setFromCamera(mouse, camera);

  const objectsToTest = [object1, object3];
  const intersections = raycaster.intersectObjects(objectsToTest);

  for (const obj of objectsToTest) {
    obj.material.color.set("#ff0000"); // Reset color
  }

  for (const intersection of intersections) {
    intersection.object.material.color.set("#0000ff");
  }

  // Mouse enter - if there's an intersection, but there was none before
  if (intersections.length > 0 && !objectEntered) {
    objectEntered = intersections[0].object;
    console.log("Object entered:", objectEntered);
  }
  // Mouse leave - if there's no intersection, but there was one before
  else if (intersections.length === 0 && objectEntered) {
    objectLeft = objectEntered;
    objectEntered = null;
    console.log("Object left:", objectLeft);
  }

  // Raycasting on imported model
  // Checking existence because loading a model takes time
  if (duck) {
    const duckIntersection = raycaster.intersectObject(duck);

    // Mouse enter
    if (duckIntersection.length > 0)
      gsap.to(duck.scale, { x: 1.2, y: 1.2, z: 1.2 });
    // Mouse leave
    else if (duckIntersection.length === 0)
      gsap.to(duck.scale, { x: 1, y: 1, z: 1 });
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
