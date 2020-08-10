import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";
import TeamService from '../services/TeamService';

import Clock from './Clock';

/**
 * The tab UI used when running in Teams
 */
class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      context: {},
      teamService: null
    }
  }

  componentDidMount() {
    // Get the Teams context and set it in the state
    if (microsoftTeams) {
      microsoftTeams.getContext((context, error) => {
        if (context) {
          this.setState({
            context: context
          });
        }
      });
    }
    // Get the Team Service and set it in the state
    TeamService.factory().then((service) => {
      this.setState({
        teamService: service
      });  
    });
  }

  render() {

    if (this.state.context && this.state.teamService) {
    // let userName = Object.keys(this.state.context).length > 0 ? this.state.context['upn'] : "";
    return (
      <Clock teamService={this.state.teamService} />
    );
    } else {
      return null;
    }

  }

}
export default Tab;