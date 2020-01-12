import * as THREE from 'three';
import * as dat from 'dat.gui';
 

import { OBJLoader } from './lib/OBJLoader.js';
import { OrbitControls } from './lib/OrbitControls.js';

let container, controls, camera, scene, renderer;

let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

const gui = new dat.GUI();

let object;

let textureLoader;
let texture;

// Camera gui
const CamControls = function() {
    this.x = 400;
    this.y = 200;
    this.z = 0;
    this.fov = 60;
    this.far = 6000;
    this.near = .1;
    this.zoom = 1;
}

let cc, cf;
cc = new CamControls();
cf = gui.addFolder('camera');
cf.add(cc, 'x', -1000, 1000, 0.1).onChange(value => {
    camera.position.set( cc.x, cc.y, cc.z );
    camera.updateProjectionMatrix();
});
cf.add(cc, 'y', -1000, 1000, 0.1).onChange(value => {
    camera.position.set( cc.x, cc.y, cc.z );
    camera.updateProjectionMatrix();
});
cf.add(cc, 'z', -1000, 1000, 0.1).onChange(value => {
    camera.position.set( cc.x, cc.y, cc.z );
    camera.updateProjectionMatrix();
});
cf.add(cc, 'fov', 1, 180, 1).onChange(value => {
    camera.fov = value;
    camera.updateProjectionMatrix();
});
cf.add(cc, 'far', 0.1, 1000, 0.1).onChange(value => {
    camera.far = value;
    camera.updateProjectionMatrix();
});
cf.add(cc, 'near', 0.1, 1000, 0.1).onChange(value => {
    camera.near = value;
    camera.updateProjectionMatrix();
});
cf.add(cc, 'zoom', 1, 1000,1).onChange(value => {
    camera.zoom = value;
    camera.updateProjectionMatrix();
});

// Material gui
const materialControls = function() {
    this.file = './assets/Textures/JPG/metal.jpg';

}
let mc, mf;
mc = new materialControls();
mf = gui.addFolder('Texture');

mf.add(mc, 'file',  [
    './assets/Textures/JPG/metal.jpg',
    './assets/Textures/JPG/concbrick.jpg',
    './assets/Textures/JPG/satin-black.jpg',
]).onChange(newTexture =>  {
    texture = textureLoader.load( newTexture );
    texture.needsUpdate = true;
});


init();
animate();


function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );
    
    camera = new THREE.PerspectiveCamera( cc.fov, window.innerWidth / window.innerHeight, cc.near, cc.far );
    camera.position.set( cc.x, cc.y, cc.z );

    controls = new OrbitControls( camera, container );
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = .1;
    controls.maxDistance = 5000;
    // scene
    scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    scene.add( ambientLight );

    const pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );
    scene.add( camera );

    // manager
    function loadModel() {

        object.traverse( function ( child ) {

            if ( child.isMesh ) child.material.map = texture;

        } );

        // object.scale.set(0.5, 0.5, 0.75);
        // object.position.y = - 95;
        scene.add( object );

    }

    const manager = new THREE.LoadingManager( loadModel );

    const planeTextureLoader = new THREE.ImageUtils.loadTexture('assets/Textures/JPG/grass_texture.jpg');
    // planeTextureLoader.load();
    planeTextureLoader.wrapT = THREE.RepeatWrapping;
    planeTextureLoader.wrapS = THREE.RepeatWrapping;
    planeTextureLoader.repeat.set( 100, 100 ); 
    
    const geo = new THREE.PlaneBufferGeometry(20000, 20000, 8, 8);
    const mat = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, map: planeTextureLoader });
    const plane = new THREE.Mesh(geo, mat);
    plane.rotateX( - Math.PI / 2);
    scene.add(plane);

 
    manager.onProgress = function ( item, loaded, total ) {

        console.log( item, loaded, total );

    };

    // texture
    textureLoader = new THREE.TextureLoader( manager );
    texture = textureLoader.load( mc.file );

    
    function onProgress( xhr ) {

        if ( xhr.lengthComputable ) {

            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );

        }

    }

    function onError() {}
    
    // model
    const loader = new OBJLoader( manager );
    loader.load( './assets/OBJ/metal_fence_without_proxy.obj', function ( obj ) {

        object = obj;
        object.scale.z = -0.5;

    }, onProgress, onError );


    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / 4;
    mouseY = ( event.clientY - windowHalfY ) / 4;

}

function onGuiUpdate() {

}

function animate() {
    controls.update();
    requestAnimationFrame( animate );
    render();

}


function updateTexture(newTexture) {
    texture = textureLoader.load( newTexture );
}

function render() {
    // updateCamera();
   
    renderer.render( scene, camera );

}
