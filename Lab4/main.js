
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// =========================
// SCENE
// =========================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(9, 7, 10);
camera.lookAt(0, 3, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.body.style.margin = '0';
document.body.appendChild(renderer.domElement);

// =========================
// GROUND AND GRID
// =========================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        side: THREE.DoubleSide
    })
);

ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const grid = new THREE.GridHelper(
    20,
    20,
    0x000000,
    0x000000
);

grid.position.y = 0.01;
scene.add(grid);

// =========================
// LIGHTING
// =========================

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.5
);

const dirlight = new THREE.DirectionalLight(
    0xffffff,
    2
);

dirlight.position.set(5, 10, 5);

scene.add(ambientLight, dirlight);

// =========================
// MATERIALS
// =========================

const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555
});

const shoulderMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000
});

const upperArmMaterial = new THREE.MeshStandardMaterial({
    color: 0x0077ff
});

const elbowMaterial = new THREE.MeshStandardMaterial({
    color: 0x00aa00
});

const forearmMaterial = new THREE.MeshStandardMaterial({
    color: 0xffaa00
});

const wristMaterial = new THREE.MeshStandardMaterial({
    color: 0x9900ff
});

const handMaterial = new THREE.MeshStandardMaterial({
    color: 0x444444
});

const fingerMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888
});

// =========================
// ROBOTIC ARM BASE
// =========================

const baseGeometry = new THREE.CylinderGeometry(
    1.2,
    1.2,
    0.5,
    32
);

const base = new THREE.Mesh(
    baseGeometry,
    baseMaterial
);

base.position.y = 0.25;
scene.add(base);

// =========================
// SHOULDER
// =========================

const shoulder = new THREE.Group();

shoulder.position.y = 0.25;
base.add(shoulder);

const shoulderJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 32, 32),
    shoulderMaterial
);

shoulder.add(shoulderJoint);

// Upper arm
const upperArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 2.5, 0.5),
    upperArmMaterial
);

upperArm.position.y = 1.25;
shoulder.add(upperArm);

// =========================
// ELBOW
// =========================

const elbow = new THREE.Group();

elbow.position.y = 2.5;
shoulder.add(elbow);

const elbowJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 32, 32),
    elbowMaterial
);

elbow.add(elbowJoint);

// Forearm
const forearm = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 2, 0.45),
    forearmMaterial
);

forearm.position.y = 1;
elbow.add(forearm);

// =========================
// WRIST
// =========================

const wrist = new THREE.Group();

wrist.position.y = 2;
elbow.add(wrist);

const wristJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 32, 32),
    wristMaterial
);

wrist.add(wristJoint);

// =========================
// FIVE-FINGER HAND
// =========================

const handGroup = new THREE.Group();
handGroup.position.y = 0.3;
wrist.add(handGroup);

// Palm
const palm = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.8, 0.3),
    handMaterial
);

palm.position.y = 0.4;
handGroup.add(palm);

// Array to store fingers
const fingers = [];

// Function to create one finger
function createFinger(x, length, isThumb = false) {

    // Finger pivot
    const fingerGroup = new THREE.Group();

    fingerGroup.position.set(x, 0.8, 0);
    handGroup.add(fingerGroup);

    // Thumb has different position and angle
    if (isThumb) {
        fingerGroup.position.set(-0.7, 0.25, 0);
        fingerGroup.rotation.z = Math.PI / 4;
    }

    // First finger segment
    const firstSegment = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.18,
            length / 2,
            0.18
        ),
        fingerMaterial
    );

    firstSegment.position.y = length / 4;
    fingerGroup.add(firstSegment);

    // Middle joint
    const middleJoint = new THREE.Group();

    middleJoint.position.y = length / 2;
    fingerGroup.add(middleJoint);

    // Second finger segment
    const secondSegment = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.15,
            length / 2,
            0.15
        ),
        fingerMaterial
    );

    secondSegment.position.y = length / 4;
    middleJoint.add(secondSegment);

    // Store finger joints for rotation
    fingers.push({
        base: fingerGroup,
        middle: middleJoint,
        isThumb: isThumb
    });
}

// Create five fingers
createFinger(-0.45, 0.65);       // Pinky
createFinger(-0.15, 0.85);       // Ring
createFinger(0.15, 1.0);         // Middle
createFinger(0.45, 0.85);        // Index
createFinger(-0.65, 0.6, true);  // Thumb

// =========================
// CAMERA CONTROLS
// =========================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.target.set(0, 3, 0);
controls.update();

// =========================
// ROBOT ROTATION STATE
// =========================

const robotState = {
    baseRotation: 0,
    shoulderRotation: 0,
    elbowRotation: 0,
    wristRotation: 0,
    fingerBend: 0
};

// =========================
// KEYBOARD CONTROLS
// =========================

window.addEventListener('keydown', (event) => {

    const step = 0.1;

    switch (event.key.toLowerCase()) {

        // Base rotation
        case 'a':
            robotState.baseRotation += step;
            break;

        case 'd':
            robotState.baseRotation -= step;
            break;

        // Shoulder rotation
        case 'w':
            robotState.shoulderRotation += step;
            break;

        case 's':
            robotState.shoulderRotation -= step;
            break;

        // Elbow rotation
        case 'q':
            robotState.elbowRotation += step;
            break;

        case 'e':
            robotState.elbowRotation -= step;
            break;

        // Wrist rotation
        case 'z':
            robotState.wristRotation += step;
            break;

        case 'x':
            robotState.wristRotation -= step;
            break;

        // Close fingers
        case 'o':
            robotState.fingerBend = Math.min(
                robotState.fingerBend + step,
                Math.PI / 2
            );
            break;

        // Open fingers
        case 'p':
            robotState.fingerBend = Math.max(
                robotState.fingerBend - step,
                0
            );
            break;
    }
});

// =========================
// WINDOW RESIZE
// =========================

window.addEventListener('resize', () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});

// =========================
// ANIMATION
// =========================

function animate() {

    requestAnimationFrame(animate);

    // Base rotation
    base.rotation.y =
        robotState.baseRotation;

    // Shoulder rotation
    shoulder.rotation.z =
        robotState.shoulderRotation;

    // Elbow rotation
    elbow.rotation.z =
        robotState.elbowRotation;

    // Wrist rotation
    wrist.rotation.z =
        robotState.wristRotation;

    // Five finger movement
    fingers.forEach(finger => {

        finger.base.rotation.x =
            robotState.fingerBend;

        finger.middle.rotation.x =
            robotState.fingerBend;

        if (finger.isThumb) {
            finger.base.rotation.z =
                Math.PI / 4 -
                robotState.fingerBend * 0.5;
        }

    });

    controls.update();

    renderer.render(scene, camera);
}

animate();
