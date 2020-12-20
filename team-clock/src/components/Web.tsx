import React from 'react';
import { ITeamService, TeamService } from '../services/TeamService';
import ClockService from '../services/ClockService';
import DigitalClock from './DigitalClock';
import SlideShow from './SlideShow';
import ITimeZone from '../model/ITimeZone';
import IUser from '../model/IUser';

export interface IWebProps { };
export interface IWebState {
  teamService?: TeamService;
  clockService?: ClockService;
  currentUser?: IUser;
  teamMembers: IUser[];
  timeZones: ITimeZone[];
};

/**
 * The web UI used when Teams pops out a browser window
 */
class Web extends React.Component <IWebProps, IWebState> {
  constructor(props: IWebProps) {
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
    TeamService.factory().then((service) => {
      teamService = service;
      return ClockService.factory();
    })
    .then((clockSservice) => {
      this.loadData(teamService, clockSservice);
    });
  }

  // Right now this is called only by componentDidMount()
  // Some day an event handler will call this to reload data after a user
  // makes some changes
  async loadData(teamService: ITeamService, clockService: ClockService) {
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
      return (
        <div className='teamClock'>
          <h1>What time is it now?</h1>
          <a href="# ">Edit My Profile</a>
          <div className='currentTimeContainer'>

            <div className='currentUser'>
              <DigitalClock clockService={this.state.clockService}
                            showPhoto={true}
                            timeZoneObj={this.state.currentUser.timeZoneObj}
                            user={this.state.currentUser}
                            timeFormat={this.state.currentUser.timeFormat}
                            currentUser={true} />
            </div>
            <div className="otherTeamMembers">
              <SlideShow slides={this.state.timeZones}
                         clockService={this.state.clockService} 
                         showPhoto={true} 
                         user={this.state.currentUser} 
                         timeFormat={this.state.currentUser.timeFormat} />
            </div>
          </div>
        </div>
      );
    } else {
      return false;
    }

  }

}
export default Web;