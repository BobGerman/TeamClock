import React from 'react';
import multiPhoto from '../common/img/Group.svg';
import noPhoto from '../common/img/Contact.svg'
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
};
export interface IDigitalClockState {
  time: string;
  intervalID: number;
};


class DigitalClock extends React.Component<IDigitalClockProps, IDigitalClockState> {
  constructor(props: IDigitalClockProps) {
    super(props);
    this.state = {
      time: this.props.clockService.getCurrentTime(this.props.timeFormat, this.props.timeZoneObj.timeZone),
      intervalID: 0
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
      time: this.props.clockService.getCurrentTime(this.props.timeFormat, this.props.timeZoneObj.timeZone)
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
      header = <div>My Current Time</div>;
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

  _renderPeople() {
    let names = "";

    if (this.props.timeZoneObj.members.length === 1) {
      names = this.props.timeZoneObj.members[0].firstName + " + ";
    } else {
      this.props.timeZoneObj.members.map((m, index) => {
        if (index > 0) {
          names = names + "</br>" + m.firstName + " + ";
        } else {
          names = m.firstName + " + ";
        }
        return names;
      });
    }

    return names
  }

  render() {
    return (
      <div className="clock">
        {this._renderHeader()}
        {this._renderPhoto()}
        <div>{this.state.time} {this._isNextDay()}</div>
        <div className='personName' dangerouslySetInnerHTML={{ __html: this._renderPeople() }} ></div>
      </div>
    );
  }
}

export default DigitalClock;