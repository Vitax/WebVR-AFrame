import React, { Component } from "react";
import ReactDOM from "react-dom";
import "aframe";

import { Home } from "./home/index";

import "../stylesheets/css/main.css";

interface IAppProps {}

interface IAppStates {}

export class App extends Component<IAppProps, IAppStates> {
  constructor(props: IAppProps, states: IAppStates) {
    super(props, states);
  }

  render() {
    return <Home />;
  }
}
