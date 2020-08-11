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

            if (currentMoment.hours() === 0) {
                // First hour - show the date
                cells.push(
                    <div className={this.cellClass(currentMoment, i)}
                         onMouseOver={() => { this.props.onMouseOver(i)}}
                         onMouseOut={() => { this.props.onMouseOut(i)}}
                         onClick={() => { this.props.onClick(i)}}
                         key={i}
                         >
                        <div className={this.headingClass(currentMoment)}>{currentMoment.format('MMMM')}</div>
                        <div className={this.bodyClass(currentMoment)}>{currentMoment.format('DD')}</div>
                    </div>
                );
            } else {
                // Subsequent hours - show the time
                cells.push(
                    <div className={this.cellClass(currentMoment, i)}
                         onMouseOver={() => { this.props.onMouseOver(i)}}
                         onMouseOut={() => { this.props.onMouseOut(i)}}
                         onClick={() => { this.props.onClick(i)}}
                         key={i}
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

    cellClass(currentMoment, i) {
        let result = "timeCell";
        if (i === this.props.selectedColumn) result += " selected";
        if (i === this.props.mouseOverColumn) result += " mouseOver";
        if (this.props.isFirst) result += " first";
        if (this.props.isLast) result += " last";
        if (currentMoment.hours() === 0) result += " startOfDay";
        if (currentMoment.hours() === 23) result += " endOfDay";
        return result;
    }

    headingClass(currentMoment) {
        let result = "timeHeader";
        if (currentMoment.hours() === 0) result += " startOfDay";
        if (currentMoment.hours() === 23) result += " endOfDay";
        return result;
    }

    bodyClass(currentMoment) {

        let dayCode, hourCode;

        try {
            dayCode = this.props.workDays.substr(currentMoment.days(),1).toLowerCase();
            hourCode = this.props.workHours.substr(currentMoment.hours(),1).toLowerCase();
        }
        catch { }

        let result = "timeBody";

        if (dayCode === 'o' || hourCode === 'n') result += " night";
        if (dayCode === 'w' && hourCode === 'e') result += " extended";
        if (dayCode === 'w' && hourCode === 'd') result += " day";
        if (currentMoment.hours() === 0) result += " startOfDay";
        if (currentMoment.hours() === 23) result += " endOfDay";

        return result;
    };
}
export default TimeStrip;