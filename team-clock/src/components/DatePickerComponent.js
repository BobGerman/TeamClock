import React from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class DatePickerComponent extends React.Component {
  constructor(props) {
    super(props);
    this._setDate = this._setDate.bind(this);
    this._addParticipant = this._addParticipant.bind(this);
    let now = new Date()
    this.state = {
      date: now//moment(now, null).format('M')
    }

  }

  componentDidMount() {
  }

  _addParticipant(participant, date) {
    this.props.addParticipant(participant, date);
  }

  _setDate(date) {
    //Add the current user
    //Reset the start time for the selected time
    this.setState({
      date: date
    })

    //if (this.props.participants.length === 0) {
    this._addParticipant(this.props.currentUser, date);
    //}

  }






  render() {
    return (
      <div className="datePicker">
        Select a meeting date: <DatePicker className='calendar' selected={this.state.date} onChange={this._setDate} dateFormat={this.props.currentUser.dateFormat} timeFormat={this.props.currentUser.timeFormat} showTimeSelect />
      </div>
    );
  }
}

export default DatePickerComponent;