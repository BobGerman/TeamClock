import React from 'react';
import { ThemePrepared } from "@fluentui/react-northstar";
import * as microsoftTeams from "@microsoft/teams-js";

import TeamClock from '../TeamClock';

import { IConfig, ConfigService } from '../../services/ConfigService/ConfigService';
import ThemeService from '../../services/ThemeService/ThemeService';
import ITeamService from '../../services/TeamService/ITeamService';
import IClockService from '../../services/ClockService/IClockService';
import ServiceFactory from '../../services/ServiceFactory';

/**
 * The web UI to display in the Teams UI
 */
export interface ITabPageProps { }
export interface ITabPageState {
  config?: IConfig;
  teamsContext?: microsoftTeams.Context;
  theme: ThemePrepared;
  teamService?: ITeamService;
  clockService?: IClockService;
}

export default class TabPage extends React.Component<ITabPageProps, ITabPageState> {

  constructor(props: ITabPageProps) {
    super(props);
    this.state = {
      config: undefined,
      teamsContext: undefined,
      theme: ThemeService.getFluentTheme(),
      teamService: undefined,
      clockService: undefined,
    }
  }

  async componentDidMount() {

    // 1. Get tab configuration information
    let { config, teamsContext } = await ConfigService.getContextAndConfig();
    this.setState({
      config: config,
      teamsContext: teamsContext,
      theme: ThemeService.getFluentTheme(teamsContext.theme)
    });

    // 2. Handle theme changes
    ThemeService.registerOnThemeChangeHandler((newTheme) => {
      this.setState({
        theme: newTheme
      });
    });

    // 3. Get team data
    let teamService: ITeamService;
    ServiceFactory.getTeamService()
      .then((service: ITeamService) => {
        teamService = service;
        return ServiceFactory.getClockService();
      })
      .then((clockService: IClockService) => {
        this.setState({
          teamService: teamService,
          clockService: clockService
        });
      });

    // 4. Tell Teams to stop the loading indicator and show the page
    microsoftTeams.appInitialization.notifyAppLoaded();
    microsoftTeams.appInitialization.notifySuccess();   // see http://bit.ly/387PYqO 
  }

  render() {

    if (this.state.clockService && this.state.teamService) {
      return (<TeamClock clockService={this.state.clockService} teamService={this.state.teamService} />);
    } else {
      return false;
    }
  }

}
