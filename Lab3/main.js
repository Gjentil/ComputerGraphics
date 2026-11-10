import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
camera.position.set(5, 6, 7)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
const pointLight = new THREE.PointLight(0xffffff, 400, 0, 1.6)
const ambientLight = new THREE.AmbientLight(0xffffff, 2.3)
scene.add(pointLight, ambientLight)

const geometry = new THREE.SphereGeometry(2, 32, 24);
const material = new THREE.MeshStandardMaterial({ color: 0xc58018, emissive: 0xE8431c, emissiveIntensity: 0.6 })
const sun = new THREE.Mesh(geometry, material)
scene.add(sun)

const earthOrbit = new THREE.Object3D();
sun.add(earthOrbit)

const earth = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0X1E40FF, roughness: 0.9 })
)
earth.position.x = 6
earthOrbit.add(earth)

const moonOrbit = new THREE.Object3D();
earth.add(moonOrbit)

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0xd4d7d7, roughness: 0.9 })
)
moon.position.x = 1.8
moonOrbit.add(moon)

const marsOrbit = new THREE.Object3D();
sun.add(marsOrbit)

const mars = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0xfb1eff, roughness: 0.9 })
)
mars.position.x = 10
marsOrbit.add(mars)

const phobosOrbit = new THREE.Object3D();
mars.add(phobosOrbit)

const phobos = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0x352e9a, roughness: 0.9 })
)
phobos.position.x = 1.8
phobosOrbit.add(phobos)



const control = new OrbitControls(camera, renderer.domElement);
function animate() {
    requestAnimationFrame(animate)
    control.update()
    sun.rotation.y += 0.003
    earthOrbit.rotation.y += 0.01

    moonOrbit.rotation.y += 0.04
    earth.rotation.y += 0.05

    phobosOrbit.rotation.y += 0.03
    marsOrbit.rotation.y +=0.03


    renderer.render(scene, camera)
}
animate()