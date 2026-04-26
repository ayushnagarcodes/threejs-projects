import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";

/**
 * Debug
 */
const gui = new GUI();

const parameters = {
  materialColor: "#ffeded",
};

gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
  particlesMaterial.color.set(parameters.materialColor);
});

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("./assets/gradients/3.jpg");
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
// Meshes
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});
const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 32, 120),
  material,
);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 64), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 200, 32),
  material,
);
const sectionMeshes = [mesh1, mesh2, mesh3];

const objectsDistance = 4;

sectionMeshes.forEach((mesh, index) => {
  mesh.position.y = -objectsDistance * index;
  mesh.position.x = (index % 2 === 0 ? 1 : -1) * 1.2;
});

scene.add(...sectionMeshes);

// Particles
const numParticles = 200;
const particlesMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.03,
  sizeAttenuation: true,
});
const particlesGeometry = new THREE.BufferGeometry();

const positions = new Float32Array(numParticles * 3);
for (let i = 0; i < numParticles; i++) {
  const i3 = i * 3;
  positions[i3] = (Math.random() - 0.5) * 8;
  positions[i3 + 1] = objectsDistance / 2 - Math.random() * objectsDistance * 3;
  positions[i3 + 2] = (Math.random() - 0.5) * 8;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3),
);

const points = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(points);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(1, 1, 0);
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
// Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;

  const newSection = Math.round(scrollY / sizes.height);

  if (currentSection !== newSection) {
    currentSection = newSection;

    gsap.to(sectionMeshes[newSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
      z: "+=1.5",
    });
  }
});

/**
 * Cursor
 */
const cursor = { x: 0, y: 0 };
window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Object rotation
  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }

  // Move camera with scroll
  camera.position.y = (-scrollY / sizes.height) * objectsDistance;

  // Parallax effect on mouse move
  const parallaxX = cursor.x;
  const parallaxY = -cursor.y;
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 0.5 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 0.5 * deltaTime;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
