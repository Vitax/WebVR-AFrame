import React, { Component, ChangeEvent } from "react";
import { Row, Col, Button } from "reactstrap";

import { DatasetService } from "../../../core/database/DatasetService";

interface IConfigurationProps {}

interface IConfigurationStates {
  dataSet: any;
  url: string;
}

export class Configuration extends Component<IConfigurationProps, IConfigurationStates> {
  private readonly datasetService: DatasetService;

  constructor(props: IConfigurationProps, states: IConfigurationStates) {
    super(props, states);

    this.state = {
      dataSet: {},
      url: ""
    };

    this.datasetService = new DatasetService();
  }

  private getDataset(): void {
      console.log("url: ", this.state.url);

    this.datasetService
      .getDataset(this.state.url)
          .then(result => {
            console.log("result of request: ", result);
          })
          .catch(error => {
            console.error("Error while retrieving dataset: ", error);
          });
  }

  private setUrlString(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ url: event.target.value });
  }

  render() {
    return (
      <Row>
        <Col md={12} xs={12}>
          <input type="text" onChange={this.setUrlString.bind(this)} />
          <Button size="sm" onClick={this.getDataset.bind(this)}>Request</Button>
        </Col>
      </Row>
    );
  }
}
