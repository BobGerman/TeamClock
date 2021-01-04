import React from 'react';
import './App.scss';
import * as microsoftTeams from "@microsoft/teams-js";
import { HashRouter as Router, Route } from "react-router-dom";
import PrivacyPage from "../Pages/PrivacyPage";
import TermsOfUsePage from "../Pages/TermsOfUsePage";
import TabPage from '../Pages/TabPage';
import TabTestPage from '../Pages/TabTestPage';
import TabConfigPage from "../Pages/TabConfigPage";
import TeamsAuthPopup from "../Pages/TeamsAuthPopup";
import WebPage from "../Pages/WebPage";
import WebTestPage from "../Pages/WebTestPage";
import AuthService from '../../services/AuthService/MsalRefreshAuthService';

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export interface IAppProps { };
export interface IAppState {
  redirectHandled: boolean;
}

export default class App extends React.Component<IAppProps, IAppState> {

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      redirectHandled: false
    };
  }

  componentDidMount() {
    // React routing and OAuth don't play nice together
    // Take care of the OAuth fun before routing
    AuthService.handleRedirect().then(() => {
      this.setState({
        redirectHandled: true
      });
    })
  }

  render() {

    if (microsoftTeams) {

      if (!this.state.redirectHandled) {

        return (
          <div className="App">
            <p>Authorizing (Part 2: Exchanging auth code for access token)</p>
          </div>
        );

      } else {
        // We are not running in a Teams IFrame, set up applicable routes:
        if (window.parent === window.self) {
          return (
            <div className="App">
              <Router>
                <Route exact path="/privacy" component={PrivacyPage} />
                <Route exact path="/termsofuse" component={TermsOfUsePage} />
                <Route exact path="/web" component={WebPage} />
                <Route exact path="/webTest" component={WebTestPage} />
                <Route exact path="/test" component={WebTestPage} />
                <Route exact path="/" component={WebPage} />
                <Route exact path="/teamsauthpopup" component={TeamsAuthPopup} />
                <Route exact path="/tab" component={TeamsHostError} />
                <Route exact path="/tabTest" component={TeamsHostError} />
                <Route exact path="/config" component={TeamsHostError} />
              </Router>
            </div>
          );
        }

        // Initialize the Microsoft Teams SDK
        microsoftTeams.initialize(window as any);

        // We are running in a Teams IFrame, set up applicable routes:
        return (
          <div className="App">
            <Router>
              <Route exact path="/tab" component={TabPage} />
              <Route exact path="/tabTest" component={TabTestPage} />
              <Route exact path="/config" component={TabConfigPage} />
            </Router>
          </div>
        );
      }
    }

    // Error when the Microsoft Teams SDK is not found
    // in the project.
    return (
      <h3>Microsoft Teams SDK not found.</h3>
    );
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
