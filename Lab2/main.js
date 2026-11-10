// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { color, cross } from 'three/tsl';
// import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth/innerHeight,
    0.1,
    100
)
camera.position.set(4,4,6)
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer({antialias : true})
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AxesHelper(3))

const control = new OrbitControls(camera, renderer.domElement)

const origin = new THREE.Vector3(0,0,0);
const a = new THREE.Vector3(2,1,0)
const b = new THREE.Vector3(0,2,0);

const arrA = new THREE.ArrowHelper(a.clone().normalize(),origin,a.length(),0xE8431C,0.35,0.2)
const arrB = new THREE.ArrowHelper(b.clone().normalize(),origin,b.length(),0xE1E40FF,0.35,0.2)
scene.add(arrA,arrB)

const sum = new THREE.Vector3().addVectors(a,b);
const dot = a.dot(b);

const arrSum = new THREE.ArrowHelper(sum.clone().normalize(),origin,sum.length(),0x3ecf8e,0.35,0.2);
scene.add(arrSum);

const gui = new GUI();
const params = {
    aX: a.x, aY: a.y, aZ: a.z,
    bX: b.x, bY: b.y, bZ: b.z,
    sum: '',
    dot: '',
    cross: '',
    crossLength: '',
    angle: ''
}

const aFolder = gui.addFolder('Vector A')
aFolder.add(params, 'aX',-5,5,0.1,).name('X').onChange(value => {a.x = value ; updateVectors()})


console.log('a+b = ', sum, 'a(dot)b = ' , dot);

function updateVectors(){
    requestAnimationFrame(updateVectors)
    control.update()
    renderer.render(scene, camera);

}
updateVectors()