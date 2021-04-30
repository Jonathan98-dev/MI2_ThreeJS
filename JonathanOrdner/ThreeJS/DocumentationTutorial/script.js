import { WEBGL } from "./WebGl.js";
/**
 * loading 3D models
 */

const loader = new THREE.GLTFLoader();

loader.load(
  "./cube.glb",
  function (gltf) {
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

/**
 * setting up the scene
 */
const scene = new THREE.Scene();

/**
 * setting up the camera
 */
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  500
);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);
camera.position.y = 15;
camera.position.x = 5;

/**
 * setting up the renderer
 */
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor("#ffffff", 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/**
 * creating a material
 */
const material = new THREE.LineBasicMaterial({ color: "#000000" });

/**
 * creating a geometry + vertices
 */
const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));

const geometry = new THREE.BufferGeometry().setFromPoints(points);

/**
 * forming a line + adding it to the scene
 */

const line = new THREE.Line(geometry, material);
scene.add(line);

/**
 * adding light
 */

const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

/**
 * animates cube every frame
 */
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

/**
 * check if the browser has WebGL support and run animate function
 */
if (WEBGL.isWebGLAvailable()) {
  animate();
} else {
  const warning = WEBGL.getWebGLErrorMessager();
  document.getElementById("container".appendChild(warning));
}
