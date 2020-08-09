import React from 'react';
import './Clock.css';
import TimeStrip from './TimeStrip';
import * as microsoftTeams from "@microsoft/teams-js";
import TeamService from '../services/TeamService';

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      context: {}
    }
  }

  componentDidMount() {
    // Get the user context from Teams and set it in the state
    microsoftTeams.getContext((context, error) => {
      this.setState({
        context: context
      });
    });
    // Next steps: Error handling using the error object
  }

  render() {

    // let userName = Object.keys(this.state.context).length > 0 ? this.state.context['upn'] : "";

    const teamMembers = (new TeamService()).getTeamMembers();

    return (
      <div>
        <div className="teamClock">
          <div className="personList">
            {teamMembers.map((m) => {
              return <div className="person">{m.name}</div>;
            }) }
          </div>
          <div className="scrollingWrapper">
            {teamMembers.map((m) => {
                const t = new Date().getTime() + (m.utcOffset * 60 * 60 * 1000);
                return <TimeStrip hours="24" startDate={t} />;
              }) }
          </div>
        </div>
      </div>
    );
  }
}
export default Clock;