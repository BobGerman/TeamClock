import React from 'react';
import multiPhoto from '../common/img/Group.svg';
import noPhoto from '../common/img/Contact.svg';
import add from '../common/img/Add.svg';
import IClockService from '../services/ClockService/IClockService';
import ITimeZone from '../model/ITimeZone';
import IUser from '../model/IUser';

export interface IDigitalClockProps {
  clockService: IClockService;
  user: IUser;
  currentUser: boolean;
  showPhoto: boolean;
  timeFormat: string;
  timeZoneObj: ITimeZone;
  addParticipant: (participant: IUser) => void;
  participants: IUser[];
};
export interface IDigitalClockState {
  time: string;
  intervalID: number;
  participants: IUser[];
};


class DigitalClock extends React.Component<IDigitalClockProps, IDigitalClockState> {
  constructor(props: IDigitalClockProps) {
    super(props);
    this.state = {
      time: this.props.clockService.getCurrentTime(new Date(), this.props.timeFormat, this.props.timeZoneObj.timeZone),
      intervalID: 0,
      participants: this.props.participants
    };
  }

  componentDidMount() {
    var intervalID: number = window.setInterval(
      () => this.tick(),
      1000
    );
    this.setState({
      intervalID: intervalID
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalID);
  }

  tick() {
    this.setState({
      time: this.props.clockService.getCurrentTime(new Date(), this.props.timeFormat, this.props.timeZoneObj.timeZone)
    });
  }

  //Render the timezone abbreviation and the offset from the current user
  _renderHeader() {
    let header;
    if (this.props.timeZoneObj) {
      //The data coming back from Moment doesn't have a leading + for timezones ahead of the current
      //We also want to remove the 0 for users in the current time zone
      let offset = this.props.timeZoneObj.offset.toString();
      if (offset === "0") {
        offset = "";
      } else if ((!offset.startsWith("-")) && (!offset.startsWith("+"))) {
        offset = "+" + offset
      }
      header = <div>{this.props.timeZoneObj.abbreviation} {offset} hrs </div>;
    }
    if (this.props.currentUser) {
      header = <div>Current Time</div>;
    }

    return header;
  }

  //Render the photo of the current user. If the user doesn't have a photo use the generic image.
  _renderPhoto() {
    let photoUrl = "";
    let altText = "";
    let photo;
    let multi = "";

    if (this.props.showPhoto) {
      if (this.props.timeZoneObj?.members.length === 1) {
        //If there is only one person then show their picture
        photoUrl = this.props.timeZoneObj.members[0].photoUrl;
        altText = this.props.timeZoneObj.members[0].firstName;
      } else if (this.props.timeZoneObj.members.length > 1) {
        //If there is more than one person show a generic multi image
        photoUrl = multiPhoto;
        altText = "multiple users";
        multi = " multi";
      } else {
        //Else show the generic no photo icon
        photoUrl = noPhoto;
        altText = "No Photo";
      }
      photo = <div className={`photo` + multi}><img src={photoUrl} alt={altText} /></div>;
    }
    return photo;
  }

  _isNextDay() {
    const isNextDay = this.props.clockService.isNextDay(this.props.timeZoneObj.timeZone);
    let nextDaySpan;

    if (isNextDay) {
      nextDaySpan = <span className='nextDay'>Next Day</span>;
    }
    return nextDaySpan;
  }

  _addParticipant(participant: IUser) {
    this.props.addParticipant(participant);
  }

  _renderAddButton(participant: IUser) {
    let addButton;
    if (!this.props.participants.includes(participant)) {
      addButton = React.createElement('img', { className: 'addButton', src: add }, null)
    }
    return addButton
  }
  _renderPeople() {
    let person = [];
    if (this.props.timeZoneObj.members.length === 1) {
      person.push(React.createElement('span', { onClick: () => this._addParticipant(this.props.timeZoneObj.members[0]) }, [this.props.timeZoneObj.members[0].firstName, this._renderAddButton(this.props.timeZoneObj.members[0])]));
    } else {
      this.props.timeZoneObj.members.map((m, index) => {

        person.push(React.createElement('span', { onClick: () => this._addParticipant(m) }, [m.firstName, this._renderAddButton(m)]));

        return null;
      });
    }
    let personContainer = React.createElement('div', { className: 'personName' }, person);
    //<div className='personName' dangerouslySetInnerHTML={{ __html: this._renderPeople() }} ></div>

    return personContainer
  }

  render() {
    return (
      <div className="clock">
        {this._renderHeader()}
        {this._renderPhoto()}
        <div>{this.state.time} {this._isNextDay()}</div>
        {this._renderPeople()}
      </div>
    );
  }
}

export default DigitalClock;