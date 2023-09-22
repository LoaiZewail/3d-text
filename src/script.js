import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

THREE.ColorManagement.enabled = false

// Base
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene();

const nearDist = 0.1;
const farDist = 10000;

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    nearDist,
    farDist
);
camera.position.x = farDist * -2;
camera.position.z = 900;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Donuts
const cubeSize = 120;
const geometry = new THREE.TorusGeometry(50, 40, 32, 64)
const material = new THREE.MeshNormalMaterial({ wireframe: true })
const group = new THREE.Group();
for (let i = 0; i < 350; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    const dist = farDist / 2;
    const distDouble = dist * 2;
    const tau = 2 * Math.PI;

    mesh.position.x = Math.random() * distDouble - dist;
    mesh.position.y = Math.random() * distDouble - dist;
    mesh.position.z = Math.random() * distDouble - dist;
    mesh.rotation.x = Math.random() * tau;
    mesh.rotation.y = Math.random() * tau;
    mesh.rotation.z = Math.random() * tau;

    // Manually control when 3D transformations recalculation occurs for better performance
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    group.add(mesh);
}
scene.add(group);

// Text
const loader = new FontLoader();
const textMesh = new THREE.Mesh();
const createTypo = font => {
    const word =
        `
    Loai
    Creative
    Developer.
    `;
    const typoProperties = {
        font: font,
        size: cubeSize * 1.2,
        height: cubeSize / 2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 3,
        bevelSegments: 1
    };

    const text = new TextGeometry(word, typoProperties);
    textMesh.geometry = text;
    textMesh.material = material;
    textMesh.position.x = -600;
    textMesh.position.z = -800;
    textMesh.position.y = 300;
    scene.add(textMesh);
};
loader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    createTypo
);

// CREATE PART OF THE MOUSE/TOUCH OVER EFFECT
let mouseX = 0;
let mouseY = 0;
const mouseFX = {
    windowHalfX: window.innerWidth / 2,
    windowHalfY: window.innerHeight / 2,
    coordinates: function (coordX, coordY) {
        mouseX = (coordX - mouseFX.windowHalfX) * 5;
        mouseY = (coordY - mouseFX.windowHalfY) * 5;
    },
    onMouseMove: function (e) {
        mouseFX.coordinates(e.clientX, e.clientY);
    },
    onTouchMove: function (e) {
        mouseFX.coordinates(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
};
document.addEventListener("mousemove", mouseFX.onMouseMove, false);
document.addEventListener("touchmove", mouseFX.onTouchMove, false);

// Animation
const render = () => {
    requestAnimationFrame(render);
    // Camera animation
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (mouseY * -1 - camera.position.y) * 0.05;
    // Rotates the object to face a point in world space
    camera.lookAt(scene.position);

    const t = Date.now() * 0.001;
    const rx = Math.sin(t * 0.7) * 0.5;
    const ry = Math.sin(t * 0.3) * 0.5;
    const rz = Math.sin(t * 0.2) * 0.5;
    group.rotation.x = rx;
    group.rotation.y = ry;
    group.rotation.z = rz;
    textMesh.rotation.x = rx;
    textMesh.rotation.y = ry;
    // textMesh.rotation.z = rx;
    renderer.setClearColor("#f54fa6")
    renderer.render(scene, camera);
};
render();
