import React from 'react';
import ITeamService from '../services/TeamService/ITeamService';
import IClockService from '../services/ClockService/IClockService';

import DigitalClock from './DigitalClock';
import SlideShow from './SlideShow';
import EditProfile from './EditProfile';
import ITimeZone from '../model/ITimeZone';
// import ScheduleComponent from './ScheduleComponent';
import IPerson from '../model/IPerson';

export interface ITeamClockProps {
  teamService: ITeamService;
  clockService: IClockService;
};
enum loadingState { waiting, failed, success }
export interface ITeamClockState {
  currentUser?: IPerson;
  teamMembers: IPerson[];
  timeZones: ITimeZone[];
  participants: IPerson[];
  dataLoaded: loadingState;
};

/**
 * The web UI used when Teams pops out a browser window
 */
export default class TeamClock extends React.Component<ITeamClockProps, ITeamClockState> {
  constructor(props: ITeamClockProps) {
    super(props);
    this.state = {
      currentUser: undefined,
      teamMembers: [],
      timeZones: [],
      participants: [],
      dataLoaded: loadingState.waiting
    };
  }

  componentDidMount() {
    if (this.props.teamService && this.props.clockService) {
      this.loadData(this.props.teamService, this.props.clockService, true);
    }
  }

  // Right now this is called only by componentDidMount()
  // Some day an event handler will call this to reload data after a user
  // makes some changes
  async loadData(teamService: ITeamService, clockService: IClockService, failSilently: boolean) {
    try {
      const currentUser = await teamService.getCurrentUser("WHAT IS THIS");
      const teamMembers = await teamService.getOtherTeamMembers(currentUser);
      const timeZones = clockService.getTimeZones(teamMembers);
      this.setState({
        currentUser: currentUser,
        teamMembers: teamMembers,
        timeZones: timeZones,
        dataLoaded: loadingState.success
      });
    } catch (error) {
      this.setState({ dataLoaded: loadingState.failed });
      if (!failSilently) {
        throw error;
      }
    }
  }

  public _addParticipant(participant: IPerson) {
    let participantArray = this.state.participants;
    //If the meeting is empty add the current user
    if (participantArray.length === 0 && this.state.currentUser) {
      participantArray.push(this.state.currentUser);
    }
    if (!participantArray.includes(participant)) {
      participantArray.push(participant);
      this.setState({
        participants: participantArray
      });
    }
  }

  public _removeParticipant(participant: IPerson) {
    let participantArray = this.state.participants;
    if (participantArray.includes(participant)) {

      this.setState({
        participants: participantArray.filter(x => x !== participant)
      });
    }
    console.log(this.state.participants);
  }

  render() {
    if (this.state.dataLoaded === loadingState.waiting) {
      // Nothing to see here folks
      return (<div>Loading...</div>);
    } else if (this.state.dataLoaded === loadingState.failed) {
      // Failure is usually pop-up blocker; try a button
      return (<button onClick={async () => {
        if (this.props.teamService && this.props.clockService) {
          await this.loadData(this.props.teamService, this.props.clockService, false);
        }
      }}>Log in</button>);
    } else if (this.props.clockService &&
      this.state.currentUser &&
      this.state.timeZones) {
      // If here, data is loaded, display it
      return (
        <main className='teamClock'>
          <header>
            <h1>What time is it now?</h1>
          </header>
          <EditProfile teamService={this.props.teamService} />
          <section className='currentTimeContainer'>

            <div className='currentUser'>
              <DigitalClock clockService={this.props.clockService}
                showPhoto={true}
                timeZoneObj={this.state.currentUser.timeZoneObj}
                user={this.state.currentUser}
                timeFormat={this.state.currentUser.timeFormat}
                currentUser={true}
                addParticipant={this._addParticipant.bind(this)}
                participants={this.state.participants} />
            </div>
            <div className="otherTeamMembers">
              <SlideShow slides={this.state.timeZones}
                clockService={this.props.clockService}
                showPhoto={true}
                user={this.state.currentUser}
                timeFormat={this.state.currentUser.timeFormat}
                addParticipant={this._addParticipant.bind(this)}
                participants={this.state.participants} />
            </div>
          </section>
        </main>
      );
    } else {
      // If here, data loaded successfully but something is missing
      throw new Error ("User login or data access failure");
    }

  }

}
