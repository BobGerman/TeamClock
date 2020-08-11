import React from 'react';

class TimeStripHeader extends React.Component {

    render() {

        let hours = this.props.hours;

        const cells = [];
        let isFirst = true;

        for (let i = 0; i < hours; i++) {

            let cellStyle = "timeStripHeaderCell";
            let cellContent = "";
            if (isFirst) {
                cellStyle += "  now";
                cellContent = "NOW";
                isFirst = false;
            }

            cells.push(
                <div className={cellStyle}
                    onMouseOver={() => { this.props.onMouseOver(i) }}
                    onMouseOut={() => { this.props.onMouseOut(i) }}
                    onClick={() => { this.props.onClick(i) }}
                    key={i}
                >
                    {cellContent}
                </div>
            );
        }

        return (
            <div className="timeStripHeader">
                {cells}
            </div>
        );

    };
}
export default TimeStripHeader;