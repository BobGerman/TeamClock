import React from 'react';
import TeamService from '../services/TeamService';
import ClockService from '../services/ClockService';
import DigitalClock from './DigitalClock';
import SlideShow from './SlideShow';
import ScheduleComponent from './ScheduleComponent';


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
      teamMembers: [],
      timeZones: null,
      dataLoaded: false,
      participants: []
    };
    this._addParticipant = this._addParticipant.bind(this);
    this._removeParticipant = this._removeParticipant.bind(this);
  }

  componentDidMount() {
    let teamService = null;
    TeamService.factory().then((service) => {
      teamService = service;
      return ClockService.factory();
    })
      .then((clockService) => {
        this.loadData(teamService, clockService);
      });
  }

  _addParticipant(participant) {
    let participantArray = this.state.participants;
    //If the meeting is empty add the current user
    if (participantArray.length === 0) {
      participantArray.push(this.state.currentUser);
    }
    if (!participantArray.includes(participant)) {
      participantArray.push(participant);
      this.setState({
        participants: participantArray
      });
    }
  }

  _removeParticipant(participant) {
    let participantArray = this.state.participants;
    if (participantArray.includes(participant)) {

      this.setState({
        participants: participantArray.filter(x => x !== participant)
      });
    }
    console.log(this.state.participants);
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
    });
  }

  render() {
    // const clockService = new ClockService();
    // const teamService = new TeamService();
    if (this.state.dataLoaded) {
      // const currentUser = await teamService.getCurrentUser();
      // const teamMembers = await teamService.getOtherTeamMembers(currentUser);
      // const timeZones = clockService.getTimeZones(teamMembers);
      return (
        <main className='teamClock'>
          <header>
            <h1>What time is it now?</h1>

          </header>
          <section className='currentTimeContainer'>
            <div className='currentUser'>
              <DigitalClock clockService={this.state.clockService}
                showPhoto={true}
                timeZoneObj={this.state.currentUser.timeZoneObj}
                user={this.state.currentUser}
                timeFormat={this.state.currentUser.timeFormat}
                currentUser={true}
                addParticipant={this._addParticipant}
                participants={this.state.participants} />
            </div>
            <div className="otherTeamMembers">
              <SlideShow slides={this.state.timeZones}
                clockService={this.state.clockService}
                showPhoto={true}
                user={this.state.currentUser}
                timeFormat={this.state.currentUser.timeFormat}
                addParticipant={this._addParticipant}
                participants={this.state.participants} />
            </div>
          </section>
          <section>
            <ScheduleComponent
              clockService={this.state.clockService}
              timeZoneObj={this.state.currentUser.timeZoneObj}
              currentUser={this.state.currentUser}
              timeFormat={this.state.currentUser.timeFormat}
              teamMembers={this.state.teamMembers}
              participants={this.state.participants}
              removeParticipant={this._removeParticipant}
              addParticipant={this._addParticipant}>

            </ScheduleComponent>
          </section>

        </main>
      );
    } else {
      return false;
    }

  }

}
export default Web;