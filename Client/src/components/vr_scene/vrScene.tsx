/**
 * Author: Caglar Özel
 */

// Packages
import "aframe";
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
        if (this.props.location.state.graph) this.generateWorld(this.props.location.state.graph);
    }

    private calculateRootPosition(index, dataGraph: { [key: string]: Array<Branch> }) {
        // TODO: Find a way to make this variable
        let radius = 10;

        let y = 2;
        let x = radius * Math.cos((index / Object.keys(dataGraph).length) * 2 * Math.PI);
        let z = radius * Math.sin((index / Object.keys(dataGraph).length) * 2 * Math.PI);

        return x + " " + y + " " + z;
    }

    calculateBranchPosition(
        index: number,
        rootIndex: number,
        length: number,
        branch: Branch,
        dataGraph: { [key: string]: Array<Branch> }
    ) {
        // TODO: Find a way to make this variable
        let radius = 10;

        let y = radius * Math.sin((index / length) * 2 * Math.PI);
        let x = radius * Math.cos((rootIndex / Object.keys(dataGraph).length) * 2 * Math.PI);
        let z = radius * Math.sin((rootIndex / Object.keys(dataGraph).length) * 2 * Math.PI);

        return x + " " + y + " " + z;
    }

    private generateWorld(dataGraph: { [key: string]: Array<Branch> }) {
        let sceneContent = new Array<any>();
        let keyCounter = 0;
        //let currentBranch = 0;

        for (let key in dataGraph) {
            if (key != "") {
                sceneContent.push(
                    <>
                        <a-cylinder
                            position={this.calculateRootPosition(keyCounter, dataGraph)}
                            scale="0.5 0.5 0.5"
                            color="#D50000"
                            event-set__enter={
                                "_event: mouseenter; _target: #cylinderText" + keyCounter + "; visible: true;"
                            }
                            event-set__leave={
                                "_event: mouseleave; _target: #cylinderText" + keyCounter + "; visible: false;"
                            }
                        >
                            <a-text
                                id={"cylinderText" + keyCounter}
                                value={key}
                                align="center"
                                color="#FFF"
                                visible="false"
                                position="0 1.05 0"
                                look-at="#camera"
                                transparent="true"
                                geometry="primitive: plane; width: 1.75"
                            />
                        </a-cylinder>
                    </>
                );
                keyCounter += 1;

                for (let i = 0; i < dataGraph[key].length; i++) {
                    //currentBranch = i;
                    sceneContent.push(
                        <>
                            <a-sphere
                                id={"root " + keyCounter + " branch " + i}
                                position={this.calculateBranchPosition(
                                    i,
                                    keyCounter,
                                    dataGraph[key].length,
                                    dataGraph[key][i],
                                    dataGraph
                                )}
                                scale="0.5 0.5 0.5"
                                color="#D50000"
                                event-set__enter={
                                    "_event: mouseenter; _target: #root" +
                                    keyCounter +
                                    "sphereContent" +
                                    i +
                                    "; visible: true;"
                                }
                                event-set__leave={
                                    "_event: mouseleave; _target: #root" +
                                    keyCounter +
                                    "sphereContent" +
                                    i +
                                    ";visible: false;"
                                }
                                visible="true"
                            >
                                <a-text
                                    id={"root" + keyCounter + "sphereContent" + i}
                                    value={dataGraph[key][i].Name}
                                    align="center"
                                    color="#FFF"
                                    visible="false"
                                    position="0 1.5 1.5"
                                    look-at="#camera"
                                    transparent="true"
                                    geometry="primitive: plane; width: 1.75"
                                />
                            </a-sphere>
                        </>
                    );
                }
            }
        }
        this.setState({ sceneContent: sceneContent });
    }

    private renderWorld() {
        return this.state.sceneContent;
    }

    private cameraChanged(event: any) {
        console.log(event);
    }

    render() {
        return (
            <a-scene className="aframe_scene" light="defaultLightsEnabled: false" embedded>
                {this.state.sceneContent.length > 0 && this.renderWorld()}

                <a-sky color="#81c1f9" />
                <a-camera id="camera">
                    <a-cursor color="#282828" scale="0.2, 0.2, 0.2" fuse="true" />
                    <a-light type="ambient" color="#EEE" intensity="0.7" position="0 0 0" />
                </a-camera>
                <a-light color="#da47da" position="0 8 0" type="ambient" />
            </a-scene>
        );
    }
}
