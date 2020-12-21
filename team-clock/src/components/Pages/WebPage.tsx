import React from 'react';
import ITeamService from '../../services/TeamService/ITeamService';
import IClockService from '../../services/ClockService/IClockService';
import ServiceFactory from '../../services/ServiceFactory';

import TeamClock from '../TeamClock';

export interface IWebProps { };
export interface IWebState {
  teamService?: ITeamService;
  clockService?: IClockService;
};

/**
 * The web UI used when Teams pops out a browser window
 */
export default class WebPage extends React.Component<IWebProps, IWebState> {
  constructor(props: IWebProps) {
    super(props);
    this.state = {
      teamService: undefined,
      clockService: undefined,
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
        this.setState({
          teamService: teamService,
          clockService: clockService
        });
      });
    }

  render() {

        if(this.state.clockService && this.state.teamService) {
      return (<TeamClock clockService={this.state.clockService} teamService={this.state.teamService} />);
    } else {
      return false;
    }

  }

}
