import React from 'react';
import TeamService from '../services/TeamService';
import ClockService from '../services/ClockService';
import DigitalClock from './DigitalClock';
import SlideShow from './SlideShow';

/**
 * The web UI used when Teams pops out a browser window
 */
class Web extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamService: null,
      clockService: null,
      currentUser: null,
      teamMembers: null,
      timeZones: null,
      dataLoaded: false
    }
  }

  componentDidMount() {
    let teamService = null;
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
  async loadData(teamService, clockService) {
    const currentUser = await teamService.getCurrentUser();
    const teamMembers = await teamService.getOtherTeamMembers(currentUser);
    const timeZones = clockService.getTimeZones(teamMembers);
    this.setState({
      teamService: teamService,
      clockService: clockService,
      currentUser: currentUser,
      teamMembers: teamMembers,
      timeZones: timeZones,
      dataLoaded: true
    })
  }

  render() {
    // const clockService = new ClockService();
    // const teamService = new TeamService();
    if (this.state.dataLoaded) {
      // const currentUser = await teamService.getCurrentUser();
      // const teamMembers = await teamService.getOtherTeamMembers(currentUser);
      // const timeZones = clockService.getTimeZones(teamMembers);
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