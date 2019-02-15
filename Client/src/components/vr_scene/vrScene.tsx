/**
 * Author: Caglar Özel
 */

/* eslint-disable */

// Packages
import * as THREE from "three";
import * as AFRAME from "aframe";
import "aframe-event-set-component";
import "aframe-look-at-component";
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
    sceneContent: Array<any>;
}

export class VRScene extends Component<IVRSceneProps, IVRSceneStates> {
    constructor(props: IVRSceneProps, states: IVRSceneStates) {
        super(props, states);

        this.state = {
            sceneContent: new Array<any>(),
        };
    }

    componentWillMount() {
        if (this.props.location.state != undefined && this.props.location.state.graph != undefined) {
            this.registerAframeEventListeners();
            this.generateWorld(this.props.location.state.graph);
        }
    }

    componentWillUnmount() {
        this.deleteListeners();
    }

    private registerAframeEventListeners() {
        // Register AFrame Components and Event listeneres
        this.rootClickListener();
        this.branchClickListener();
        this.customGamepadControls();
    }

    private deleteListeners() {
        delete AFRAME.components['click-listener'];
        delete AFRAME.components['branch-listener'];
        delete AFRAME.components['custom-controls'];
    }

    private rootClickListener() {
        AFRAME.registerComponent('click-listener', {
            init: function () {
                let that = this;
                let cachedButton: any;
                let camera = document.getElementById("cameraWrapper");

                function toggleVisible(el: HTMLElement) {
                    let branchElement = document.getElementById("branch".concat(el.id));
                    branchElement.setAttribute('visible', (!branchElement.getAttribute('visible')).toString())

                    branchElement.childNodes.forEach(branchNode => {
                        if ((branchNode as any).getAttribute("color") == "red" && branchNode.parentElement == branchElement) {
                            (branchNode as any).setAttribute("color", "orange");
                            document.getElementById('infoInterface') && camera.removeChild(document.getElementById("infoInterface"));
                            return;
                        }
                    })
                }

                function buttonPressed(button: any, hold: boolean) {
                    if (hold) {
                        if (button.pressed) {
                            return true;
                        }
                    } else {
                        if (button.pressed && cachedButton != button) {
                            cachedButton = button;
                            return true;
                        }

                        if (!button.pressed) {
                            cachedButton = null;
                        }
                    }

                    return false;
                }

                function handleInput() {
                    if (!that.gamepad) return;

                    if (buttonPressed(that.gamepad.buttons[0], false) && that.targetElement != null) {
                        toggleVisible(that.targetElement.srcElement);
                    }

                    requestAnimationFrame(handleInput);
                }


                window.addEventListener('gamepadconnected', function (event) {
                    let gamepads = navigator.getGamepads ? navigator.getGamepads() : ((navigator as any).webkitGetGamepads ? (navigator as any).webkitGetGamepads() : []);
                    that.gamepad = gamepads[0];
                    window.setTimeout(handleInput, 1000 / 60)
                })

                window.addEventListener('gamepaddisconnected', function (event) {
                    cancelAnimationFrame(handleInput.bind(this));
                })

                this.el.addEventListener('raycaster-intersected', function (element) {
                    that.targetElement = element;
                })

                this.el.addEventListener('raycaster-intersected-cleared', function () {
                    that.targetElement = null;
                })

                this.el.addEventListener('mousedown', function () {
                    toggleVisible(that.el);
                })
            }
        })
    }

