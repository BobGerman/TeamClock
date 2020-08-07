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

    return (
      <div>
        <div className="teamClock">
          <TimeStrip days="7" startDate={Date.now()} />
        </div>
      </div>
    );
  }
}
export default ClockTab;