import * as React from 'react';
require ('./TeamClock.css');

export interface ITeamClockProps {
  message: string;
}

export default class GroupTable extends React.Component<ITeamClockProps, {}> {
  
  public render(): React.ReactElement<ITeamClockProps> {

    return (
      <div>{this.props.message}</div>
      );
  }
}
