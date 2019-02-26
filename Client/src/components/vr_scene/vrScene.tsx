/**
 * Author: Caglar Özel
 */

// Packages
import * as THREE from "three";
import * as AFRAME from "aframe";
import "aframe-event-set-component";
import "aframe-look-at-component";
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
    currentChunkSize: number;
}

export class VRScene extends Component<IVRSceneProps, IVRSceneStates> {
    private rootChunkSize = 30;

    constructor(props: IVRSceneProps, states: IVRSceneStates) {
        super(props, states);

        this.state = {
            sceneContent: [],
            rootIndex: 0,
            possibleChunks: 0,
            currentChunkSize: 0,
        };
    }

    componentWillMount() {
        this.registerAFrameEventListeners();
        if (this.props.location.state != undefined && this.props.location.state.graph != undefined) {
            this.generateWorld();
        }
    }

    componentWillUnmount() {
        this.unregisterAFrameEventListeners();
    }

    // Register AFrame Components and Event Listeners
    private registerAFrameEventListeners() {
        rootListener;
        // branchListener;
        this.customGamepadControls();
    }

    // Delete AFrame Components and Event Listeners
    private unregisterAFrameEventListeners() {
        delete AFRAME.components['click-listener'];
        // delete AFRAME.components['branch-listener'];
        delete AFRAME.components['custom-controls'];
    }

