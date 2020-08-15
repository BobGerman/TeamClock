import React from 'react';
import { HashRouter as Router, Route } from "react-router-dom";
import * as microsoftTeams from "@microsoft/teams-js";
import AuthService from '../services/AuthService'
import './App.css';

// React components
import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import Tab from './Tab';
import TeamsHostError from './TeamsHostError';
import TabConfig from './TabConfig';
import Web from './Web';

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
    AuthService.init().then(() => {
        this.setState({
          authInitialized: true
        });
      })
  }

  render() {

    if (!this.state.authInitialized) {

      // Wait for Auth Service to initialize
      return (<p>Authorizing...</p>);

    } else {

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
      } else {

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
      }
    }
  }
}

export default App;
