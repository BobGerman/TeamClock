import React from 'react';
import ITeamService from '../../services/TeamService/ITeamService';
import IClockService from '../../services/ClockService/IClockService';
import ServiceFactory from '../../services/ServiceFactory';

import ITimeZone from '../../model/ITimeZone';
import IUser from '../../model/IUser';

export interface ITestPageProps { };
export interface ITestPageState {
  teamService?: ITeamService;
  clockService?: IClockService;
  currentUser?: IUser;
  teamMembers: IUser[];
  timeZones: ITimeZone[];
};

/**
 * The web UI used when Teams pops out a browser window
 */
export default class TestPage extends React.Component<ITestPageProps, ITestPageState> {
  constructor(props: ITestPageProps) {
    super(props);
    this.state = {
      teamService: undefined,
      clockService: undefined,
      currentUser: undefined,
      teamMembers: [],
      timeZones: []
    }
  }

  componentDidMount() {
    let teamService: ITeamService;
    ServiceFactory.getTeamService()
      .then((service) => {
        teamService = service;
        return ServiceFactory.getClockService();
      })
      .then((clockService) => {
        this.loadData(teamService, clockService);
      });
  }

  // Right now this is called only by componentDidMount()
  // Some day an event handler will call this to reload data after a user
  // makes some changes
  async loadData(teamService: ITeamService, clockService: IClockService) {
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
    if (this.state.clockService &&
        this.state.currentUser &&
        this.state.timeZones) {

      const tableStyle = { border: '1px' };
      const tdStyle = {  };

      return (
        <div>
          <h1>Test</h1>

          <h3>Team members</h3>
          <table style={tableStyle}>
            <tr>
              <td style={tdStyle}>Current user</td>
              <td style={tdStyle}>{this.state.currentUser.firstName} {this.state.currentUser.lastName}</td>
            </tr>
            {this.state.teamMembers.map(m =>
              <tr>
                <td style={tdStyle}></td>
                <td style={tdStyle}><User user={m} /></td>
              </tr>
            )}
          </table>

          <h3>Time zones</h3>
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

        </div>
      );
    } else {
      return (
        <div>loading</div>
      );
    }
  }
}

class Timezone extends React.Component<{ timeZone: ITimeZone}> {
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

