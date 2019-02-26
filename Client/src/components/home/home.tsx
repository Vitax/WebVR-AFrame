/**
 * Author: Caglar Özel
 */

// Packages
import React, { Component } from "react";
import { Col, Row } from "reactstrap";

interface IHomeProps { }

interface IHomeStates { }

export class Home extends Component<IHomeProps, IHomeStates> {
    constructor(props: IHomeProps, states: IHomeStates) {
        super(props, states);
    }

    render() {
        return (
            <>
                <Row>
                    <Col md={12} xs={12} className="p-2">
                        <h4 className="text-center">Information regarding the Application</h4>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} xs={6}>
                        <p>
                            This application is able to load tsv, csv and json files and in the current state give you the options to select a main and secondary attribute. 
                        </p>
                        <br/>
                        <p>
                            Further more you can define optional attributes named information fields, which will be shown on the secondary node.
                        </p>
                    </Col>
                    <Col md={6} xs={6}>
                        <span>Sample Images here</span>
                    </Col>
                </Row>
            </>
        );
    }
}
