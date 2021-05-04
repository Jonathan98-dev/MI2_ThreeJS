const init = () => {
  let scene = new THREE.Scene();
  let leftLight = generateSpotLight("rgb(255,200,200)", 0.5);
  let rightLight = generateSpotLight("rgb(255,200,200)", 1.2);
  leftLight.position.set(6, 8, 10);
  rightLight.position.set(30, 20, -10);

  let filenames = ["px", "nx", "py", "ny", "pz", "nz"];
  let reflectionCube = new THREE.CubeTextureLoader().load(
    filenames.map((filename) => {
      return `Assets/cubemap/${filename}.jpg`;
    })
  );
  scene.background = reflectionCube;
  scene.add(leftLight);
  scene.add(rightLight);
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
  camera.lookAt(new THREE.Vector3(0, 0, -5)); //Auf den Würfel schauen ist

  let objloader = new THREE.OBJLoader();
  objloader.load("Assets/IronMan/IronMan.obj", (object) => {
    object.scale.x = 0.1;
    object.scale.y = 0.1;
    object.scale.z = 0.1;

    object.position.x = -10;

    scene.add(object);
  });

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

const generateSpotLight = (color, intensity) => {
  let light = new THREE.SpotLight(color, intensity);
  light.castShadow = true;
  light.penumbra = 0.5;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.width = 2048;
  light.shadow.bias = 0.001;
  return light;
};

const update = (renderer, scene, camera, controls) => {
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(() => {
    update(renderer, scene, camera, controls);
  });
};

let scene = init();
