import * as THREE from 'three';
import * as dat from 'dat.gui';
 

import { OBJLoader } from './lib/OBJLoader.js';
import { OrbitControls } from './lib/OrbitControls.js';
import { Sky } from './lib/Sky.js';

let container, controls, camera, scene, renderer;

let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

const gui = new dat.GUI();

let textureLoader;
let texture;
let house, fence;
let sky, sunSphere;

// Camera gui
const CamControls = function() {
    this.x = 0;
    this.y = 100;
    this.z = 200;
    this.fov = 60;
    this.far = 6000;
    this.near = .1;
    this.zoom = 1;
}

let cc, cf;
cc = new CamControls();
cf = gui.addFolder('Camera');
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
cf.add(cc, 'far', 0.1, 10000, 0.1).onChange(value => {
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

    initSky();

    const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    scene.add( ambientLight );

    const pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );
    scene.add( camera );

    camera.lookAt(scene.position);

    // manager
    function loadModel() {
        fence.traverse( function ( child ) {

            if ( child.isMesh ) child.material.map = texture;
0
        } );
    }

    const manager = new THREE.LoadingManager( loadModel );


    // const materialArray = [];
    // materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'assets/dawnmountain-xpos.png' ) }));
    // materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'assets/dawnmountain-xneg.png' ) }));
    // materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'assets/dawnmountain-ypos.png' ) }));
    // materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'assets/dawnmountain-yneg.png' ) }));
    // materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'assets/dawnmountain-zpos.png' ) }));
    // materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'assets/dawnmountain-zneg.png' ) }));

    // for (let i = 0; i < materialArray.length; i++) {
    //     materialArray[i].side = THREE.BackSide;
    //     const skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
    //     const skyboxGeom = new THREE.CubeGeometry( 5000, 5000, 5000, 1, 1, 1 );
    //     const skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
        
    //     scene.add( skybox );
    // }
    
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
        fence = obj;
        
        // fence.scale.y = 1;

        fence.scale.setScalar( 0.5 );

        fence.traverse( function ( child ) {

            if ( child.isMesh ) child.material.map = texture;
0
        } );

        scene.add(fence);

    }, onProgress, onError );

    loader.load( './assets/OBJ/brick_house.obj', function ( obj ) {

        house = obj;

        scene.add(house);

    }, onProgress, onError );


    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    window.addEventListener( 'resize', onWindowResize, false );

}

function initSky() {

    // Add Sky
    sky = new Sky();
    sky.scale.setScalar( 450000 );
    scene.add( sky );

    // Add Sun Helper
    sunSphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry( 20000, 16, 8 ),
        new THREE.MeshBasicMaterial( { color: 0xffffff } )
    );
    sunSphere.position.y = - 700000;
    sunSphere.visible = false;
    scene.add( sunSphere );

    /// GUI

    const effectController = {
        turbidity: 10,
        rayleigh: 2,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        luminance: 1,
        inclination: 0.49, // elevation / inclination
        azimuth: 0.25, // Facing front,
        sun: ! true
    };

    const distance = 400000;

    function guiChanged() {

        const uniforms = sky.material.uniforms;
        uniforms[ "turbidity" ].value = effectController.turbidity;
        uniforms[ "rayleigh" ].value = effectController.rayleigh;
        uniforms[ "mieCoefficient" ].value = effectController.mieCoefficient;
        uniforms[ "mieDirectionalG" ].value = effectController.mieDirectionalG;
        uniforms[ "luminance" ].value = effectController.luminance;
        
        const theta = Math.PI * ( effectController.inclination - 0.5 );
        const phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );

        sunSphere.position.x = distance * Math.cos( phi );
        sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
        sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );

        sunSphere.visible = effectController.sun;

        uniforms[ "sunPosition" ].value.copy( sunSphere.position );
    }
    const sf = gui.addFolder('Skybox');
    sf.add( effectController, "turbidity", 1.0, 20.0, 0.1 ).onChange( guiChanged );
    sf.add( effectController, "rayleigh", 0.0, 4, 0.001 ).onChange( guiChanged );
    sf.add( effectController, "mieCoefficient", 0.0, 0.1, 0.001 ).onChange( guiChanged );
    sf.add( effectController, "mieDirectionalG", 0.0, 1, 0.001 ).onChange( guiChanged );
    sf.add( effectController, "luminance", 0.0, 2 ).onChange( guiChanged );
    sf.add( effectController, "inclination", 0, 1, 0.0001 ).onChange( guiChanged );
    sf.add( effectController, "azimuth", 0, 1, 0.0001 ).onChange( guiChanged );
    sf.add( effectController, "sun" ).onChange( guiChanged );

    guiChanged();

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
