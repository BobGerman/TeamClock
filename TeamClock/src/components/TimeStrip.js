import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";

class TimeStrip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      context: {}
    }
  }

  render() {

    let date = this.props.startDate;
    let days = this.props.days;

    return (
        <div className="timeStrip">
        <div className="timeCell">
            <div className="timeHeader newDay">Monday</div>
            <div className="timeBody day newDay">01 Dec</div>
        </div>
        <div className="timeCell">
            <div className="timeHeader">Monday</div>
            <div className="timeBody evening">1 am</div>
        </div>
        <div className="timeCell">
            <div className="timeHeader">Monday</div>
            <div className="timeBody night">2 am</div>
        </div>
        </div>
    );
  }
}
export default TimeStrip;