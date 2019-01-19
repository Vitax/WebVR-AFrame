/**
 * Author: Caglar Özel
 */

// Packages
import React, { Component } from "react";
import { Route } from "react-router-dom";
import { Container, Col, Row } from "reactstrap";

// Components
import { Configuration } from "./configuration/index";

interface IHomeProps {}

interface IHomeStates {}

export class Home extends Component<IHomeProps, IHomeStates> {
    constructor(props: IHomeProps, states: IHomeStates) {
        super(props, states);
    }

    render() {
        return (
            <Container fluid>
                <Row className="content_header">
                    <Col md={12} xs={12}>
                        <h2 className="text-center">WebVR Datavisualisation</h2>
                    </Col>
                </Row>
                <Row className="content_body">
                    <Col md={12} xs={12}>
                        <Configuration />
                    </Col>
                </Row>
                <Row className="content_footer">
                    <Col />
                </Row>
            </Container>
        );
    }
}
