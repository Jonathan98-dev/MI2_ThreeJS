import { WEBGL } from "./WebGl.js";
/**
 * loading 3D models
 */

const loader = new THREE.GLTFLoader();

//N.F.
// loader.load(
//   "./cube.glb",
//   function (gltf) {
//     scene.add(gltf.scene);
//   },
//   undefined,
//   function (error) {
//     console.error(error);
//   }
// );

/**
 * setting up the scene
 */
const scene = new THREE.Scene();

/**
 * setting up the camera
 */
const camera = new THREE.PerspectiveCamera(
  45, //fov
  window.innerWidth / window.innerHeight, //aspect
  1, //near
  500 //far
);
camera.position.set(0, 0, 150);
camera.lookAt(0, 0, 0);
camera.position.y = 5;
camera.position.x = 0;

/**
 * setting up the renderer
 */
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor("#ffffff", 1); //Sets the clear color and opacity.
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
 * creating a boxGeometry + vertices
 */
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
const cube = new THREE.Mesh(boxGeometry, material);
scene.add(cube);

camera.position.z = 25;

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
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
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
