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
      token: null
    }
  }

  componentDidMount() {
    TeamService.factory().then((service) => {
      this.setState({
        teamService: service
      });
    });
  }

  render() {

    if (this.state.teamService) {
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
      return <p>Loading TeamService</p>;
    }

  }

  handleGetProfile() {
    if (AuthService.isLoggedIn()) {
      AuthService.getAccessToken(["User.Read", "Mail.Read"])
      .then((token) => {
        this.setState({
          token: token
        })
      })
      .catch((error) => { console.log(error); });
    } else {
      AuthService.login();
    }
  }
}
export default Web;