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
        if (this.props.selectedColumn >= 0) {
            return (
                <div className="timeSelected">
                    You have selected {selectedTime.format("h:00 a on dddd, MMMM Do YYYY")} in your local time zone.
                </div>
            );    
        } else {
            return (<div />);
        }
    }
}

export default TimeSelected;