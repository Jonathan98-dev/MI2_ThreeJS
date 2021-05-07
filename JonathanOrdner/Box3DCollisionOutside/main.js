const main = () => {
  const scene = new THREE.Scene();

  const outterBox = generateBox(100, 100, 100, "red");
  outterBox.name = "outterBox";

  const innerBox = generateBox(10, 10, 10, "white");
  innerBox.name = "innerBox";
  innerBox.position.x = 0;
  innerBox.position.y = 0;
  innerBox.position.z = -60;

  let boundingBox = generateBoundingBox(outterBox);
  let boundingBoxInnerBox = generateBoundingBox(innerBox);

  const dirLight = generateDirectionalLight("white", 1);
  dirLight.name = "light";
  dirLight.position.x = 8;
  dirLight.position.y = -2.5;
  dirLight.position.z = 7;

  const dirLight2 = generateDirectionalLight("white", 1);
  dirLight2.name = "light2";
  dirLight2.position.x = -5;
  dirLight2.position.y = 5;
  dirLight2.position.z = -10;
  dirLight2.rotation.x = Math.PI / 2;

  scene.add(outterBox);
  scene.add(innerBox);
  scene.add(dirLight);
  scene.add(dirLight2);

  /**
   * CAMERA
   */
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.x = -100;
  camera.position.y = 75;
  camera.position.z = -300;
  camera.lookAt(new THREE.Vector3(0, 0, 0)); //Auf den Würfel schauen der in z= -5 ist

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor("rgb(60,60,60)");
  document.getElementById("webgl").append(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  let boxInBox;

  let moveSpeed = 1;

  // const changeMoveSpeed = () => {
  //   moveSpeed = Math.random() * 2 + 1;
  //   console.log(moveSpeed);
  //   return moveSpeed;
  // };

  let moveX = true;
  let moveY = true;
  let moveZ = false;
  let activeZ = false;
  let activeX = true;
  let activeY = true;

  let maxX = boundingBox.max.x + innerBox.geometry.parameters.height;
  let minX = boundingBox.min.x - innerBox.geometry.parameters.height;

  let maxY = boundingBox.max.y + innerBox.geometry.parameters.height;
  let minY = boundingBox.min.y - innerBox.geometry.parameters.height;

  let maxZ = boundingBox.max.z + innerBox.geometry.parameters.height;
  let minZ = boundingBox.min.z - innerBox.geometry.parameters.height;

  console.log(minX, maxX);
  /**
   * Animation Loop
   * @param {RENDERER} renderer
   * @param {SCENE} scene
   * @param {CAMERA} camera
   */
  const update = (renderer, scene, camera) => {
    renderer.render(scene, camera);

    // boundingBox = generateBoundingBox(outterBox);
    // boundingBoxInnerBox = generateBoundingBox(innerBox);
    // boxInBox = boundingBox.intersectsBox(boundingBoxInnerBox);

    if (moveX && activeX === true) {
      // X-Axis MOVEMENT
      innerBox.position.x += moveSpeed;

      if (innerBox.position.x >= maxX) {
        moveX = !moveX;
        activeX = !activeX;
        activeZ = !activeZ;
        console.log(`x: ${activeX} y: ${activeZ} z:${activeZ}`);
      }
    }

    if (!moveX && activeX === true) {
      innerBox.position.x -= moveSpeed;

      if (innerBox.position.x <= minX) {
        moveX = !moveX;
        activeX = !activeX;
        activeZ = !activeZ;
        activeY = !activeY;
        console.log(`x: ${activeX} y: ${activeZ} z:${activeZ}`);
      }
    }

    //Y-AXIS MOVEMENT

    if (moveY && activeY) {
      innerBox.position.y += moveSpeed;
      if (innerBox.position.y >= maxY) {
        moveY = !moveY;
        moveSpeed = changeMoveSpeed();
        console.log(`x: ${activeX} y: ${activeZ} z:${activeZ}`);
      }
    }
    if (!moveY && activeY) {
      innerBox.position.y -= moveSpeed;
      if (innerBox.position.y <= minY) {
        moveY = !moveY;
        activeX = !activeX;
        console.log(`x: ${activeX} y: ${activeZ} z:${activeZ}`);
      }
    }

    //Z-AXIS MOVEMENT

    if (moveZ && activeZ === true) {
      innerBox.position.z += moveSpeed;
      if (innerBox.position.z >= maxZ) {
        moveZ = !moveZ;
        activeX = !activeX;
        console.log(`x: ${activeX} y: ${activeZ} z:${activeZ}`);
      }
    }

    if (!moveZ && activeZ === true) {
      innerBox.position.z -= moveSpeed;
      if (innerBox.position.z <= minZ) {
        moveZ = !moveZ;
        activeX = !activeX;
        activeY = !activeY;
        console.log(`x: ${activeX} y: ${activeZ} z:${activeZ}`);
      }
    }

    //Activate activeY

    // console.log(`x: ${activeX}, y: ${activeY}, z: ${activeY}`);

    if (activeX && activeY && activeY) {
      activeX = !activeZ;
    }
    innerBox.rotation.x += 0.01;
    innerBox.rotation.y += 0.01;

    requestAnimationFrame(() => {
      update(renderer, scene, camera);
    });
  };

  update(renderer, scene, camera, innerBox);
  console.log(scene);
};

/**
 * Generates a new Box
 * @param {Width of Box} w
 * @param {Height of Box} h
 * @param {Depth of Box} d
 * @returns
 */
const generateBox = (w, h, d, color) => {
  const geo = new THREE.BoxGeometry(w, h, d);
  const edges = new THREE.EdgesGeometry(geo);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: "black" })
  );
  const mat = new THREE.MeshPhongMaterial({ color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.add(line);
  return mesh;
};

/**
 * Generates a bounding box of an object
 * @param {inserted object} object
 * @returns bounding box of object
 */
const generateBoundingBox = (object) => {
  let box3 = new THREE.Box3();
  box3.setFromObject(object);
  return box3;
};

/**
 * Generates a new DirectionalLight
 * @param {COLOR OF LIGHT} color
 * @param {INTENSITY OF LIGHT} intensity
 * @returns
 */
const generateDirectionalLight = (color, intensity) => {
  const light = new THREE.DirectionalLight(color, intensity);
  return light;
};

main();
