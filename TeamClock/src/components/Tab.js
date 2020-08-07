import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";

class Tab extends React.Component {
  constructor(props) {
    super(props)
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
          <div className="timeStrip">
            <div className="timeCell">
              <div className="timeHeader newDay">Monday</div>
              <div className="timeBody day newDay">01 Dec</div>
            </div>
            <div className="timeCell">
              <div className="timeHeader">Monday</div>
              <div className="timeBody evening">1 am</div>
            </div>
            <div className="timeCell">
              <div className="timeHeader">Monday</div>
              <div className="timeBody night">2 am</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Tab;