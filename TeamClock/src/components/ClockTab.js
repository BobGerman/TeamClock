import React from 'react';
import './ClockTab.css';
import TimeStrip from './TimeStrip';
import * as microsoftTeams from "@microsoft/teams-js";

class ClockTab extends React.Component {
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

    const now = new Date();
    const aycaTime = new Date().getTime() + (6 * 60 * 60 * 1000);
    const barnamTime = new Date().getTime() + (14 * 60 * 60 * 1000);
    const bobTime = new Date().getTime() + (-4 * 60 * 60 * 1000);
    const toddTime = new Date().getTime() + (-5 * 60 * 60 * 1000);
    return (
      <div>
        <div className="teamClock">
          <div className="personList">
            <div className="person">Ayca</div>
            <div className="person">Barnam</div>
            <div className="person">Bob</div>
            <div className="person">Todd</div>
          </div>
          <div className="scrollingWrapper">
            <TimeStrip hours="24" startDate={aycaTime} />
            <TimeStrip hours="24" startDate={barnamTime} />
            <TimeStrip hours="24" startDate={bobTime} />
            <TimeStrip hours="24" startDate={toddTime} />
          </div>
        </div>
      </div>
    );
  }
}
export default ClockTab;