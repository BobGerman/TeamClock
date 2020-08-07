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
                // Midnight
                cells.push(
                    <div className="timeCell">
                        <div className="timeHeader newDay">{time.format('dddd')}</div>
                        <div className={this.bodyClass(time)}>{time.format('DD-MMM')}</div>
                    </div>
                );
            } else {
                // Not midnight
                cells.push(
                    <div className="timeCell">
                        <div className="timeHeader">{time.format('dddd')}</div>
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

    bodyClass(m) {

        const bodyClassByHour = [
            'night', 'night', 'night', 'night', 'night', 'night', 'night', 'evening',
            'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day',
            'day', 'day', 'evening', 'evening', 'evening', 'evening', 'evening', 'night'];

        if (m.hours() === 0) {
            return `timeBody ${bodyClassByHour[m.hours()]} newDay`;
        } else {
            return `timeBody ${bodyClassByHour[m.hours()]}`;
        }
    };
}
export default TimeStrip;