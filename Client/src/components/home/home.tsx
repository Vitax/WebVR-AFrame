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
                <Row>
                    <Col md={12} xs={12}>
                        <h4>Information regarding the Application:</h4>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} xs={6}>
                        <span>Explanation here!</span>
                    </Col>
                    <Col md={6} xs={6}>
                        <span>Sample Images here</span>
                    </Col>
                </Row>
            </>
        );
    }
}
