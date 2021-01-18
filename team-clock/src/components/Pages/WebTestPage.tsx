import React from 'react';
import { Provider, Header } from "@fluentui/react-northstar";

import AuthService from '../../services/AuthService/MsalRefreshAuthService';

import ITeamService from '../../services/TeamService/ITeamService';
import IClockService from '../../services/ClockService/IClockService';
import { ServiceFactory, ServiceOption } from '../../services/ServiceFactory';

import ITimeZone from '../../model/ITimeZone';
import IPerson from '../../model/IPerson';

export interface IWebPageProps { }
export interface IWebPageState {
  dataReady: boolean;
  error: string;
  teamService?: ITeamService;
  clockService?: IClockService;
  currentUser?: IPerson;
  teamMembers: IPerson[];
  timeZones: ITimeZone[];
}

export default class WebTestPage extends React.Component<IWebPageProps, IWebPageState> {

  constructor(props: IWebPageProps) {
    super(props);
    this.state = {
      dataReady: false,
      error: "",
      teamService: undefined,
      clockService: undefined,
      currentUser: undefined,
      teamMembers: [],
      timeZones: []
    }
  }

  async componentDidMount() {

    // 1. Use test site as defined in .env.local
    const spSiteUrl = process.env.REACT_APP_SP_URL;
    const spListName = process.env.REACT_APP_SP_LISTNAME;

    // 2. Connect to services
    let clockService = ServiceFactory.getClockService();

    let teamService = await ServiceFactory.getTeamService(ServiceOption.msalAuth,
      spSiteUrl, spListName);
    this.setState({
      teamService: teamService,
      clockService: clockService,
      dataReady: false
    });

    // 3. Try to silently get data
    await this.loadData(teamService, clockService, true);
  }

  private async loadData(teamService: ITeamService, clockService: IClockService, silent = false) {
    try {
      const currentUser = await teamService.getCurrentUser("WHAT IS THIS");
      const teamMembers = await teamService.getOtherTeamMembers(currentUser);
      const timeZones = clockService.getTimeZones(teamMembers);
      this.setState({
        teamService: teamService,
        clockService: clockService,
        currentUser: currentUser,
        dataReady: true,
        teamMembers: teamMembers,
        timeZones: timeZones
      });
    }
    catch (error) {
      console.log('Error in TabTestPage loadData ' + error);
      if (silent) {
        this.setState({
          dataReady: false
        });
      } else {
        this.setState({
          dataReady: false,
          error: error.message
        });
      }
    }
  }


  render() {

    if (!this.state.dataReady) {

      // Earlier attempt to log in failed - show the button
      return (
        <Provider>
          <Header>{process.env.REACT_APP_MANIFEST_NAME} Test Page</Header>
          <p>Version {process.env.REACT_APP_MANIFEST_APP_VERSION}</p>
          { this.state.error ? <p>Error: {this.state.error}</p> : null}
          <button onClick={async () => {
            if (this.state.teamService && this.state.clockService) {
              await this.loadData(this.state.teamService, this.state.clockService);
            }
          }}>Log in</button>
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
        let key = 0;

        return (
          <Provider style={mainStyle}>
            <Header>{process.env.REACT_APP_MANIFEST_NAME}</Header>
            <p>Version {process.env.REACT_APP_MANIFEST_APP_VERSION}</p>
            { this.state.error ? <p>Error: {this.state.error}</p> : null}
            <p>You are logged in as: {AuthService.getUsername()}</p>
            <p>Your app is running outside of Teams</p>

            <h3 style={headerStyle}>Team members</h3>
            <table style={tableStyle}><tbody>
              <tr key={key++}>
                <td style={tdStyle} key={key++}>Current user</td>
                <td style={tdStyle} key={key++}><User user={this.state.currentUser} /></td>
              </tr>
              {this.state.teamMembers.map(m =>
                <tr key={key++} >
                  <td style={tdStyle} key={key++}>User {userCount++}</td>
                  <td style={tdStyle} key={key++}><User user={m} /></td>
                </tr>
              )}
            </tbody></table>

            <h3 style={headerStyle}>Time zones</h3>
            <table style={tableStyle}><tbody>
              {this.state.timeZones.map(tz =>
                <tr key={key++}>
                  <td style={tdStyle} key={key++}>{tz.timeZone} ({tz.abbreviation}) -
                    UTC{(tz.offset < 0 ? "" : "+") + tz.offset}</td>
                  <td style={tdStyle} key={key++}>{tz.members.map((m) =>
                    <User key={key++} user={m} />
                  )}</td>
                </tr>
              )}
            </tbody></table>

          </Provider>
        );

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

class User extends React.Component<{ user: IPerson }> {
  render() {
    return (
      <div>
        <div>{this.props.user.firstName} {this.props.user.lastName}</div>
        <Timezone timeZone={this.props.user.timeZoneObj} />
      </div>
    );
  }
}

