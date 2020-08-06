import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TeamClock, { ITeamClockProps } from './TeamClock';

export default class ComponentManager {

    public static renderUI(workspaceDomElement: HTMLElement,
        data: string): void {

        if (workspaceDomElement) {
            const reactElt: React.ReactElement<ITeamClockProps> =
                React.createElement(TeamClock, {
                    message: data
                });
            ReactDOM.render(reactElt, workspaceDomElement);
        }
    }
}