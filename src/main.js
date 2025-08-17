import './style.css'
import * as T from 'three';

import fragment from "./shaders/fragment.glsl?raw";
import vertex from "./shaders/vertex.glsl?raw";

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class Sketch {

	constructor(options) {
    this.scene = new T.Scene();

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new T.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( this.width, this.height );
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.outputEncoding = T.sRGBEncoding;

    this.container.appendChild( this.renderer.domElement );

    
    this.camera = new T.PerspectiveCamera( 
      70, 
      window.innerWidth / window.innerHeight, 
      0.001, 
      1000 
    );

    // const frustumSize = 10;
    // const aspect = window.innerWidth / window.innerHeight;
    // this.camera = new T.OrthographicCamera( frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 0.001, 1000 );
    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.time = 0;

    this.isPlaying = true;
    
    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    // this.settings();
	}

  settings() {
    let that = this;
    this.settings = {
      progress: 0,
    },
    this.gui = new dat.GUI();
    this.gui.add(this.settings, 'progress', 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    let that = this;
    this.material = new T.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: T.DoubleSide,
      uniforms: {
        time: { value: 0 },
        uVideo: { value: this.video },
        resolution: { type: "v4", value: new T.Vector4() },
        uvRate1: {
          value: new T.Vector2(1, 1)
        }
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new T.PlaneGeometry(1, 1, 1, 1)

    this.plane = new T.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if(!this.isPlaying) {
      this.render();
      this.isPlaying = true;
    }
  }


  render() {
    if(!this.isPlaying) return;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    window.requestAnimationFrame(this.render.bind(this))
    this.renderer.render( this.scene, this.camera );
  }

}

new Sketch({ dom: document.getElementById('container') })