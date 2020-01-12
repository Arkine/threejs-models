import * as THREE from 'three';

import { OBJLoader } from './lib/OBJLoader.js';
import { OrbitControls } from './lib/OrbitControls.js';

let container, controls, camera, scene, renderer;

let mouseX = 0, mouseY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

let object;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, .1, 6000 );
    camera.position.set( 400, 200, 0 );

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
    manager.onProgress = function ( item, loaded, total ) {

        console.log( item, loaded, total );

    };

    // texture
    const textureLoader = new THREE.TextureLoader( manager );
    const texture = textureLoader.load( './assets/Textures/JPG/metal.jpg' );

    
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

function animate() {
    controls.update();
    requestAnimationFrame( animate );
    render();

}

function render() {


    renderer.render( scene, camera );

}