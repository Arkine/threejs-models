import * as THREE from 'three';

import { OBJLoader } from './lib/OBJLoader.js';
import OrbitControls from 'three-orbit-controls';

var container;



var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var object;

init();
animate();


function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 6000 );
    camera.zoom = -50;
  
    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    scene.add( ambientLight );

    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );
    scene.add( camera );
  

    // manager

    function loadModel() {

        object.traverse( function ( child ) {

            if ( child.isMesh ) child.material.map = texture;

        } );

        // object.scale.set(0.5, 0.5, 0.75);
        object.position.y = - 95;
        scene.add( object );

    }

    var manager = new THREE.LoadingManager( loadModel );

    manager.onProgress = function ( item, loaded, total ) {

        console.log( item, loaded, total );

    };

    // texture

    var textureLoader = new THREE.TextureLoader( manager );

    var texture = textureLoader.load( './assets/Textures/JPG/metal.jpg' );

    // model

    function onProgress( xhr ) {

        if ( xhr.lengthComputable ) {

            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );

        }

    }

    function onError() {}

    var loader = new OBJLoader( manager );

    loader.load( './assets/OBJ/metal_fence_without_proxy.obj', function ( obj ) {

        object = obj;
        console.log({object})

    }, onProgress, onError );
    
    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    //

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

//

function animate() {

    requestAnimationFrame( animate );
    render();

}

function render() {

    camera.position.z += ( mouseY - camera.position.y ) / 5;
    camera.position.x += ( - mouseX - camera.position.x ) / 5;
    
    camera.lookAt( scene.position );

    renderer.render( scene, camera );

}