/**
 * Author: Caglar Özel
 */

// Packages
import * as THREE from "three";
import * as AFRAME from "aframe";
import "aframe-event-set-component";
import "aframe-look-at-component";
import branchListener from "./aframeComponents/BranchEventListener";
import rootListener from './aframeComponents/RootEventListener';
import React, { Component } from "react";

// Models
import { Branch } from "../../core/data_visualization/DataGraph";

interface IVRSceneProps {
    location: {
        state: {
            graph: { [key: string]: Array<Branch> };
        };
    };
}

interface IVRSceneStates {
    sceneContent: any[];
    rootIndex: number;
    possibleChunks: number;
}

export class VRScene extends Component<IVRSceneProps, IVRSceneStates> {

    private rootChunkSize = 30;

    constructor(props: IVRSceneProps, states: IVRSceneStates) {
        super(props, states);

        this.state = {
            sceneContent: [],
            rootIndex: 0,
            possibleChunks: 0,
        };
    }

    componentWillMount() {
        if (this.props.location.state != undefined && this.props.location.state.graph != undefined) {
            this.registerAFrameEventListeners();
            this.generateWorld(this.props.location.state.graph);
        }
    }

    componentWillUnmount() {
        this.unregisterAFrameEventListeners();
    }

    // Register AFrame Components and Event Listeners
    private registerAFrameEventListeners() {
        rootListener;
        branchListener;
        this.customGamepadControls();
    }

    // Delete AFrame Components and Event Listeners
    private unregisterAFrameEventListeners() {
        delete AFRAME.components['click-listener'];
        delete AFRAME.components['branch-listener'];
        delete AFRAME.components['custom-controls'];
    }

    private customGamepadControls() {
        let component = this;

        AFRAME.registerComponent('custom-controls', {
            init: function () {
                let that = this;
                let cachedButton: any;
                let camera: any = document.getElementById("cameraContainer");
                let position = new THREE.Vector3();
                let rotation = new THREE.Euler();

                function buttonPressed(button: any, hold: boolean): boolean {
                    let buttonState: boolean = false;

                    if (hold) {
                        if (button.pressed) {
                            buttonState = true;
                        }
                    } else {
                        if (button.pressed && cachedButton != button) {
                            cachedButton = button;
                            buttonState = true;
                        }

                        if (!button.pressed && cachedButton == button) {
                            cachedButton = null;
                        }
                    }

                    return buttonState;
                }


                function moveCamera(x: number, y: number, z: number) {
                    setTimeout(() => {
                        camera.object3D.getWorldPosition(position);

                        position.x += x;
                        position.y += y;
                        position.z += z;

                        camera.setAttribute('position', position)
                    }, 1000 / 30);
                }

                function rotateCamera(x: number, y: number, z: number) {
                    setTimeout(() => {
                        camera.object3D.getWorldRotation(rotation)

                        rotation.x += x;
                        rotation.y += y;
                        rotation.z += z;

                        camera.setAttribute('rotation', rotation);
                    }, 1000 / 30)
                }

                function handleInput() {
                    if (!that.gamepad) return;

                    /** left stick: x axes and camera x axes */
                    if (that.gamepad.axes[0].toFixed(3) > 0.2) moveCamera(that.gamepad.axes[0], 0, 0);
                    if (that.gamepad.axes[0].toFixed(3) < -0.2) moveCamera(that.gamepad.axes[0], 0, 0);
                    /** camera y axes */
                    if (buttonPressed(that.gamepad.buttons[5], true)) moveCamera(0, 0.3, 0);
                    if (buttonPressed(that.gamepad.buttons[4], true)) moveCamera(0, -0.3, 0);
                    /** left stick: z axes & camera z axes */
                    if (that.gamepad.axes[1].toFixed(3) > 0.2) moveCamera(0, 0, that.gamepad.axes[1]);
                    if (that.gamepad.axes[1].toFixed(3) < -0.2) moveCamera(0, 0, that.gamepad.axes[1]);

                    /** right stick: x axes */
                    if (that.gamepad.axes[2] > 0.2) rotateCamera(0, that.gamepad.axes[2], 0)
                    if (that.gamepad.axes[2] < 0.2) rotateCamera(0, that.gamepad.axes[2], 0)
                    /** right stick: z axes */
                    if (that.gamepad.axes[3] > 0.2) rotateCamera(0, 0, that.gamepad.axes[3])
                    if (that.gamepad.axes[3] < 0.2) rotateCamera(0, 0, that.gamepad.axes[3])

                    // change scenes
                    if (buttonPressed(that.gamepad.buttons[15], false)) {
                        let currentRootIndex = component.state.rootIndex;
                        if (currentRootIndex < component.state.possibleChunks) currentRootIndex++;

                        component.setState({ rootIndex: currentRootIndex }, () => {
                            component.generateWorld(component.props.location.state.graph);
                        });
                    }

                    if (buttonPressed(that.gamepad.buttons[14], false)) {
                        let currentRootIndex = component.state.rootIndex;
                        if (currentRootIndex > 0) currentRootIndex--;

                        component.setState({ rootIndex: currentRootIndex }, () => {
                            component.generateWorld(component.props.location.state.graph);
                        });
                    }

                    requestAnimationFrame(handleInput);
                }

                window.addEventListener('gamepadconnected', function (event) {
                    let gamepads = navigator.getGamepads ?
                        navigator.getGamepads() :
                        ((navigator as any).webkitGetGamepads ? (navigator as any).webkitGetGamepads() : []);
                    that.gamepad = gamepads[0];

                    handleInput();
                })
            }
        })
    }

