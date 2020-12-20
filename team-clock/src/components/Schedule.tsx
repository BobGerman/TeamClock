import React from 'react';

export interface IScheduleProps {

}

class Schedule extends React.Component<IScheduleProps> {
  constructor(props: IScheduleProps) {
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

export default Schedule;