import React from 'react';
import moment from 'moment';
import './Clock.css';
import TimeStrip from './TimeStrip';
import * as microsoftTeams from "@microsoft/teams-js";
import TeamService from '../services/TeamService';

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      context: {},
      mouseOverColumn: -1,
      seletedColumn: -1,
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
    let memberIndex = 0;
    const now = moment();

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
                return <TimeStrip hours="24" 
                  startDate={moment(now.utcOffset(m.utcOffset*60))}
                  mouseOverColumn={this.state.mouseOverColumn}
                  selectedColumn={this.state.selectedColumn}
                  onMouseOver={(col) => this.handleMouseOver(col)}
                  onMouseOut={(col) => this.handleMouseOut(col)}
                  onClick={(col) => this.handleClick(col)} 
                  isFirst={memberIndex === 0}
                  isLast={memberIndex++ === teamMembers.length} 
                  />;
              }) }
          </div>
        </div>
      </div>
    );
  }

  handleMouseOver(col) {
    this.setState({
      mouseOverColumn: col
    })
  }

  handleMouseOut(col) {
    if (this.state.mouseOverColumn === col) {
      this.setState({
        mouseOverColumn: -1
      })
    }
  }

  handleClick(col) {
    this.setState({
      mouseOverColumn: -1,
      selectedColumn: col
    })
  }


}
export default Clock;