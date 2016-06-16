import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import FSS from './lib/fss.custom';
import Easing from './lib/easing.js';
import Utils from './lib/utils';

let Mesh = {
    width: 1.2,
    height: 1.2,
    sliceRatio: 0.2,
    ambient: '#555555',
    diffuse: '#FFFFFF'
};

let Lights = {
    zOffset: 100,
    ambient: '#084abd',
    spotlights: ['#e7e698', '#e0dc82']
};

class Polygon extends Component {

    constructor(props, context) {
        super(props, context);

        this.animate = this.animate.bind(this);
        this.registerListeners = this.registerListeners.bind(this);
    }

    componentDidMount() {

        let mesh;
        let material;
        let light;
        let i;

        Utils.polyfil();

        this.output = this.refs.polygon;
        this.scene = new FSS.Scene();
        this.renderer = new FSS.CanvasRenderer();
        this.renderer.setSize(this.output.offsetWidth, this.output.offsetHeight);
        this.geometry = new FSS.Plane(Mesh.width * this.renderer.width, Mesh.height * this.renderer.height, Math.ceil(this.renderer.width * Mesh.sliceRatio));

        //Add Lights
        this.spotlights = [];

        this.isTicking = false;

        for (i = 0; i < 2; i += 1) {

            this.renderer.clear();

            light = new FSS.Light(Lights.ambient, Lights.spotlights[i]);
            light.ambientHex = light.ambient.format();
            light.diffuseHex = light.diffuse.format();
            light.setPosition(0, 0, Lights.zOffset);

            this.scene.add(light);

            this.spotlights[i] = light;
        }

        //Add to page...

        material = new FSS.Material(Mesh.ambient, Mesh.diffuse);
        mesh = new FSS.Mesh(this.geometry, material);
        this.scene.add(mesh);
        this.output.appendChild(this.renderer.element);

        this.renderDelaunay();
        this.registerListeners();

    }

    renderDelaunay(callback) {

        this.renderer.render(this.scene, () => {

            this.isTicking = false;

            if (typeof callback === 'function') {
                callback();
            }

        });

    }

    registerListeners() {

        let EventDispatcher = require('./lib/eventDispatcher');

        EventDispatcher.register(this, {
            resize: (e, complete) => {

                this.renderer.setSize(this.output.offsetWidth, this.output.offsetHeight);
                this.geometry.render(Mesh.width * this.renderer.width, Mesh.height * this.renderer.height, Math.ceil(this.renderer.width * Mesh.sliceRatio));
                FSS.Vector3.set(FSS.Vector3.create(), this.renderer.halfWidth, this.renderer.halfHeight);

                this.renderDelaunay();

                if (typeof complete === 'function') {
                    complete();
                }

            }
        });

        const _this = this;

        this.mouseOut = true;

        this.output.addEventListener('mousemove', event => {

            if (!this.isTicking) {

                this.isTicking = true;
                this.mouseOut = false;

                window.requestAnimationFrame(() => {

                    let x = (event.x || event.clientX) - _this.renderer.width / 2;
                    let y = _this.renderer.height / 2 - (event.y || event.clientY);

                    _this.spotlights[1].setPosition(x, y, 100);

                    _this.renderDelaunay();

                }, null);
            }

        });

        this.output.addEventListener('mouseout', event => {

            window.requestAnimationFrame(() => {

                let x = (event.x || event.clientX) - _this.renderer.width / 2;
                let y = (_this.renderer.height / 2 - (event.y || event.clientY)) + window.pageYOffset;

                _this.mouseOut = true;
                _this.animate(x, 0, y, 0, window.performance.now(), 500);

            });

        });

    }

    animate(startX, endX, startY, endY, startTime, duration) {

        let currentTime = window.performance.now() - startTime;
        let easeX = Easing.easeOutSine.apply(this, [
            1,
            currentTime,
            0,
            Math.abs(startX - endX),
            duration
        ]);
        let easeY = Easing.easeOutSine.apply(this, [
            1,
            currentTime,
            0,
            Math.abs(startY - endY),
            duration
        ]);
        let x;
        let y;

        if (startX < endX) {
            x = Math.round(startX + easeX); //Increasing...
        } else {
            x = Math.round(startX - easeX); //Decreasing...
        }

        if (startY < endY) {
            y = Math.round(startY + easeY); //Increasing...
        } else {
            y = Math.round(startY - easeY); //Decreasing...
        }

        this.spotlights[1].setPosition(x, y, 100);

        this.renderDelaunay(() => {
            if (currentTime <= duration && this.mouseOut) {
                requestAnimationFrame(() => {
                    this.animate(startX, endX, startY, endY, startTime, duration);
                });
            }
        });

    }

    render() {
        return (
            <div ref="polygon" className="polygon">
                <img className="polygon-logo" src="./img/gwg.svg" ref="logo"/>
            </div>
        );
    }

}

export default Polygon;
