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

        let time = moment(this.props.startDate);
        let hours = this.props.hours;

        const cells = [];

        for (let i = 0; i < hours; i++) {

            if (time.hours() === 0) {
                // First hour - show the date
                cells.push(
                    <div className="timeCell">
                        <div className={this.headingClass(time)}>{time.format('dddd')}</div>
                        <div className={this.bodyClass(time)}>{time.format('DD-MMM')}</div>
                    </div>
                );
            } else {
                // Subsequent hours - show the time
                cells.push(
                    <div className="timeCell">
                        <div className={this.headingClass(time)}>{time.format('dddd')}</div>
                        <div className={this.bodyClass(time)}>{time.format('h a')}</div>
                    </div>
                );
            }
            time.add(1, 'h');

        }

        return (
            <div className="timeStrip">
                {cells}
            </div>
        );
    }

    headingClass(m) {
        if (m.hours() === 0) {  // first hour of the day (midnight)
            return `timeHeader startOfDay`;
        } else if (m.hours() === 23) {  // last hour of the day
            return `timeHeader endOfDay`;
        } else {
            return `timeHeader`;
        }
    }

    bodyClass(m) {

        const bodyClassByHour = [
            'night', 'night', 'night', 'night', 'night', 'night', 'night', 'extended',
            'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day',
            'day', 'day', 'extended', 'extended', 'extended', 'extended', 'extended', 'night'];

        if (m.hours() === 0) {
            return `timeBody ${bodyClassByHour[m.hours()]} startOfDay`;
        } else if (m.hours() === 23) {
            return `timeBody ${bodyClassByHour[m.hours()]} endOfDay`;
        } else {
            return `timeBody ${bodyClassByHour[m.hours()]}`;
        }
    };
}
export default TimeStrip;