import React from 'react';
import moment from 'moment';
import './Clock.css';
import TimeStripHeader from './TimeStripHeader';
import TimeStrip from './TimeStrip';
import TimeSelected from './TimeSelected';
import { TIME_STRIP_HOURS } from '../Constants';

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseOverColumn: -1,
      seletedColumn: -1,
      sortOrder: 'name'
    }
  }

  render() {

    const teamMembers = this.props.teamService.getTeamMembers(this.state.sortOrder);
    let memberIndex = 0;
    const now = moment();

    return (
      <div className="teamClock">
        <div>
          <div className="personList">
          <select value={this.state.sortOrder}
           onChange={(e) => {
              this.setState ({ sortOrder: e.target.value }); 
              }}>
            <option value="name">Sort by name</option>
            <option value="time">Sort by time</option>
          </select>
            {teamMembers.map((m) => {
              return <div className="person" key={m.name}>
                <p className="personName">{m.name}</p>
                <p className="personCity">{m.city}<br />
                UTC{m.utcOffset >= 0 ? '+' : ''}{m.utcOffset}</p>
              </div>;
            }) }
          </div>
          <div className="scrollingWrapper">
            <TimeStripHeader hours={TIME_STRIP_HOURS} 
                  mouseOverColumn={this.state.mouseOverColumn}
                  selectedColumn={this.state.selectedColumn}
                  onMouseOver={(col) => this.handleMouseOver(col)}
                  onMouseOut={(col) => this.handleMouseOut(col)}
                  onClick={(col) => this.handleClick(col)} />

            {teamMembers.map((m) => {
                return <TimeStrip hours={TIME_STRIP_HOURS} 
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
                  key={m.name}
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