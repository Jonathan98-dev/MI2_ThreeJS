// https://threejs.org/editor/

const keyboard = new THREEx.KeyboardState();
const clock = new THREE.Clock();

const main = () => {
  const scene = new THREE.Scene();
  const gui = new dat.GUI();

  /**
   * BOX
   */
  const box = generateBox(1, 1, 1);
  box.name = "box1";
  box.position.y = box.geometry.parameters.height / 2; // Verschiebt die Box nach oben

  /**
   * FLOOR
   */

  const floor = generateFloor(10, 20);
  floor.name = "floor";
  floor.rotation.x = Math.PI / 2; // ThreeJS works with radiant --> 360deg === 2*PI

  /**
   * LIGHT
   */

  const pointLight = generatePointLight(0xffffff, 1);
  pointLight.position.y = 5;
  /**
   * ADDING STUFF TO OTHER STUFF
   */
  scene.add(floor);
  scene.add(pointLight);
  scene.add(generateMoon());
  floor.add(box);
  gui.add(pointLight, "intensity", 0, 20); // GUI controls for pointlight
  /**
   * CAMERA
   */
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.x = -20;
  camera.position.y = -20;
  camera.position.z = -20;
  camera.lookAt(new THREE.Vector3(0, 0, -5)); //Auf den Würfel schauen der in z= -5 ist

  /**
   * RENDERER
   */
  const renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor("rgb(60,60,60)");
  document.getElementById("webgl").append(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  update(renderer, scene, camera, controls);
  return scene;
};
/**
 * Generates a new sphere with texture
 */
const generateMoon = () => {
  let sphere = new THREE.SphereGeometry(3, 42, 42);
  let moonTexture = THREE.ImageUtils.loadTexture("/Assets/moon.jpg");
  let moonMat = new THREE.MeshLambertMaterial({
    map: moonTexture,
    color: 0xffa500,
    ambient: 0xaa0000,
  });
  let moon = new THREE.Mesh(sphere, moonMat);
  moon.position.x = 10;
  moon.position.y = 10;
  moon.position.z = 10;
  return moon;
};

/**
 * Generates a new Floor
 * @param {Width of Floor} w
 * @param {Depth of Floor} d
 */
const generateFloor = (w, d) => {
  const geo = new THREE.PlaneGeometry(w, d);
  const mat = new THREE.MeshPhongMaterial({
    color: "rgb(100,100,100)", // RRGGBB
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  return mesh;
};

/**
 * Generates a new Box
 * @param {Width of Box} w
 * @param {Height of Box} h
 * @param {Depth of Box} d
 * @returns
 */
const generateBox = (w, h, d) => {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshPhongMaterial({ color: "rgb(100,100,100)" });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
};

/**
 * Generates a new PointLight
 * @param {COLOR OF LIGHT} color
 * @param {INTENSITY OF LIGHT} intensity
 * @returns
 */
const generatePointLight = (color, intensity) => {
  const light = new THREE.PointLight(color, intensity);
  light.castShadow = true;
  return light;
};

/**
 * Animation Loop
 * @param {RENDERER} renderer
 * @param {SCENE} scene
 * @param {CAMERA} camera
 */
const update = (renderer, scene, camera, controls) => {
  renderer.render(scene, camera);

  const floor = scene.getObjectByName("floor");
  scene.children[0].rotation.y += 0.002;
  floor.rotation.z = 0.0001;

  // scene.traverse((child) => {}); // Give every child object something

  controls.update();

  /**
   * KEYBOARD CONTROLS
   */
  const step = 10 * clock.getDelta(); //Calculate same movespeed for different pcs
  const box = scene.getObjectByName("box1");
  if (keyboard.pressed("A")) {
    box.translateX(step);
  }

  if (keyboard.pressed("D")) {
    box.translateX(-step);
  }

  if (keyboard.pressed("W")) {
    box.translateY(step);
  }

  if (keyboard.pressed("S")) {
    box.translateY(-step);
  }

  requestAnimationFrame(() => {
    update(renderer, scene, camera, controls);
  });
};

const scene = main();
console.log(scene);
