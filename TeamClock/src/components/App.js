import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import { HashRouter as Router, Route, Redirect } from "react-router-dom";
import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import Tab from './Tab';
import TabConfig from './TabConfig';
import Web from './Web';
import MsalRedirectHandler from './MsalRedirectHandler';

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
function App() {
  // Check for the Microsoft Teams SDK object.
  if (microsoftTeams) {

    // Set app routings that don't require microsoft Teams
    // SDK functionality.  Show an error if trying to access the
    // Home page.
    if (window.parent === window.self) {

      if (window.location.hash.indexOf("code=") >= 0) {
        return <MsalRedirectHandler />
      } else {
        return (
          <div className="App">
            <Router>
              <Route exact path="/privacy" component={Privacy} />
              <Route exact path="/termsofuse" component={TermsOfUse} />
              <Route exact path="/web" component={Web} />
              <Route exact path="/" component={Web} />
              <Route exact path="/tab" component={TeamsHostError} />
              <Route exact path="/config" component={TeamsHostError} />
              <Redirect component={Web} />
            </Router>
          </div>
        );
  
      }
    }

    // Initialize the Microsoft Teams SDK
    microsoftTeams.initialize(window);

    // Display the app home page hosted in Teams
    return (
      <div className="App">
        <Router>
          <Route exact path="/tab" component={Tab} />
          <Route exact path="/config" component={TabConfig} />
        </Router>
      </div>
    );
  }

  // Error when the Microsoft Teams SDK is not found
  // in the project.
  return (
    <h3>Microsoft Teams SDK not found.</h3>
  );
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
