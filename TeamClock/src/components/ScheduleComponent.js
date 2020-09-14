import React from 'react';

class ScheduleComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }
  componentWillUnmount() {

  }


  render() {
    return (
      <div className="scheduleComponent">
        <h2>Scheduling</h2>
        <div className="datePicker"></div>
        <div className="schedules">
          <div className="schedule">

          </div>
        </div>

      </div>
    );
  }
}

export default ScheduleComponent;