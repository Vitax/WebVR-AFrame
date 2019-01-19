/**
 * Author: Caglar Özel
 */

// Packages
import React, { Component, ChangeEvent } from "react";
import { Row, Col, Button, Table } from "reactstrap";

// Custom classes
import { AnalyseData } from "../../../core/analytics/AnalyseData";
import { ShowData } from "./sub_components/show_data";

// Services
import { DatasetService } from "../../../core/database/DatasetService";

// Models
import { DSVRowArray } from "./models/DSVRowArray";

interface IConfigurationProps {}

interface IConfigurationStates {}

export class Configuration extends Component<IConfigurationProps, IConfigurationStates> {
    constructor(props: IConfigurationProps, states: IConfigurationStates) {
        super(props, states);

        this.state = {};
    }

    render() {
        return (
            <>
                <ShowData />
            </>
        );
    }
}
