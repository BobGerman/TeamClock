import React from 'react';
import ITeamService from '../../services/TeamService/ITeamService';
import IClockService from '../../services/ClockService/IClockService';
import ServiceFactory from '../../services/ServiceFactory';

import DigitalClock from '../DigitalClock';
import SlideShow from '../SlideShow';
import ITimeZone from '../../model/ITimeZone';
import ScheduleComponent from '../ScheduleComponent';
import IUser from '../../model/IUser';

export interface IWebProps { };
export interface IWebState {
  teamService?: ITeamService;
  clockService?: IClockService;
  currentUser?: IUser;
  teamMembers: IUser[];
  timeZones: ITimeZone[];
  participants: IUser[];
};

/**
 * The web UI used when Teams pops out a browser window
 */
export default class WebPage extends React.Component <IWebProps, IWebState> {
  constructor(props: IWebProps) {
    super(props);
    this.state = {
      teamService: undefined,
      clockService: undefined,
      currentUser: undefined,
      teamMembers: [],
      timeZones: [],
      participants: []
    };
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

  public _addParticipant(participant: IUser) {
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

  public _removeParticipant(participant: IUser) {
    let participantArray = this.state.participants;
    if (participantArray.includes(participant)) {

      this.setState({
        participants: participantArray.filter(x => x !== participant)
      });
    }
    console.log(this.state.participants);
  }

  render() {
    if (this.state.clockService &&
        this.state.currentUser &&
        this.state.timeZones) {
      return (
        <main className='teamClock'>
          <header>
            <h1>What time is it now?</h1>
          </header>
          <a href="# ">Edit My Profile</a>
          <section className='currentTimeContainer'>

            <div className='currentUser'>
              <DigitalClock clockService={this.state.clockService}
                            showPhoto={true}
                            timeZoneObj={this.state.currentUser.timeZoneObj}
                            user={this.state.currentUser}
                            timeFormat={this.state.currentUser.timeFormat}
                            currentUser={true} 
                            addParticipant={ this._addParticipant.bind(this) }
                            participants={this.state.participants} />
            </div>
            <div className="otherTeamMembers">
              <SlideShow slides={this.state.timeZones}
                         clockService={this.state.clockService} 
                         showPhoto={true} 
                         user={this.state.currentUser} 
                         timeFormat={this.state.currentUser.timeFormat}
                         addParticipant={ this._addParticipant.bind(this) }
                         participants={this.state.participants} />
            </div>
          </section>
        </main>
      );
    } else {
      return false;
    }

  }

}
