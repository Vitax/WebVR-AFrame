/**
 * Author: Caglar Özel
 */

// Packages
import React, { Component } from "react";
import { Col, Row } from "reactstrap";

interface IHomeProps {}

interface IHomeStates {}

export class Home extends Component<IHomeProps, IHomeStates> {
    constructor(props: IHomeProps, states: IHomeStates) {
        super(props, states);
    }

    render() {
        return (
            <>
                <Row className="p-4">
                    <Col md={12} xs={12}>
                        <h4>Controls</h4>
                        <hr className="p-2" />
                        <p>Keyboard controls: </p>
                        <p style={{ paddingLeft: "5rem" }}> wasd: camera movement</p>
                        <p style={{ paddingLeft: "5rem" }}> q: prev scene, e: next scene</p>
                        <p style={{ paddingLeft: "5rem" }}> z: move camera down, c: move camera up</p>
                        <p>Mouse controls: </p>
                        <p style={{ paddingLeft: "5rem" }}> click and drag: pan camera</p>
                        <p style={{ paddingLeft: "5rem" }}> right click: root nodes will display children</p>
                        <p>Gamepad controls meant for VR mode: </p>
                        <p style={{ paddingLeft: "5rem" }}> joy stick: camera movement</p>
                        <p style={{ paddingLeft: "5rem" }}> left analog: prev scene, right analog: next scene</p>
                        <p style={{ paddingLeft: "5rem" }}> left shoulder: move camera down, right shoulder: move camera up </p>
                        <p style={{ paddingLeft: "5rem" }}> x(ps4) or a(xbox): root nodes will display children</p>
                        <h4 className="p-2" />
                        <h4>About the Application:</h4>
                        <hr className="p-2" />
                        <p>This Application was developed as part of a Project for the University.</p>
                        <p>
                            It utilized the WebGL API of the Browser through the Framwork called{" "}
                            <a href="https://aframe.io/" target="_blank">
                                {" "}
                                AFrame{" "}
                            </a>
                            .
                        </p>
                        <p>
                            The goal of this Application is to visualize a unknown Dataset into a 3D space with a simple
                            set of rules.
                        </p>
                        <p>
                            The rules can be set under the <a href="/configuration">configuration</a> tab, after
                            choosing a file which contains data. You are able to set the keys primary attribute,
                            secondary attribute and information which gets displayed under the secondary attribute.
                        </p>
                        <p>In its current state you can use "tsv", "csv" and "json" files.</p>
                        <p>If you are going to use a Json file, they currently need to be in this Format:</p>
                        <div className="pt-2 pb-2">
                            <img src="/assets/images/SampleJSON.png" />
                        </div>
                        <hr className="p-2" />
                        <h4>Sample generation by this Application: </h4>
                        <div className="pt-2 pb-2">
                            <img width="100%" src="/assets/images/3DVisualization.png" />
                        </div>
                    </Col>
                </Row>
            </>
        );
    }
}
