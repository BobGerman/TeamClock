import React from 'react';
import moment from 'moment';
import './Clock.css';
import TimeStrip from './TimeStrip';
import TimeSelected from './TimeSelected';
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
    if (microsoftTeams) {
      try {
        microsoftTeams.getContext((context, error) => {
          if (context) {
            this.setState({
              context: context
            });  
          }
        });
      }
      catch (ex) { }
    }
  }

  render() {

    // let userName = Object.keys(this.state.context).length > 0 ? this.state.context['upn'] : "";

    const teamMembers = (new TeamService()).getTeamMembers();
    let memberIndex = 0;
    const now = moment();

    return (
      <div className="teamClock">
        <div>
          <div className="personList">
            {teamMembers.map((m) => {
              return <div className="person">
                <p className="personName">{m.name}</p>
                <p className="personCity">{m.city}</p>
              </div>;
            }) }
          </div>
          <div className="scrollingWrapper">
            {teamMembers.map((m) => {
                return <TimeStrip hours={24*7} 
                  startTime={moment(now.utcOffset(m.utcOffset*60))}
                  mouseOverColumn={this.state.mouseOverColumn}
                  selectedColumn={this.state.selectedColumn}
                  onMouseOver={(col) => this.handleMouseOver(col)}
                  onMouseOut={(col) => this.handleMouseOut(col)}
                  onClick={(col) => this.handleClick(col)} 
                  workDays={m.workDays}
                  workHours={m.workHours}
                  isFirst={memberIndex === 0}
                  isLast={memberIndex++ === teamMembers.length} 
                  />;
              }) }
          </div>
        </div>
        <TimeSelected 
                  startTime={moment(now.local())}
                  selectedColumn={this.state.selectedColumn} />
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