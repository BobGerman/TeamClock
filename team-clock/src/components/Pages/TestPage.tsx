import React from 'react';
import ITeamService from '../../services/TeamService/ITeamService';
import IClockService from '../../services/ClockService/IClockService';
import { ServiceFactory, ServiceOption } from '../../services/ServiceFactory';

import ITimeZone from '../../model/ITimeZone';
import IPerson from '../../model/IPerson';

export interface ITestPageProps { };
export interface ITestPageState {
  teamService?: ITeamService;
  clockService?: IClockService;
  currentUser?: IPerson;
  teamMembers: IPerson[];
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
    // Real data currently requires Teams so this page needs mock data
    ServiceFactory.getTeamService(ServiceOption.mockData)
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

      const mainStyle = { padding: 20 }
      const headerStyle = { textAlign: 'left' as 'left'};
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
        <div style={mainStyle}>
          <h1 style={headerStyle}>Test</h1>

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

