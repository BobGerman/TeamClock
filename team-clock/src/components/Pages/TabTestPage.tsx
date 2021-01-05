import React from 'react';
import { Provider, Header, ThemePrepared } from "@fluentui/react-northstar";
import * as microsoftTeams from "@microsoft/teams-js";

import { IConfig, ConfigService } from '../../services/ConfigService/ConfigService';
import ThemeService from '../../services/ThemeService/ThemeService';
import AuthService from '../../services/AuthService/TeamsAuthService';
import MSGraphService from '../../services/MSGraphService/MSGraphService';
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";

import ITeamService from '../../services/TeamService/ITeamService';
import IClockService from '../../services/ClockService/IClockService';
import { ServiceFactory, ServiceOption } from '../../services/ServiceFactory';

import ITimeZone from '../../model/ITimeZone';
import IUser from '../../model/IUser';

export interface ITabPageProps { }
export interface ITabPageState {
  config?: IConfig;
  teamsContext?: microsoftTeams.Context;
  theme: ThemePrepared;
  messages: MicrosoftGraph.Message[];
  error: string;
  teamService?: ITeamService;
  clockService?: IClockService;
  currentUser?: IUser;
  teamMembers: IUser[];
  timeZones: ITimeZone[];
}

export default class TabTestPage extends React.Component<ITabPageProps, ITabPageState> {

  constructor(props: ITabPageProps) {
    super(props);
    this.state = {
      config: undefined,
      teamsContext: undefined,
      theme: ThemeService.getFluentTheme(),
      messages: [],
      error: "",
      teamService: undefined,
      clockService: undefined,
      currentUser: undefined,
      teamMembers: [],
      timeZones: []
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

    // 3. Connect to services
    let teamService: ITeamService;
    ServiceFactory.getTeamService(ServiceOption.teamsAuth)
      .then((service) => {
        teamService = service;
        return ServiceFactory.getClockService();
      })
      .then((clockService) => {
        this.loadData(teamService, clockService);
      });

    // 4. Try to silently get messages
    await this.getMessages(true);

    // 5. Tell Teams to stop the loading indicator and show the page
    microsoftTeams.appInitialization.notifyAppLoaded();
    microsoftTeams.appInitialization.notifySuccess();   // see http://bit.ly/387PYqO 
  }

  // Right now this is called only by componentDidMount()
  // Some day an event handler will call this to reload data after a user
  // makes some changes
  private async loadData(teamService: ITeamService, clockService: IClockService) {
    const currentUser = await teamService.getCurrentUser("WHAT IS THIS");
    const teamMembers = await teamService.getOtherTeamMembers(currentUser);
    const timeZones = clockService.getTimeZones(teamMembers);
    this.setState({
      teamService: teamService,
      clockService: clockService,
      currentUser: currentUser,
      teamMembers: teamMembers,
      timeZones: timeZones
    })
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

      if (this.state.clockService &&
        this.state.currentUser &&
        this.state.timeZones) {

        // Hack styles for the test page
        const mainStyle = { padding: 20 }
        const headerStyle = { textAlign: 'left' as 'left' };
        const tableStyle = { border: '1px' };
        const tdStyle = {
          fontSize: 'large',
          textAlign: 'left' as 'left',
          verticalAlign: 'top',
          border: '1px solid',
          padding: 5
        };

        let userCount = 1;

        return (
          <Provider theme={this.state.theme} style={mainStyle}>
            <Header>{process.env.REACT_APP_MANIFEST_NAME}</Header>
            <p>Version {process.env.REACT_APP_MANIFEST_APP_VERSION}</p>
            { this.state.error ? <p>Error: {this.state.error}</p> : null}
            <p>You are logged in as: {AuthService.getUsername()}</p>
            <p>Your app is running in the Teams UI</p>
            { this.state.teamsContext?.teamName ? <p>You are in {this.state.teamsContext?.teamName}</p> : null}
            { this.state.config?.spListName ? <p>You configured a SharePoint list for this tab: {this.state.config?.spListName}</p> : null}
            <h3>You received {this.state.messages.length} messages</h3>

            <h3 style={headerStyle}>Team members</h3>
            <table style={tableStyle}>
              <tr>
                <td style={tdStyle}>Current user</td>
                <td style={tdStyle}><User user={this.state.currentUser} /></td>
              </tr>
              {this.state.teamMembers.map(m =>
                <tr>
                  <td style={tdStyle}>User {userCount++}</td>
                  <td style={tdStyle}><User user={m} /></td>
                </tr>
              )}
            </table>

            <h3 style={headerStyle}>Time zones</h3>
            <table style={tableStyle}>
              {this.state.timeZones.map(tz =>
                <tr>
                  <td style={tdStyle}>{tz.timeZone} ({tz.abbreviation}) -
                    UTC{(tz.offset < 0 ? "" : "+") + tz.offset}</td>
                  <td style={tdStyle}>{tz.members.map((m) =>
                    <User user={m} />
                  )}</td>
                </tr>
              )}
            </table>

          </Provider>
        );

      }
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
        this.setState({
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
class Timezone extends React.Component<{ timeZone: ITimeZone }> {
  render() {
    return (
      <div>
        {this.props.timeZone.timeZone} ({this.props.timeZone.abbreviation}) -
        UTC{(this.props.timeZone.offset < 0 ? "" : "+") + this.props.timeZone.offset}
      </div>
    );
  }
}

class User extends React.Component<{ user: IUser }> {
  render() {
    return (
      <div>
        <div>{this.props.user.firstName} {this.props.user.lastName}</div>
        <Timezone timeZone={this.props.user.timeZoneObj} />
      </div>
    );
  }
}

