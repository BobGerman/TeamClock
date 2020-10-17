import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";
import TeamService from '../services/TeamService';
import ClockService from '../services/ClockService';
import DigitalClock from './DigitalClock';
import SlideShow from './SlideShow';
import ScheduleComponent from './ScheduleComponent';
// import Clock from './Clock';

/**
 * The tab UI used when running in Teams
 */
class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      context: {},
      teamService: null
    }
  }

  componentDidMount() {
    // Get the Teams context and set it in the state
    if (microsoftTeams) {
      microsoftTeams.getContext((context, error) => {
        if (context) {
          this.setState({
            context: context
          });
        }
      });
    }
    // Get the Team Service and set it in the state
    TeamService.factory().then((service) => {
      this.setState({
        teamService: service
      });
    });
  }

  render() {
    const clockService = new ClockService();
    const teamService = new TeamService();
    const currentUser = teamService.getCurrentUser();
    const teamMembers = teamService.getOtherTeamMembers(currentUser);
    const timeZones = clockService.getTimeZones(teamMembers);
    if (this.state.teamService) {
      return (
        <main className='teamClock'>
          <header>
            <h1>What time is it now?</h1>

          </header>
          <section className='currentTimeContainer'>
            <div className='currentUser'>
              <DigitalClock clockService={clockService} showPhoto={true} timeZoneObj={currentUser.timeZoneObj} user={currentUser} timeFormat={currentUser.timeFormat} currentUser={true}></DigitalClock>
              <a href="# ">Edit My Profile</a>
            </div>
            <div className="otherTeamMembers">
              <SlideShow slides={timeZones} clockService={clockService} showPhoto={true} user={currentUser} timeFormat={currentUser.timeFormat}></SlideShow>
            </div>
          </section>
          <ScheduleComponent></ScheduleComponent>
        </main>
      );
    } else {
      return false;
    }


    // render() {

    //   if (this.state.context && this.state.teamService) {
    //   // let userName = Object.keys(this.state.context).length > 0 ? this.state.context['upn'] : "";
    //   return (
    //     <Clock teamService={this.state.teamService} />
    //   );
    //   } else {
    //     return null;
    //   }

  }

}
export default Tab;