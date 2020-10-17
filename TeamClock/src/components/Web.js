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
      teamService: null
    }
  }

  componentDidMount() {
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

        </main>
      );
    } else {
      return false;
    }

  }

}
export default Web;