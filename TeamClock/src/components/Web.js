import React from 'react';
import TeamService from '../services/TeamService';

import Clock from './Clock';
import AuthService from '../services/AuthService'

/**
 * The web UI used when Teams pops out a browser window
 */
class Web extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamService: null,
      username: AuthService.userName,
      token: null
    }
  }

  componentDidMount() {

    TeamService.factory().then((service) => {
      this.setState({
        teamService: service
      });
    });
    if (AuthService && AuthService.userName) {
      this.setState({
        username: AuthService.userName
      });
    }
  }

  render() {

    if (this.state.teamService) {
      return (
        <div>
          <h1>Team clock</h1>
          <Clock teamService={this.state.teamService} />
          <button onClick={this.handleGetProfile.bind(this)}>Get My Profile</button>
          <p>{this.state.username ? this.state.username : "No username found"}</p>
          <p>{this.state.officeLocation ? this.state.officeLocation : "No office location found"}</p>
        </div>
      );
    } else {
      return false;
    }

  }

  handleGetProfile() {
    if (AuthService.userName) {
      AuthService.getAccessToken(["User.Read", "Files.Read"])
      .then((token) => {
        this.setState({
          officeLocation: token
        })
      })
      .catch((error) => { console.log(error); });
    } else {
      AuthService.login();
    }
  }
}
export default Web;