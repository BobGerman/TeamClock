import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";
import AuthService from '../services/TeamsAuthService';
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
    // // Get the Teams context and set it in the state
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
        <div>
          <h1>Team clock</h1>
          <Clock teamService={this.state.teamService} />
          <button onClick={this.handleGetProfile.bind(this)}>Get My Profile</button>
          <p>{AuthService.isLoggedIn() ? AuthService.getUsername() : "No username found"}</p>
          <p>{this.state.token ? this.state.token : "No token found"}</p>
        </div>
      );
    } else {
      return null;
    }
  }

  handleGetProfile() {
    // if (AuthService.isLoggedIn()) {
      AuthService.getAccessToken(["User.Read", "Mail.Read"], microsoftTeams)
      .then((token) => {
        this.setState({
          token: token
        })
      })
      .catch((error) => { console.log(error); });
    // } else {
    //   AuthService.login();
    // }
  }

}
export default Tab;