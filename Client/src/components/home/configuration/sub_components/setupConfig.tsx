/**
 * Author: Caglar Özel
 */

// Packages
import React, { Component, ChangeEvent } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

// Models
import { DSVRowArray } from "../models/DSVRowArray";
import { GraphConfiguration } from "../models/GraphConfig";

interface ISetupConfigProps {
    currentDataset: DSVRowArray<string>;
    returnConfiguration: (graphConfig: GraphConfiguration) => void;
}

interface ISetupConfigStates {
    activeDataset: DSVRowArray<string>;
    graphConfiguration: GraphConfiguration;
}

export class SetupConfig extends Component<ISetupConfigProps, ISetupConfigStates> {
    constructor(props: ISetupConfigProps, states: ISetupConfigStates) {
        super(props, states);

        this.state = {
            activeDataset: new DSVRowArray<string>(),
            graphConfiguration: new GraphConfiguration(),
        };
    }

    componentDidUpdate(prevProps: ISetupConfigProps) {
        console.log(' in here: ', this.props);
        if (this.props.currentDataset.length != 0 && this.props.currentDataset != prevProps.currentDataset) {
            this.setState({ activeDataset: this.props.currentDataset }, () => {
                if (this.state.activeDataset.columns.length > 2) {
                    let copyOfGraphConfig = { ...this.state.graphConfiguration };
                    copyOfGraphConfig.MainAttribute = this.state.activeDataset.columns[0];
                    copyOfGraphConfig.SecondaryAttribute = this.state.activeDataset.columns[1];
                    this.setState({ graphConfiguration: copyOfGraphConfig });
                }
            });
        }
    }

    private returnConfiguration() {
        this.props.returnConfiguration(this.state.graphConfiguration);
    }

    private setMainAttribute(event: ChangeEvent<HTMLInputElement>) {
        let value = event.target.value;
        let copyOfGraphConfig = { ...this.state.graphConfiguration };

        if (value != copyOfGraphConfig.SecondaryAttribute) {
            copyOfGraphConfig.MainAttribute = value;
            this.setState({ graphConfiguration: copyOfGraphConfig });
        }
    }

    private setSecondaryAttribute(event: ChangeEvent<HTMLInputElement>) {
        let value = event.target.value;
        let copyOfGraphConfig = { ...this.state.graphConfiguration };

        if (value != copyOfGraphConfig.MainAttribute) {
            copyOfGraphConfig.SecondaryAttribute = value;
            this.setState({ graphConfiguration: copyOfGraphConfig });
        }
    }

    private displayOptions() {
        return (
            <>
                {this.state.activeDataset.columns.map(attributeName => {
                    return <option value={attributeName}>{attributeName}</option>;
                })}
            </>
        );
    }

    private displayVisualizationOptions() {
        let filteredOptions: Array<string> = [...this.state.activeDataset.columns];
        filteredOptions.splice(filteredOptions.indexOf(this.state.graphConfiguration.MainAttribute), 1);
        filteredOptions.splice(filteredOptions.indexOf(this.state.graphConfiguration.SecondaryAttribute), 1);

        return (
            <>
                {filteredOptions.map(attributeName => {
                    return <option value={attributeName}>{attributeName}</option>;
                })}
            </>
        );
    }

    private setVisualizationOptions(event: ChangeEvent<HTMLSelectElement>) {
        let graphConfigration = { ...this.state.graphConfiguration };
        let arrayWithOptions = new Array<string>();

        for (let i = 0; i < event.target.options.length; ++i) {
            let opt = event.target.options[i];
            if (opt.selected) {
                arrayWithOptions.push(opt.value);
            }
        }

        graphConfigration.VisualInformation = arrayWithOptions;

        this.setState({ graphConfiguration: graphConfigration });
    }

    private setGetImagesOption(event: ChangeEvent<HTMLInputElement>) {
        console.log("checked: ", event.target.value);
    }

    render() {
        return this.state.activeDataset.length == 0 ? (
            <> </>
        ) : (
            <>
                <Form>
                    <h2 className="text-center"> Configuration </h2>
                    <FormGroup>
                        <Label>Primary Attribute:</Label>
                        <Input
                            type="select"
                            value={this.state.graphConfiguration.MainAttribute}
                            onChange={this.setMainAttribute.bind(this)}
                        >
                            {this.displayOptions()}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>Seconday Attribute:</Label>
                        <Input
                            type="select"
                            value={this.state.graphConfiguration.SecondaryAttribute}
                            onChange={this.setSecondaryAttribute.bind(this)}
                        >
                            {this.displayOptions()}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>Information visualized in the seconday Nodes:</Label>
                        <Input type="select" onChange={this.setVisualizationOptions.bind(this)} multiple>
                            {this.displayVisualizationOptions()}
                        </Input>
                    </FormGroup>
                    <FormGroup check>
                        <h2 className="text-center">Expermental options!</h2>
                        <Label>
                            <Input type="checkbox" className="p-1" onChange={this.setGetImagesOption.bind(this)} />
                            Try getting Images
                        </Label>
                    </FormGroup>
                    <hr />
                    <Button outline size="sm" className="p-2" onClick={this.returnConfiguration.bind(this)}>
                        Create VR World
                    </Button>
                </Form>
            </>
        );
    }
}
