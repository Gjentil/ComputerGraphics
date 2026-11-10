
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

// CAMERA
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(5, 3, 7);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// LIGHTS
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// LOAD CAR MODEL
const loader = new GLTFLoader();
let car;

loader.load(
    '/model.glb',

    function (gltf) {
        car = gltf.scene;
        scene.add(car);

        // Center the car
        const box = new THREE.Box3().setFromObject(car);
        const center = box.getCenter(new THREE.Vector3());
        car.position.sub(center);

        // Adjust the camera
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);

        camera.position.set(maxSize, maxSize * 0.6, maxSize * 1.5);
        camera.lookAt(0, 0, 0);
        controls.target.set(0, 0, 0);
        controls.update();
    },

    undefined,

    function (error) {
        console.error('Error loading model:', error);
    }
);

// RESIZE
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);

    if (car) {
        // Move car back and forth along the X-axis
        car.position.x = Math.sin(Date.now() * 0.001) * 3;
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();
