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

// /**
//  * creating a geometry + vertices
//  */
// const points = [];
// points.push(new THREE.Vector3(-10, 0, 0));
// points.push(new THREE.Vector3(0, 10, 0));
// points.push(new THREE.Vector3(10, 0, 0));

// const geometry = new THREE.BufferGeometry().setFromPoints(points);

// /**
//  * forming a line + adding it to the scene
//  */

//  const line = new THREE.Line(geometry, material);
//  scene.add(line);

/**
 * creating a boxGeometry + vertices
 */

const boxGeometry2 = new THREE.BoxGeometry(10, 10, 10);
const boxMaterial2 = new THREE.MeshBasicMaterial({ color: "#ffffff" });
const cube2 = new THREE.Mesh(boxGeometry2, material);
scene.add(cube2);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
const cube = new THREE.Mesh(boxGeometry, material);
scene.add(cube);

camera.position.z = 25;

/**
 * adding light
 */

const light = new THREE.AmbientLight(0x404040); // soft white light
light.position.z = 100;
scene.add(light);

/**
 * animates cube every frame
 */

let moveRight = true;
const setMovement = () => {
  moveRight = !moveRight;
  console.log(moveRight);
};
function animate() {
  requestAnimationFrame(animate);

  if (moveRight) {
    cube.position.x += 0.1;
    cube.position.y += 0.02;
    if (cube.position.x >= 10) {
      setMovement();
      console.log("RIGHT");
    }
  }
  if (!moveRight) {
    cube.position.x += -0.1;
    cube.position.y += -0.02;
    if (cube.position.x <= -10) {
      setMovement();
      console.log("LEFT");
    }
  }

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
console.log(scene);
animate();

//computeBoundingBox --> ausrechnen
