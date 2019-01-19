/**
 * Author: Caglar Özel
 */

// Packages
import React, { Component, ChangeEvent } from "react";
import { Row, Col, Button, Table } from "reactstrap";

// Custom classes
import { AnalyseData } from "../../../../core/analytics/AnalyseData";

// Services
import { DatasetService } from "../../../../core/database/DatasetService";

// Models
import { DSVRowArray } from "../models/DSVRowArray";

interface IShowDataProps {}

interface IShowDataStates {
    url: string;
    noValidFile: boolean;
    currentFile: File;
    dataset: DSVRowArray<string>;
}

export class ShowData extends Component<IShowDataProps, IShowDataStates> {
    private readonly datasetService: DatasetService;
    private readonly dataAnalyser: AnalyseData;

    constructor(props: IShowDataProps, states: IShowDataStates) {
        super(props, states);

        this.state = {
            url: "",
            noValidFile: false,
            currentFile: null,
            dataset: new DSVRowArray<string>(),
        };

        this.datasetService = new DatasetService();
        this.dataAnalyser = new AnalyseData();
    }

    private getDataset(): void {
        this.datasetService.getDataset(this.state.url);
    }

    private setUrlString(event: ChangeEvent<HTMLInputElement>) {
        this.setState({ url: event.target.value });
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
                if (this.state.currentFile.type == "application/json") {
                    let json_data = JSON.parse(content.toString());
                    let dataset: DSVRowArray<string> = new DSVRowArray<string>();

                    dataset.columns = Object.keys(json_data[0]);

                    for (let set in json_data) {
                        dataset.push(json_data[set]);
                    }

                    this.setState({ dataset: dataset, noValidFile: false }, () => {
                        this.renderDataSample();
                    });
                } else if (this.state.currentFile.type == "text/tab-separated-values") {
                    this.setState(
                        { dataset: this.dataAnalyser.parseTsvToJson(content.toString()), noValidFile: false },
                        () => {
                            this.renderDataSample();
                        }
                    );
                } else if (this.state.currentFile.type == "text/csv") {
                    this.setState(
                        { dataset: this.dataAnalyser.parseCsvToJson(content.toString()), noValidFile: false },
                        () => {
                            this.renderDataSample();
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
        );
    }

    render() {
        return (
            <>
                <Row className="text-center">
                    <Col md={12} xs={12} className="p-1">
                        <h4>Data from File</h4>
                    </Col>
                    <Col md={12} xs={12} className="p-1">
                        <input type="file" onChange={this.fileChosen.bind(this)} />
                    </Col>
                </Row>
                {this.state.dataset.length != 0 && (
                    <>
                        <hr />
                        <Row>
                            <Col md={12} xs={12}>
                                <h4>Data Sample</h4>
                                {this.renderDataSample()}
                            </Col>
                        </Row>
                    </>
                )}
            </>
        );
    }
}