    private branchClickListener() {
        AFRAME.registerComponent('branch-listener', {
            init: function () {
                let el = this.el;
                let that = this;
                let cachedButton: any;
                let camera = document.getElementById("cameraWrapper");

                function appendInterface() {
                    let infoInterface = document.createElement("a-entity");
                    infoInterface.setAttribute("id", "infoInterface")
                    infoInterface.setAttribute("position", "0 -1 -2");
                    infoInterface.setAttribute("rotation", "-25 0 0");
                    infoInterface.setAttribute("geometry", "primitive: plane; height: auto; width: auto;")
                    infoInterface.setAttribute("material", "color: black;");

                    let text = "";
                    let branchInformation = JSON.parse(el.getAttribute('branchinformation'));

                    for (let key in branchInformation) {
                        if (branchInformation.hasOwnProperty(key)) {
                            let element = branchInformation[key];
                            text = text.concat(key.toUpperCase()).concat(" : ").concat(element).concat("\n");
                        }
                    }

                    infoInterface.setAttribute("text", "value: " + text);
                    camera.appendChild(infoInterface);
                    el.setAttribute("color", "red");
                }

                function buttonPressed(button: any, hold: boolean) {
                    if (hold) {
                        if (button.pressed) {
                            return true;
                        }
                    } else {
                        if (button.pressed && cachedButton != button) {
                            cachedButton = button;
                            return true;
                        }

                        if (!button.pressed) {
                            cachedButton = null;
                        }
                    }

                    return false;
                }

                function handleInput() {
                    if (!that.gamepad) return;

                    if (buttonPressed(that.gamepad.buttons[0], false) && that.targetElement != null) {
                        if (el.parentElement.getAttribute('visible') == true) {
                            let activeElem: HTMLElement;
                            let interfaceElem = document.getElementById("infoInterface");

                            el.parentNode.childNodes.forEach(branchNode => {
                                (branchNode as any).getAttribute("color") == "red" && (activeElem = branchNode)
                            })

                            if (!interfaceElem) {
                                appendInterface();
                            }

                            if (activeElem && interfaceElem && el != activeElem) {
                                activeElem.setAttribute("color", "orange");
                                camera.removeChild(interfaceElem);

                                appendInterface();
                            }
                        }
                    }

                    if (buttonPressed(that.gamepad.buttons[1], false)) {
                        let activeElem: HTMLElement;
                        let interfaceElem = document.getElementById("infoInterface");

                        el.parentNode.childNodes.forEach(branchNode => {
                            (branchNode as any).getAttribute("color") == "red" && (activeElem = branchNode)
                        })

                        if (activeElem && interfaceElem && el.innerHTML == activeElem.innerHTML) {
                            el.setAttribute("color", "orange");
                            camera.removeChild(interfaceElem);
                        }
                    }

                    requestAnimationFrame(handleInput);
                }


                window.addEventListener('gamepadconnected', function (event) {
                    let gamepads = navigator.getGamepads ? navigator.getGamepads() : ((navigator as any).webkitGetGamepads ? (navigator as any).webkitGetGamepads() : []);
                    that.gamepad = gamepads[0];
                    handleInput();
                })

                window.addEventListener('gamepaddisconnected', function (event) {
                    cancelAnimationFrame(handleInput.bind(this));
                })

                this.el.addEventListener('raycaster-intersected', function (element) {
                    that.targetElement = element;
                })

                this.el.addEventListener('raycaster-intersected-cleared', function () {
                    that.targetElement = null;
                })

                el.addEventListener('mousedown', function () {
                    if (el.parentElement.getAttribute('visible') == true) {
                        let activeElem: HTMLElement;
                        let interfaceElem = document.getElementById("infoInterface");

                        el.parentNode.childNodes.forEach(branchNode => {
                            (branchNode as any).getAttribute("color") == "red" && (activeElem = branchNode)
                        })

                        if (!interfaceElem) {
                            appendInterface();
                        }

                        if (activeElem && interfaceElem && el.innerHTML == activeElem.innerHTML) {
                            el.setAttribute("color", "orange");
                            camera.removeChild(interfaceElem);
                        }

                        if (activeElem && interfaceElem && el != activeElem) {
                            activeElem.setAttribute("color", "orange");
                            camera.removeChild(interfaceElem);

                            appendInterface();
                        }

                    }
                })
            }
        })
    }

