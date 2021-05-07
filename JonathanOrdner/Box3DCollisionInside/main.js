const main = () => {
  //CREATING NEW SCENE AND GUI OBJECTS
  const scene = new THREE.Scene();
  const gui = new dat.GUI();

  //CREATING OUTTERBOX
  const outterBox = generateBox(100, 100, 100, undefined, true);
  outterBox.name = "outterBox";

  //CREATING INNERBOX
  const innerBox = generateBox(10, 10, 10, "red", false);
  innerBox.name = "innerBox";
  innerBox.position.x = 0;
  innerBox.position.y = 0;
  innerBox.position.z = 0;

  //GETTING THE BOUNDINGBOX OF INNERBOX AND OUTTERBOX
  let boundingBox = generateBoundingBox(outterBox);
  let boundingBoxInnerBox = generateBoundingBox(innerBox);

  //CREATUBG VARIABLECONTROLS
  let moveSpeed;
  const variableControls = generateVariableControls(moveSpeed);

  //CREATING LIGHT 1
  const dirLight = generateDirectionalLight("white", 1);
  dirLight.name = "light";
  dirLight.position.x = 8;
  dirLight.position.y = -2.5;
  dirLight.position.z = 7;

  //CREATING LIGHT 2
  const dirLight2 = generateDirectionalLight("white", 1);
  dirLight2.name = "light2";
  dirLight2.position.x = -5;
  dirLight2.position.y = 5;
  dirLight2.position.z = -10;
  dirLight2.rotation.x = Math.PI / 2;

  //ADDING ELEMENTS TO SCENE
  scene.add(outterBox);
  scene.add(innerBox);
  scene.add(dirLight);
  scene.add(dirLight2);
  gui.add(variableControls, "moveSpeed", 1);

  //CREATING A CAMERA
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.x = -100;
  camera.position.y = 75;
  camera.position.z = -300;
  camera.lookAt(new THREE.Vector3(0, 0, 0)); //Looks at the cube

  //CREATING A RENDERER
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor("rgb(60,60,60)");
  document.getElementById("webgl").append(renderer.domElement);

  //CREATING MOUSEDRAG CONTROLS
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  //Variables for inverting the movement of the inner cube and checking for collisions
  let distanceFromBorder = innerBox.geometry.parameters.height * 1.5; //moves cube inside, 1.5* height
  let moveX = true;
  let moveY = true;
  let moveZ = true;

  let maxX = boundingBox.max.x - distanceFromBorder;
  let minX = boundingBox.min.x + distanceFromBorder;

  let maxY = boundingBox.max.y - distanceFromBorder;
  let minY = boundingBox.min.y + distanceFromBorder;

  let maxZ = boundingBox.max.z - distanceFromBorder;
  let minZ = boundingBox.min.z + distanceFromBorder;

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

    //X-Axis MOVEMENT
    if (moveX) {
      innerBox.position.x += variableControls.moveSpeed;
      if (innerBox.position.x >= maxX) {
        moveX = !moveX;
      }
    }

    if (!moveX) {
      innerBox.position.x -= variableControls.moveSpeed;
      if (innerBox.position.x <= minX) {
        moveX = !moveX;
      }
    }
    //Y-AXIS MOVEMENT

    if (moveY) {
      innerBox.position.y += variableControls.moveSpeed;
      if (innerBox.position.y > maxY) {
        moveY = !moveY;
      }
    }
    if (!moveY) {
      innerBox.position.y -= variableControls.moveSpeed;
      if (innerBox.position.y < minY) {
        moveY = !moveY;
      }
    }

    //Z-AXIS MOVEMENT

    if (moveZ) {
      innerBox.position.z += variableControls.moveSpeed;
      if (innerBox.position.z > maxZ) {
        moveZ = !moveZ;
      }
    }
    if (!moveZ) {
      innerBox.position.z -= variableControls.moveSpeed;
      if (innerBox.position.z < minZ) {
        moveZ = !moveZ;
      }
    }

    //ROTATION
    innerBox.rotation.x += 0.01;
    innerBox.rotation.y += 0.01;

    outterBox.rotation.x -= 0.01;
    outterBox.rotation.y -= 0.01;

    requestAnimationFrame(() => {
      update(renderer, scene, camera);
    });
  };

  update(renderer, scene, camera);
  console.log(scene);
};

/**
 * Generates a new Box
 * @param {Width of Box} w
 * @param {Height of Box} h
 * @param {Depth of Box} d
 * @param {Color of Box} color
 * @param {Transparency} transparent
 * @returns A Cube
 */
const generateBox = (w, h, d, color, transparent) => {
  const geo = new THREE.BoxGeometry(w, h, d);
  const edges = new THREE.EdgesGeometry(geo);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: "black" })
  );
  const mat = new THREE.MeshPhongMaterial({
    color,
    opacity: 0.2,
    transparent,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.alphaMap = 0.5;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.add(line);
  return mesh;
};

/**
 * Generates Gui controls for variable
 * @param {variable to control} variableToControl
 * @returns
 */
const generateVariableControls = (variableToControl) => {
  let moveSpeedInFunction = { moveSpeed: 1 };
  return moveSpeedInFunction;
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
 * @returns A directional lightsource
 */
const generateDirectionalLight = (color, intensity) => {
  const light = new THREE.DirectionalLight(color, intensity);
  return light;
};

main();
