import React from 'react';
import moment from 'moment';

class TimeSelected extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            context: {}
        }
    }

    render() {

        let selectedTime = moment(this.props.startTime)
            .add(this.props.selectedColumn, 'hours');
        return (
            <div className="timeSelected">
                You have selected {selectedTime.format("dddd, MMMM Do YYYY, h:00 a")} in your local time zone.
            </div>
        );
    }
}

export default TimeSelected;