    private customGamepadControls() {
        let component = this;

        AFRAME.registerComponent('custom-controls', {
            schema: {
                default: "",
            },
            init: function () {
                let cachedButton: any;
                this.camera = document.getElementById("cameraContainer");
                this.position = new THREE.Vector3();
                this.rotation = new THREE.Euler();

                this.buttonPressed = (button: any, hold: boolean): boolean => {
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


                this.moveCamera = (x: number, y: number, z: number) => {
                    this.camera.object3D.getWorldPosition(this.position);

                    this.position.x += x;
                    this.position.y += y;
                    this.position.z += z;

                    this.camera.setAttribute('position', this.position)
                }

                this.rotateCamera = (x: number, y: number, z: number) => {
                    this.camera.object3D.getWorldRotation(this.rotation)

                    this.rotation.x += x;
                    this.rotation.y += y;
                    this.rotation.z += z;

                    this.camera.setAttribute('rotation', this.rotation);
                }

                window.addEventListener('gamepadconnected', () => {
                    let gamepads = navigator.getGamepads ? navigator.getGamepads() : ((navigator as any).webkitGetGamepads ? (navigator as any).webkitGetGamepads() : []);
                    this.gamepad = gamepads[0];
                })

                window.addEventListener('gamepaddisconnected', () => {
                    this.gamepad = null;
                })
            },
            tick: function () {
                if (!this.gamepad) return;

                /** left stick: x axes and camera x axes */
                if (this.gamepad.axes[0].toFixed(3) > 0.2) this.moveCamera(this.gamepad.axes[0], 0, 0);
                if (this.gamepad.axes[0].toFixed(3) < -0.2) this.moveCamera(this.gamepad.axes[0], 0, 0);
                /** camera y axes */
                if (this.buttonPressed(this.gamepad.buttons[5], true)) this.moveCamera(0, 0.3, 0);
                if (this.buttonPressed(this.gamepad.buttons[4], true)) this.moveCamera(0, -0.3, 0);
                /** left stick: z axes & camera z axes */
                if (this.gamepad.axes[1].toFixed(3) > 0.2) this.moveCamera(0, 0, this.gamepad.axes[1]);
                if (this.gamepad.axes[1].toFixed(3) < -0.2) this.moveCamera(0, 0, this.gamepad.axes[1]);

                /** right stick: x axes */
                if (this.gamepad.axes[2] > 0.2) this.rotateCamera(0, this.gamepad.axes[2], 0)
                if (this.gamepad.axes[2] < 0.2) this.rotateCamera(0, this.gamepad.axes[2], 0)
                /** right stick: z axes */
                if (this.gamepad.axes[3] > 0.2) this.rotateCamera(0, 0, this.gamepad.axes[3])
                if (this.gamepad.axes[3] < 0.2) this.rotateCamera(0, 0, this.gamepad.axes[3])

                // change scenes
                if (this.buttonPressed(this.gamepad.buttons[15], false)) {
                    let currentRootIndex = component.state.rootIndex;
                    if ((currentRootIndex + 1) < component.state.possibleChunks) currentRootIndex++;

                    component.setState({ rootIndex: currentRootIndex }, () => {
                        component.generateWorld();
                    });
                }

                if (this.buttonPressed(this.gamepad.buttons[14], false)) {
                    let currentRootIndex = component.state.rootIndex;
                    if (currentRootIndex > 0) currentRootIndex--;

                    component.setState({ rootIndex: currentRootIndex }, () => {
                        component.generateWorld();
                    });
                }
            }
        })
    }

    private calculateRootPosition(index: number, length: number, dataGraph: { [key: string]: Array<Branch> }) {
        let radius = length * 1.8;

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

    private addBranchInformation(branchInformation) {
        let information = "";

        for (let key in branchInformation) {
            if (branchInformation.hasOwnProperty(key)) {
                let element = branchInformation[key];

                // create information text here
                information = information.concat(key.toUpperCase()).concat(" : ").concat(element).concat("\n");
            }
        }

        return <a-text value={information} color="#282828" align="center" position="0 -2 0" look-at="#cameraContainer"></a-text>
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
            y += Object.keys(branches[0].Information).length;

            chunkArray.map(branch => {
                branchContent.push(
                    <a-sphere
                        position={this.calculateBranchPosition(iterator, chunkArray.length, y)}
                        color="orange"
                        branchinformation={JSON.stringify(branch.Information)}
                        branch-listener
                    >
                        <a-text value={branch.Name} align="center" look-at="#cameraContainer" position="0 1.5 0" scale="1.5 1.5 1" color="#282828" />
                        {this.addBranchInformation(branch.Information)}
                    </a-sphere >
                )
                iterator++;
            });
        }

        return branchContent;
    }

    private generateWorld() {
        let dataGraph = this.props.location.state.graph;
        this.setState({ possibleChunks: Math.ceil(Object.keys(dataGraph).length / this.rootChunkSize) })

        let chunkDataGraph: { [key: string]: Array<Branch> } = {};

        let keyCounter = 0;
        let sceneContent = [];

        chunkDataGraph = Object.keys(dataGraph).slice((this.state.rootIndex * this.rootChunkSize), (this.state.rootIndex * this.rootChunkSize) + this.rootChunkSize).reduce((result, key) => {
            result[key] = dataGraph[key];

            return result;
        }, {});


        for (let key in chunkDataGraph) {
            sceneContent.push(
                <>
                    <a-cylinder
                        id={keyCounter}
                        position={this.calculateRootPosition(keyCounter, Object.entries(chunkDataGraph).length, chunkDataGraph)}
                        click-listener
                        color="green"
                    >
                        <a-text value={key} align="center" color="#282828" look-at="#cameraContainer" position="0 1.1 0" height="2" />
                    </a-cylinder>
                    <a-entity
                        id={"branch" + keyCounter}
                        position={this.calculateRootPosition(keyCounter, Object.keys(chunkDataGraph).length, chunkDataGraph)}
                        visible="false"
                        color="grey"
                    >
                        {this.generateBranchObjects(chunkDataGraph[key])}
                    </a-entity>
                </>
            );
            keyCounter += 1;
        }
        this.setState({ sceneContent: sceneContent, currentChunkSize: Object.keys(chunkDataGraph).length });
    }

    private renderWorld() {
        return this.state.sceneContent;
    }

    render() {
        return (
            <a-scene className="aframe_scene" light="defaultLightsEnabled: false" embedded>
                <a-sky color="lightblue" />
                <a-entity id="cameraContainer" position="0 2.5 0" look-controls wasd-controls="fly: true" custom-controls >
                    <a-entity camera >
                        <a-cursor color="#282828" />
                        <a-light type="ambient" color="#EEE" intensity="0.7" position="0 0 0" />
                    </a-entity>
                    <a-text
                        look-at="#cameraContainer"
                        position="2 0 0"
                        align="center"
                        geometry="primitive:plane; width: auto; height: auto;"
                        value={
                            "Elements total: " + (Object.keys(this.props.location.state.graph).length) + "\n" +
                            "Elements in this Scene: " + (Object.keys(this.state.currentChunkSize)) + "\n" +
                            "Scene: " + (this.state.rootIndex + 1) + "\\" + this.state.possibleChunks + "\n"
                        }
                    />
                </a-entity>
                <a-light color="#da47da" position="0 8 0" type="ambient" />

                {this.state.sceneContent.length > 0 && this.renderWorld()}
            </a-scene>
        );
    }
}