    private customGamepadControls() {
        AFRAME.registerComponent('custom-controls', {
            init: function () {
                let that = this;
                let cachedButton: any;
                let camera: any = document.getElementById("cameraWrapper");
                let position = new THREE.Vector3();
                let rotation = new THREE.Euler();


                function buttonPressed(button: any, hold: boolean) {
                    if (hold) {
                        if (button.pressed) {
                            return true;
                        }
                    } else {
                        if (button.pressed && cachedButton != button) {
                            cachedButton = button;
                            return true;
                        }

                        if (!button.pressed) {
                            cachedButton = null;
                        }
                    }

                    return false;
                }

                function moveCamera(x: number, y: number, z: number) {
                    setTimeout(() => {
                        camera.object3D.getWorldPosition(position);
                        camera.object3D.getWorldRotation(rotation)

                        position.x += x;
                        position.y += y;
                        position.z += z;

                        camera.setAttribute('position', position)
                    }, 1000 / 30);
                }

                function rotateCamera(x: number, y: number, z: number) {
                    setTimeout(() => {
                        let rotation = camera.getAttribute('rotation')
                    }, 1000 / 30)
                }

                function handleInput() {
                    if (!that.gamepad) return;

                    // handle x axes
                    if (that.gamepad.axes[0].toFixed(3) > 0.2) moveCamera(that.gamepad.axes[0], 0, 0);
                    if (that.gamepad.axes[0].toFixed(3) < -0.2) moveCamera(that.gamepad.axes[0], 0, 0);

                    // handle z axes
                    if (that.gamepad.axes[1].toFixed(3) > 0.2) moveCamera(0, 0, that.gamepad.axes[1]);
                    if (that.gamepad.axes[1].toFixed(3) < -0.2) moveCamera(0, 0, that.gamepad.axes[1]);

                    // handle y axes
                    if (buttonPressed(that.gamepad.buttons[7], true)) moveCamera(0, 0.2, 0);
                    if (buttonPressed(that.gamepad.buttons[6], true)) moveCamera(0, -0.2, 0);

                    // Right stick: 2 = x and 3 = y
                    if (that.gamepad.axes[2] > 0) {
                    }
                    if (that.gamepad.axes[2] < 0) {
                    }

                    if (that.gamepad.axes[3] > 0) {
                    }

                    if (that.gamepad.axes[3] < 0) {
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

    private calculateRootPosition(index, dataGraph: { [key: string]: Array<Branch> }) {
        let branchCount = Object.keys(dataGraph).length;
        let radius = branchCount * 1;

        let y = 2;
        let x = radius * Math.cos((index / branchCount) * 2 * Math.PI);
        let z = radius * Math.sin((index / branchCount) * 2 * Math.PI);

        return x + " " + y + " " + z;
    }

    private calculateBranchPosition(index: number, length: number, y: number) {
        let radius = length * 0.7;

        let x = radius * Math.cos((index / length) * 2 * Math.PI);
        let z = radius * Math.sin((index / length) * 2 * Math.PI);

        return (x + " " + y + " " + z);
    }

    private generateBranchObjects(branches: Array<Branch>) {
        let branchContent = new Array<any>();

        let i = 0,
            j = 0,
            y = 2,
            chunk = 6,
            iterator = 0,
            chunkArray = new Array<Branch>()

        for (i = 0, j = branches.length; i < j; i += chunk) {
            chunkArray = branches.slice(i, i + chunk);
            iterator = 0;
            y += 3;

            chunkArray.map(branch => {
                branchContent.push(
                    <a-sphere
                        position={this.calculateBranchPosition(iterator, chunkArray.length, y)}
                        color="orange"
                        branchinformation={JSON.stringify(branch.Information)}
                        branch-listener
                    >
                        <a-text value={branch.Name} align="center" look-at="#cameraWrapper" position="0 1.7 0" scale="1.5 1.5 1" color="#282828" />
                    </a-sphere >
                )
                iterator++;
            });
        }

        return branchContent;
    }

    private generateWorld(dataGraph: { [key: string]: Array<Branch> }) {
        let sceneContent = new Array<any>();
        let keyCounter = 0;

        for (let key in dataGraph) {
            if (key != "") {
                sceneContent.push(
                    <>
                        <a-cylinder id={keyCounter} position={this.calculateRootPosition(keyCounter, dataGraph)} color="green" click-listener >
                            <a-text value={key} align="center" color="#282828" look-at="#cameraWrapper" position="0 1.1 0" scale="2 2 1" />
                        </a-cylinder>
                        <a-entity color="grey" position={this.calculateRootPosition(keyCounter, dataGraph)} id={"branch" + keyCounter} visible="false" >
                            {this.generateBranchObjects(dataGraph[key])}
                        </a-entity>
                    </>
                );
                keyCounter += 1;
            }
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
                <a-entity id="cameraWrapper" position="0 2.5 0" look-controls wasd-controls="fly: true" custom-controls progressive-controls >
                    <a-entity camera>
                        <a-cursor color="#282828" />
                        <a-light type="ambient" color="#EEE" intensity="0.7" position="0 0 0" />
                    </a-entity>
                </a-entity>
                <a-light color="#da47da" position="0 8 0" type="ambient" />

                {this.state.sceneContent.length > 0 && this.renderWorld()}
            </a-scene>
        );
    }
}