    private calculateRootPosition(index: number, length: number, dataGraph: { [key: string]: Array<Branch> }) {
        let radius = length * 1.2;

        let y = 2;
        let x = radius * Math.cos((index / length) * 2 * Math.PI);
        let z = radius * Math.sin((index / length) * 2 * Math.PI);

        return x + " " + y + " " + z;
    }

    private calculateBranchPosition(index: number, length: number, y: number) {
        let radius = length * 0.7;

        let x = radius * Math.cos((index / length) * 2 * Math.PI);
        let z = radius * Math.sin((index / length) * 2 * Math.PI);

        return x + " " + y + " " + z;
    }

    private generateBranchObjects(branches: Array<Branch>) {
        let branchContent = new Array<any>();

        let i = 0,
            j = 0,
            y = 2,
            chunkSize = 6,
            iterator = 0,
            chunkArray = new Array<Branch>()

        for (i = 0, j = branches.length; i < j; i += chunkSize) {
            chunkArray = branches.slice(i, i + chunkSize);
            iterator = 0;
            y += 4;

            chunkArray.map(branch => {
                branchContent.push(
                    <a-sphere
                        position={this.calculateBranchPosition(iterator, chunkArray.length, y)}
                        color="orange"
                        branchinformation={JSON.stringify(branch.Information)}
                        branch-listener=""
                    >
                        <a-text value={branch.Name} align="center" look-at="#cameraContainer" position="0 1.7 0" scale="1.5 1.5 1" color="#282828" />
                    </a-sphere >
                )
                iterator++;
            });
        }

        return branchContent;
    }

    private generateWorld(dataGraph: { [key: string]: Array<Branch> }) {
        this.setState({ possibleChunks: Math.ceil(Object.keys(dataGraph).length / this.rootChunkSize) })

        let chunkSize = 25,
            chunkDataGraph: { [key: string]: Array<Branch> } = {};

        let keyCounter = 0;
        let sceneContent = [];

        if (this.state.rootIndex == 0) {
            chunkDataGraph = Object.keys(dataGraph).slice(this.state.rootIndex, this.state.rootIndex + chunkSize).reduce((result, key) => {
                result[key] = dataGraph[key];

                return result;
            }, {});
        } else {
            let currentPosition = this.state.rootIndex + chunkSize;
            chunkDataGraph = Object.keys(dataGraph).slice(currentPosition, currentPosition + chunkSize).reduce((result, key) => {
                result[key] = dataGraph[key];

                return result;
            }, {});
        }


        for (let key in chunkDataGraph) {
            sceneContent.push(
                <>
                    <a-cylinder id={keyCounter} position={this.calculateRootPosition(keyCounter, Object.entries(chunkDataGraph).length, chunkDataGraph)} color="green" click-listener="" >
                        <a-text value={key} align="center" color="#282828" look-at="#cameraContainer" position="0 1.1 0" height="2" />
                    </a-cylinder>
                    <a-entity color="grey" position={this.calculateRootPosition(keyCounter, Object.keys(chunkDataGraph).length, chunkDataGraph)} id={"branch" + keyCounter} visible="false" >
                        {this.generateBranchObjects(chunkDataGraph[key])}
                    </a-entity>
                </>
            );
            keyCounter += 1;
        }
        this.setState({ sceneContent: sceneContent });
    }

    private renderWorld() {
        return this.state.sceneContent;
    }

    render() {
        return (
            <a-scene className="aframe_scene" light="defaultLightsEnabled: false" embedded>
                <a-sky color="lightblue" />
                <a-entity id="cameraContainer" position="0 2.5 0" look-controls="" wasd-controls="fly: true" custom-controls="" >
                    <a-entity camera="">
                        <a-cursor color="#282828" />
                        <a-light type="ambient" color="#EEE" intensity="0.7" position="0 0 0" />
                    </a-entity>
                </a-entity>
                <a-text look-at="#cameraContainer" position="0 -3 0"
                    value={
                        "Scene: " + (this.state.rootIndex + 1) + "\\" + (this.state.possibleChunks + 1) + "\n"
                    }
                ></a-text>
                <a-light color="#da47da" position="0 8 0" type="ambient" />

                {this.state.sceneContent.length > 0 && this.renderWorld()}
            </a-scene>
        );
    }
}