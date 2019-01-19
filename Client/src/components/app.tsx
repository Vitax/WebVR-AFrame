/**
 * Author: Caglar Özel
 */

// Packages
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

// Components
import { Home } from "./home/index";

// Stylesheets
import "../stylesheets/css/main.css";

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
                    <Route exact path="/" component={Home} />
                </Switch>
            </BrowserRouter>
        );
    }
}
