/**
 * Author: Caglar Özel
 */

// Packages
import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Container, Col, Row, Navbar, NavLink, NavbarBrand, Collapse, Nav, NavItem } from "reactstrap";

// Components
import { Home } from "./home/home";

// Stylesheets
import "../stylesheets/css/main.css";
import { Configuration } from "./home/configuration/configuration";
import { VRScene } from "./vr_scene/vrScene";

interface IAppProps {}

interface IAppStates {}

export class App extends Component<IAppProps, IAppStates> {
    constructor(props: IAppProps, states: IAppStates) {
        super(props, states);
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Container fluid>
                        <Row className="content_header">
                            <Col md={12} xs={12}>
                                <Navbar expand="md">
                                    <NavbarBrand className="text-center">WebVR Data</NavbarBrand>
                                    <Collapse navbar>
                                        <Nav className="ml-auto" navbar>
                                            <NavItem>
                                                <NavLink>
                                                    <Link to="/">Home</Link>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink>
                                                    <Link to="/configuration">Configuration</Link>
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </Collapse>
                                </Navbar>
                            </Col>
                        </Row>
                        <Row >
                            <Col className="content_body" md={12} xs={12}>
                                <Route exact path="/" component={Home} />
                                <Route path="/vr-scene" component={VRScene} />
                                <Route path="/configuration" component={Configuration} />
                            </Col>
                        </Row>
                        <Row className="content_footer">
                            <Col md={12} xs={12} className="text-left">
                                <span>2019 - Site Build By: Caglar Özel</span>
                            </Col>
                        </Row>
                    </Container>
                </Switch>
            </BrowserRouter>
        );
    }
}
