import React from 'react';
import moment from 'moment';

class TimeStrip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            context: {}
        }
    }

    render() {

        let currentMoment = moment(this.props.startTime);
        let hours = this.props.hours;

        const cells = [];

        for (let i = 0; i < hours; i++) {

            let cellStyle = "timeCell";
            if (i === this.props.selectedColumn) {
                cellStyle += " selected";
                if (this.props.isFirst) cellStyle += " first";
                if (this.props.isLast) cellStyle += " last";
            } else if (i === this.props.mouseOverColumn) {
                cellStyle += " mouseOver";
                if (this.props.isFirst) cellStyle += " first";
                if (this.props.isLast) cellStyle += " last";
            }

            if (currentMoment.hours() === 0) {
                // First hour - show the date
                cells.push(
                    <div className={cellStyle}
                         onMouseOver={() => { this.props.onMouseOver(i)}}
                         onMouseOut={() => { this.props.onMouseOut(i)}}
                         onClick={() => { this.props.onClick(i)}}
                         >
                        <div className={this.headingClass(currentMoment)}>{currentMoment.format('MMMM')}</div>
                        <div className={this.bodyClass(currentMoment)}>{currentMoment.format('DD')}</div>
                    </div>
                );
            } else {
                // Subsequent hours - show the time
                cells.push(
                    <div className={cellStyle}
                         onMouseOver={() => { this.props.onMouseOver(i)}}
                         onMouseOut={() => { this.props.onMouseOut(i)}}
                         onClick={() => { this.props.onClick(i)}}
                         >
                        <div className={this.headingClass(currentMoment)}>{currentMoment.format('dddd')}</div>
                        <div className={this.bodyClass(currentMoment)}>{currentMoment.format('h a')}</div>
                    </div>
                );
            }
            currentMoment.add(1, 'h');

        }

        return (
            <div className="timeStrip">
                {cells}
            </div>
        );
    }

    headingClass(currentMoment) {
        if (currentMoment.hours() === 0) {  // first hour of the day (midnight)
            return `timeHeader startOfDay`;
        } else if (currentMoment.hours() === 23) {  // last hour of the day
            return `timeHeader endOfDay`;
        } else {
            return `timeHeader`;
        }
    }

    bodyClass(currentMoment) {

        const dayCode = this.props.workDays.substr(currentMoment.days(),1).toLowerCase();
        const hourCode = this.props.workHours.substr(currentMoment.hours(),1).toLowerCase();

        let bodyClass = 'night';
        if (dayCode === 'w' && hourCode !== 'n') {
            bodyClass = hourCode === 'd' ? 'day' : 'extended';
        }

        if (currentMoment.hours() === 0) {
            return `timeBody ${bodyClass} startOfDay`;
        } else if (currentMoment.hours() === 23) {
            return `timeBody ${bodyClass} endOfDay`;
        } else {
            return `timeBody ${bodyClass}`;
        }
    };
}
export default TimeStrip;