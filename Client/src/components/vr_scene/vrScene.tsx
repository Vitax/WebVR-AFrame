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
        if (this.props.location.state.graph != undefined && this.props.location.state.graph != null) this.generateWorld(this.props.location.state.graph);
    }

    private calculateRootPosition(index, dataGraph: { [key: string]: Array<Branch> }) {
        let branchCount = Object.keys(dataGraph).length;
        let radius = branchCount * 0.9;

        let y = 2;
        let x = radius * Math.cos((index / branchCount) * 2 * Math.PI);
        let z = radius * Math.sin((index / branchCount) * 2 * Math.PI);

        return x + " " + y + " " + z;
    }

    calculateBranchPosition(index: number, length: number) {
        let radius = length * 0.9;

        let y = 4;
        let x = radius * Math.cos((index / length) * 2 * Math.PI);
        let z = radius * Math.sin((index / length) * 2 * Math.PI);

        return x + " " + y + " " + z;
    }

    private generateWorld(dataGraph: { [key: string]: Array<Branch> }) {
        let sceneContent = new Array<any>();
        let keyCounter = 0;

        for (let key in dataGraph) {
            if (key != "") {
                sceneContent.push(
                    <a-cylinder position={this.calculateRootPosition(keyCounter, dataGraph)} color="#D50000" event-set__enter={"_event: mouseenter; _target: #branch-node" + keyCounter + "; visible: true;"} event-set__leave={"_event: mouseleave; _target: #branch-node" + keyCounter + ";visible: false;"} >
                        <a-entity look-at="#camera" id={"branch-node" + keyCounter} visible="false">
                            {dataGraph[key].map((branch, i) => {
                                return (
                                    <a-sphere position={this.calculateBranchPosition(i, dataGraph[key].length)} color="#D50000" visible="true" >
                                        <a-text value={branch.Name} align="center" visible="true" position="0 1.5 0" look-at="#camera" geometry="primitive: plane; width: 1.75" />
                                    </a-sphere>
                                )
                            })}
                        </a-entity>
                        <a-text value={key} align="center" visible="true" position="0 1.1 0" look-at="#camera" geometry="primitive: plane; width: 1.75" />
                    </a-cylinder>
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
                <a-sky color="#81c1f9" />
                <a-camera id="camera">
                    <a-cursor color="#282828" fuse="true" />
                    <a-light type="ambient" color="#EEE" intensity="0.7" position="0 0 0" />
                </a-camera>
                <a-plane scale="100 100 1" rotation="-90 0 0" color="#282828" />
                <a-light color="#da47da" position="0 8 0" type="ambient" />

                {this.state.sceneContent.length > 0 && this.renderWorld()}
            </a-scene>
        );
    }
}
