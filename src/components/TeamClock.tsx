import * as React from 'react';
require('./TeamClock.css');

export interface ITeamClockProps {
  message: string;
}

export default class GroupTable extends React.Component<ITeamClockProps, {}> {

  public render(): React.ReactElement<ITeamClockProps> {

    return (
      <div>
        <div className="teamClock">
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
        </div>
      </div>
    );
  }
}
