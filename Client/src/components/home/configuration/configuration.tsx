/**
 * Author: Caglar Özel
 */

// Packages
import React, { Component } from "react";
import { Redirect } from "react-router-dom";

// Components
import { ShowData } from "./sub_components/displayData";
import { SetupConfig } from "./sub_components/setupConfig";

// Classes
import { DataGraph, Branch } from "../../../core/data_visualization/DataGraph";

// Model
import { DSVRowArray } from "./models/DSVRowArray";
import { GraphConfiguration } from "./models/GraphConfig";

interface IConfigurationProps { }

interface IConfigurationStates {
    redirect: boolean;
    dataset: DSVRowArray<string>;
    graphConfigration: GraphConfiguration;
    graph: { [key: string]: Array<Branch> };
}

export class Configuration extends Component<IConfigurationProps, IConfigurationStates> {
    private dataGraph: DataGraph;

    constructor(props: IConfigurationProps, states: IConfigurationStates) {
        super(props, states);

        this.state = {
            redirect: false,
            dataset: new DSVRowArray<string>(),
            graphConfigration: new GraphConfiguration(),
            graph: {},
        };

        this.dataGraph = new DataGraph();
    }

    private chosenDataset(chosenDataset: DSVRowArray<string>) {
        this.setState({ dataset: chosenDataset });
    }

    private renderRedirect() {
        return <Redirect to={{ pathname: "/vr-scene", state: { graph: this.state.graph } }} />;
    }

    private createdGraphConfig(createdGraphConfiguration: GraphConfiguration) {
        this.setState({ graphConfigration: createdGraphConfiguration }, () => {
            let graph = this.dataGraph.generateWorldDate(this.state.dataset, this.state.graphConfigration);
            this.setState({ graph: graph, redirect: true });
        });
    }

    render() {
        return (
            <>
                <ShowData returnChosenDataset={this.chosenDataset.bind(this)} />
                <hr />
                <SetupConfig
                    currentDataset={this.state.dataset}
                    returnConfiguration={this.createdGraphConfig.bind(this)}
                />
                {this.state.redirect && this.renderRedirect()}
            </>
        );
    }
}
