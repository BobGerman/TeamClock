import React from 'react';
import { Provider, Header, ThemePrepared } from "@fluentui/react-northstar";
import * as microsoftTeams from "@microsoft/teams-js";

import { IConfig, ConfigService } from '../../services/ConfigService/ConfigService';
import ThemeService from '../../services/ThemeService/ThemeService';
import AuthService from '../../services/AuthService/TeamsAuthService';
import MSGraphService from '../../services/MSGraphService/MSGraphService';
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";

/**
 * The web UI to display in the Teams UI
 */
export interface ITabPageProps { }
export interface ITabPageState {
  config?: IConfig;
  teamsContext?: microsoftTeams.Context;
  theme: ThemePrepared;
  messages: MicrosoftGraph.Message[];
  error: string;
}

export default class TabTestPage extends React.Component<ITabPageProps, ITabPageState> {

  constructor(props: ITabPageProps) {
    super(props);
    this.state = {
      config: undefined,
      teamsContext: undefined,
      theme: ThemeService.getFluentTheme(),
      messages: [],
      error: ""
    }
  }

  async componentDidMount() {

    // 1. Get tab configuration information
    let { config, teamsContext } = await ConfigService.getContextAndConfig();
    this.setState({
      config: config,
      teamsContext: teamsContext,
      theme: ThemeService.getFluentTheme(teamsContext.theme)
    });

    // 2. Handle theme changes
    ThemeService.registerOnThemeChangeHandler((newTheme) => {
      this.setState({
        theme: newTheme
      });
    });

    // 3. Try to silently get messages
    await this.getMessages(true);

    // 4. Tell Teams to stop the loading indicator and show the page
    microsoftTeams.appInitialization.notifyAppLoaded();
    microsoftTeams.appInitialization.notifySuccess();   // see http://bit.ly/387PYqO 
  }

  render() {

    if (!this.state.messages.length) {

      // Earlier attempt to log in failed - show the button
      return (
        <Provider theme={this.state.theme}>
          <Header>{process.env.REACT_APP_MANIFEST_NAME} Test Page</Header>
          <p>Version {process.env.REACT_APP_MANIFEST_APP_VERSION}</p>
          { this.state.error ? <p>Error: {this.state.error}</p> : null}
          <button onClick={async () => { await this.getMessages(); }}>Log in</button>
        </Provider>
      );

    } else {

      let key = 0;
      return (
        <Provider theme={this.state.theme}>
          <Header>{process.env.REACT_APP_MANIFEST_NAME}</Header>
          <p>Version {process.env.REACT_APP_MANIFEST_APP_VERSION}</p>
          { this.state.error ? <p>Error: {this.state.error}</p> : null}
          <p>You are logged in as: {AuthService.getUsername()}</p>
          <p>Your app is running in the Teams UI</p>
          { this.state.teamsContext?.teamName ? <p>You are in {this.state.teamsContext?.teamName}</p> : null}
          { this.state.config?.spListName ? <p>You configured a short message for this tab: {this.state.config?.spListName}</p> : null }
          <ol>
            {
              this.state.messages.map(message => (
                <li key={key++}>EMAIL: {message.receivedDateTime}<br />{message.subject}
                </li>
              ))
            }
          </ol>
        </Provider>
      );
    }
  }

  private async getMessages(silent = false): Promise<void> {

    try {
      let graphService = await MSGraphService.Factory(AuthService);
      let messages = await graphService.getMessages();
      this.setState({
        messages: messages,
        error: ""
      });
    }
    catch (error) {
      if (silent) {
        this.setState ({
          messages: []
        });
      } else {
        this.setState({
          messages: [],
          error: error
        });
      }
    }
  }

}
