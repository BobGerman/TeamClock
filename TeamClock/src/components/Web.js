import React from 'react';
import TeamService from '../services/TeamService';

import Clock from './Clock';

/**
 * The web UI used when Teams pops out a browser window
 */
class Web extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamService: null
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
        </div>
      );
    } else {
      return false;
    }

  }

}
export default Web;