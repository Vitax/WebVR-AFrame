/**
 * Author: Caglar Özel
 */

// Packages
import React, { Component, ChangeEvent } from "react";
import { Row, Col, Table, Label, Input } from "reactstrap";

// Custom classes
import { ParseData } from "../../../../core/analytics/DatasetParser";

// Models
import { DSVRowArray } from "../models/DSVRowArray";

interface IShowDataProps {
    returnChosenDataset: (dataset: DSVRowArray<string>) => void;
}

interface IShowDataStates {
    url: string;
    noValidFile: boolean;
    currentFile: File;
    dataset: DSVRowArray<string>;
}

export class ShowData extends Component<IShowDataProps, IShowDataStates> {
    private readonly dataParser: ParseData;

    constructor(props: IShowDataProps, states: IShowDataStates) {
        super(props, states);

        this.state = {
            url: "",
            noValidFile: false,
            currentFile: null,
            dataset: new DSVRowArray<string>(),
        };

        this.dataParser = new ParseData();
    }

    private fileChosen(event: ChangeEvent<HTMLInputElement>) {
        this.setState({ currentFile: event.target.files[0] }, () => {
            this.analyseData();
        });
    }

    private analyseData() {
        let reader = new FileReader();

        reader.onloadend = () => {
            let content = reader.result;
            if (this.state.currentFile != null) {
                let fileNameArray = this.state.currentFile.name.split(".");
                let extension = fileNameArray[fileNameArray.length - 1];
                if (this.state.currentFile.type == "application/json" || extension == "json") {
                    let json_data = JSON.parse(content.toString());
                    let dataset: DSVRowArray<string> = new DSVRowArray<string>();

                    dataset.columns = Object.keys(json_data[0]);

                    for (let set in json_data) {
                        dataset.push(json_data[set]);
                    }

                    this.setState({ dataset: dataset, noValidFile: false }, () => {
                        this.renderDataSample();
                        this.props.returnChosenDataset(this.state.dataset);
                    });
                } else if (this.state.currentFile.type == "text/tab-separated-values" || extension == "tsv") {
                    this.setState(
                        { dataset: this.dataParser.parseTsvToJson(content.toString()), noValidFile: false },
                        () => {
                            this.renderDataSample();
                            this.props.returnChosenDataset(this.state.dataset);
                        }
                    );
                } else if (this.state.currentFile.type == "text/csv" || extension == "csv") {
                    this.setState(
                        { dataset: this.dataParser.parseCsvToJson(content.toString()), noValidFile: false },
                        () => {
                            this.renderDataSample();
                            this.props.returnChosenDataset(this.state.dataset);
                        }
                    );
                } else {
                    this.setState({ noValidFile: true });
                }
            }
        };

        reader.readAsText(this.state.currentFile);
    }

    private renderDataSample() {
        if (this.state.dataset.length == 0) return;
        let tableBody = [];

        this.state.dataset.forEach((value: Object, i: number) => {
            if (i < 10) {
                tableBody.push(
                    <tr>
                        {this.state.dataset["columns"].map((elemName: string) => {
                            return <td>{value[elemName]}</td>;
                        })}
                    </tr>
                );
            }
        });

        return (
            <>
                <Table>
                    <thead>
                        {this.state.dataset["columns"].map((elemName: string) => {
                            return <th>{elemName}</th>;
                        })}
                    </thead>
                    <tbody>
                        <>{tableBody}</>
                    </tbody>
                </Table>
                <span style={{ color: "#D50000AA" }}>
                    ...Note that some Data may not be displayed if the Attributes are missing...
                </span>
            </>
        );
    }

    render() {
        return (
            <>
                <Row className="text-center p-4">
                    <Col md={2} xs={2} className="mt-auto">
                        <Label>Select a File:</Label>
                    </Col>
                    <Col md={10} xs={10} className="p-1">
                        <Input type="file" onChange={this.fileChosen.bind(this)} />
                    </Col>
                </Row>
                {this.state.dataset.length != 0 && (
                    <>
                        <hr />
                        <Row>
                            <Col md={12} xs={12}>
                                <h2 className="text-center">Data Sample</h2>
                                {this.renderDataSample()}
                            </Col>
                        </Row>
                    </>
                )}
            </>
        );
    }
}
