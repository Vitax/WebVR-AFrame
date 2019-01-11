import React, { Component } from "react";
import { Container, Col, Row } from "reactstrap";

import { Configuration } from "./configuration/index"

interface IHomeProps {
}

interface IHomeStates {
}

export class Home extends Component<IHomeProps, IHomeStates> {
    constructor(props: IHomeProps, states: IHomeStates) {
        super(props, states)
    }


    render() {
        return (
            <Container fluid>
                <Row class="header">
                    <Col md={12} xs={12}>
                        <h4>WebVR Datavisualisation</h4>
                    </Col>
                </Row>
                <Row class="body">
                    <Col md={12} xs={12}>
                        <Configuration/>
                    </Col>
                </Row>
                <Row class="footer">
                    <Col>
                    </Col>
                </Row>
            </Container>
        );
    }
}
