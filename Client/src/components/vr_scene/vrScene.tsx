/**
 * Author: Caglar Özel
 */

// Packages
import React, { Component } from "react";
import * as three from "three";
import * as aframe from "aframe";
import "aframe-event-set-component";
import "aframe-look-at-component";

// Modules / Components
import rootListener from "./aframeComponents/RootEventListener";

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
        this.rootListener();
        this.customGamepadControls();
    }

    // Delete AFrame Components and Event Listeners
    private unregisterAFrameEventListeners() {
        delete aframe.components["click-listener"];
        delete aframe.components["custom-controls"];
    }

    private rootListener() {
        AFRAME.registerComponent("click-listener", {
            schema: {
                default: "",
            },
            init: function() {
                let cachedButton: any;
                let camera = document.getElementById("cameraContainer");

                this.buttonPressed = (button: any, hold: boolean): boolean => {
                    let buttonState: boolean = false;

                    if (hold) {
                        if (button.pressed) buttonState = true;
                    } else {
                        if (button.pressed && cachedButton != button) {
                            cachedButton = button;
                            buttonState = true;
                        } else if (!button.pressed && cachedButton == button) {
                            cachedButton = null;
                        }
                    }

                    return buttonState;
                };

                this.toggleVisible = function(el: HTMLElement) {
                    let branchElement = document.getElementById("branch".concat(el.id));

                    if (branchElement) {
                        el.getAttribute("color") === "green"
                            ? this.el.setAttribute("color", "yellow")
                            : this.el.setAttribute("color", "green");

                        branchElement.setAttribute(
                            "visible",
                            (!Boolean(branchElement.getAttribute("visible"))).toString()
                        );
                        branchElement.childNodes.forEach(branchNode => {
                            if (
                                (branchNode as any).getAttribute("color") == "red" &&
                                branchNode.parentElement == branchElement
                            ) {
                                (branchNode as any).setAttribute("color", "orange");
                                document.getElementById("infoInterface") &&
                                    camera.removeChild(document.getElementById("infoInterface"));
                            }
                        });
                    }
                };

                this.getGamepad = function() {
                    let gamepads = navigator.getGamepads
                        ? navigator.getGamepads()
                        : (navigator as any).webkitGetGamepads
                        ? (navigator as any).webkitGetGamepads()
                        : [];
                    if (gamepads[0]) {
                        this.gamepad = gamepads[0];
                    } else {
                        this.gamepad = -1;
                    }
                };

                this.el.addEventListener("mousedown", () => {
                    this.toggleVisible(this.target);
                });

                this.el.addEventListener("raycaster-intersected", element => {
                    this.target = element.target;
                });

                this.el.addEventListener("raycaster-intersected-cleared", () => {
                    this.target = null;
                });

                window.addEventListener("gamepadconnected", () => {
                    this.getGamepad();
                });

                window.addEventListener("gamepaddisconnected", () => {
                    this.gamepad = -1;
                });
            },
            tick: function() {
                if (this.target === null || this.target === undefined) return;
                if (this.gamepad === undefined) this.getGamepad();

                if (this.gamepad.buttons !== undefined && this.buttonPressed(this.gamepad.buttons[0], false)) {
                    this.toggleVisible(this.target);
                }
            },
        });
    }

    private customGamepadControls() {
        let component = this;

        aframe.registerComponent("custom-controls", {
            schema: {
                default: "",
            },
            init: function() {
                let cachedButton: any;
                let rig = document.getElementById("rig") as any;
                let camera = document.getElementById("camera") as any;
                this.gamepad = -1;

                this.position = new three.Vector3();

                this.buttonPressed = function(button: any, hold: boolean): boolean {
                    if (button == undefined || button == null) return;
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
                };

                this.switchScene = function(iterator: number) {
                    let currentRootIndex = component.state.rootIndex;
                    if (iterator > 0 && currentRootIndex < component.state.possibleChunks - 1) currentRootIndex++;
                    if (iterator < 0 && currentRootIndex > 0) currentRootIndex--;

                    component.setState({ rootIndex: currentRootIndex }, () => {
                        component.generateWorld();
                    });
                };

                this.walkForward = function(distance: number) {
                    let rotation = camera.getAttribute("rotation");
                    rig.object3D.getWorldPosition(this.position);

                    this.position.x += distance * Math.sin(rotation.y * (Math.PI / 180));
                    this.position.z += distance * Math.cos(rotation.y * (Math.PI / 180));
                    rig.setAttribute("position", this.position);
                };

                //moves the camera backward relative to its current rotation (yaw)
                this.walkBackwards = function(distance) {
                    let rotation = camera.getAttribute("rotation");
                    rig.object3D.getWorldPosition(this.position);

                    this.position.x += distance * Math.sin(rotation.y * (Math.PI / 180));
                    this.position.z += distance * Math.cos(rotation.y * (Math.PI / 180));
                    rig.setAttribute("position", this.position);
                };

                //strafes the camera left relitive to its current rotation (yaw)
                this.strafeLeft = function(distance) {
                    let rotation = camera.getAttribute("rotation");
                    rig.object3D.getWorldPosition(this.position);

                    this.position.x -= distance * Math.sin((rotation.y - 90) * (Math.PI / 180));
                    this.position.z -= distance * Math.cos((rotation.y - 90) * (Math.PI / 180));
                    rig.setAttribute("position", this.position);
                };

                //strafes the camera right relitive to its current rotation (yaw)
                this.strafeRight = function(distance) {
                    let rotation = camera.getAttribute("rotation");
                    rig.object3D.getWorldPosition(this.position);

                    this.position.x += distance * Math.sin((rotation.y + 90) * (Math.PI / 180));
                    this.position.z += distance * Math.cos((rotation.y + 90) * (Math.PI / 180));
                    rig.setAttribute("position", this.position);
                };

                this.moveY = function(y: number) {
                    rig.object3D.getWorldPosition(this.position);
                    this.position.y += y;
                    rig.setAttribute("position", this.position);
                };

                window.addEventListener("gamepadconnected", () => {
                    let gamepads = navigator.getGamepads
                        ? navigator.getGamepads()
                        : (navigator as any).webkitGetGamepads
                        ? (navigator as any).webkitGetGamepads()
                        : [];
                    this.gamepad = gamepads[0];
                });

                window.addEventListener("gamepaddisconnected", () => {
                    this.gamepad = -1;
                });

                window.addEventListener("keyup", event => {
                    if (event.keyCode === 81) {
                        this.switchScene(-1);
                    }

                    if (event.keyCode === 69) {
                        this.switchScene(1);
                    }
                });

                window.addEventListener("keydown", event => {
                    if (event.keyCode === 67) {
                        this.moveY(0.3);
                    }

                    if (event.keyCode == 90) {
                        this.moveY(-0.3);
                    }
                });
            },
            tick: function() {
                if (this.gamepad === -1) return;

                /** left stick: x axes and camera x axes */
                if (this.gamepad.axes[0].toFixed(3) > 0.2) {
                    this.strafeRight(this.gamepad.axes[0]);
                }

                if (this.gamepad.axes[0].toFixed(3) < -0.2) {
                    this.strafeLeft(this.gamepad.axes[0]);
                }

                /** left stick: z axes & camera z axes */
                if (this.gamepad.axes[1].toFixed(3) > 0.2) {
                    this.walkForward(this.gamepad.axes[1]);
                }

                if (this.gamepad.axes[1].toFixed(3) < -0.2) {
                    this.walkBackwards(this.gamepad.axes[1]);
                }

                /** camera y axes */
                if (this.buttonPressed(this.gamepad.buttons[5], true)) this.moveY(0.3);
                if (this.buttonPressed(this.gamepad.buttons[4], true)) this.moveY(-0.3);

                // change scenes
                if (this.buttonPressed(this.gamepad.buttons[12], false)) {
                    this.switchScene(1);
                }

                if (this.buttonPressed(this.gamepad.buttons[11], false)) {
                    this.switchScene(-1);
                }
            },
        });
    }

    private calculateRootPosition(index: number, length: number, dataGraph: { [key: string]: Array<Branch> }) {
        let radius = length * 3;

        let y = 2;
        let x = radius * Math.cos((index / length) * 2 * Math.PI);
        let z = radius * Math.sin((index / length) * 2 * Math.PI);

        return x + " " + y + " " + z;
    }

    private calculateBranchPosition(index: number, length: number, y: number) {
        let radius = length * 1;

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
                information = information
                    .concat(key.toUpperCase())
                    .concat(" : ")
                    .concat(element)
                    .concat("\n");
            }
        }

        return <a-text value={information} color="#282828" align="center" position="0 -1.5 0" look-at="#rig" />;
    }

    private generateBranchObjects(branches: Array<Branch>) {
        let branchContent = new Array<any>();

        let i = 0,
            j = 0,
            y = 2,
            chunkSize = 6,
            iterator = 0,
            chunkArray = new Array<Branch>();

        for (i = 0, j = branches.length; i < j; i += chunkSize) {
            chunkArray = branches.slice(i, i + chunkSize);
            iterator = 0;
            let branchContentSize = Object.keys(branches[0].Information).length;
            y += branchContentSize != 0 ? branchContentSize + 1 : 1;

            chunkArray.map(branch => {
                branchContent.push(
                    <a-sphere
                        position={this.calculateBranchPosition(iterator, chunkArray.length, y)}
                        color="orange"
                        branchinformation={JSON.stringify(branch.Information)}
                        branch-listener
                    >
                        <a-text
                            value={branch.Name}
                            align="center"
                            look-at="#rig"
                            position="0 1.5 0"
                            scale="1.5 1.5 1"
                            color="#282828"
                        />
                        {this.addBranchInformation(branch.Information)}
                    </a-sphere>
                );
                iterator++;
            });
        }

        return branchContent;
    }

    private generateWorld() {
        let dataGraph = this.props.location.state.graph;
        this.setState({ possibleChunks: Math.ceil(Object.keys(dataGraph).length / this.rootChunkSize) });

        let chunkDataGraph: { [key: string]: Array<Branch> } = {};

        let keyCounter = 0;
        let sceneContent = [];

        chunkDataGraph = Object.keys(dataGraph)
            .slice(
                this.state.rootIndex * this.rootChunkSize,
                this.state.rootIndex * this.rootChunkSize + this.rootChunkSize
            )
            .reduce((result, key) => {
                result[key] = dataGraph[key];

                return result;
            }, {});

        for (let key in chunkDataGraph) {
            sceneContent.push(
                <>
                    <a-cylinder
                        id={keyCounter}
                        click-listener
                        color="green"
                        position={this.calculateRootPosition(
                            keyCounter,
                            Object.entries(chunkDataGraph).length,
                            chunkDataGraph
                        )}
                    >
                        <a-text
                            value={key}
                            align="center"
                            color="#282828"
                            look-at="#rig"
                            position="0 1.1 0"
                            height="2"
                        />
                    </a-cylinder>
                    <a-entity
                        id={"branch" + keyCounter}
                        position={this.calculateRootPosition(
                            keyCounter,
                            Object.keys(chunkDataGraph).length,
                            chunkDataGraph
                        )}
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
                <a-entity id="rig" position="0 2.5 0" wasd-controls="fly: true; acceleration: 250;" custom-controls>
                    <a-entity id="camera" camera="fov: 75" look-controls>
                        <a-cursor color="#282828" scale="0.5 0.5 0.5" />
                        <a-light type="ambient" color="#EEE" intensity="0.7" position="0 0 0" />
                    </a-entity>
                    {<a-text
                        look-at="#rig"
                        position="0 -2 0"
                        align="center" geometry="primitive:plane; width: auto; height: auto;"
                    />}
                </a-entity>
                <a-light color="#da47da" position="0 8 0" type="ambient" />

                {this.state.sceneContent.length > 0 && this.renderWorld()}
            </a-scene>
        );
    }
}
