import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import { HashRouter as Router, Route } from "react-router-dom";
import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import Tab from './Tab';
import TabConfig from './TabConfig';
import Web from './Web';
import AuthService from '../services/AuthService'

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
class App extends React.Component {

  constructor() {
    super();
    this.state = {
      authInitialized: false
    }
  }

  componentDidMount() {
    // React routing and OAuth don't play nice together
    // Take care of the OAuth fun before routing
    AuthService.init()
      .then((result) => {
        this.setState({
          authInitialized: true
        });
      })
  }

  render() {
    if (!this.state.authInitialized) {

      // Wait for Auth Service to initialize
      return (<p>Loading...</p>);

    } else if (microsoftTeams) {

      if (window.parent === window.self) {

        // If here we are not in an IFrame - assume we're not in Teams
        return (
          <div className="App">
            <Router>
              <Route exact path="/privacy" component={Privacy} />
              <Route exact path="/termsofuse" component={TermsOfUse} />
              <Route exact path="/web" component={Web} />
              <Route exact path="/" component={Web} />
              <Route exact path="/tab" component={TeamsHostError} />
              <Route exact path="/config" component={TeamsHostError} />
            </Router>
          </div>
        );
      }

      // If here we are in an IFrame - assume we are in Teams and initialize
      microsoftTeams.initialize(window);

      // Only a couple of the pages in the app work in Teams tabs
      return (
        <div className="App">
          <Router>
            <Route exact path="/tab" component={Tab} />
            <Route exact path="/config" component={TabConfig} />
          </Router>
        </div>
      );
    } else {

      // If here, the Teams SDK is missing in action
      return (
        <h3>Microsoft Teams SDK not found.</h3>
      );

    }

  }
}

/**
 * This component displays an error message in the
 * case when a page is not being hosted within Teams.
 */
class TeamsHostError extends React.Component {
  render() {
    return (
      <div>
        <h3 className="Error">Debug your app within the Teams client.</h3>
      </div>
    );
  }
}

export default App;
