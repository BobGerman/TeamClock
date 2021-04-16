import React from 'react';
import ITeamService from '../services/TeamService/ITeamService';
import * as microsoftTeams from "@microsoft/teams-js";

export interface IEditProfileProps {
    teamService: ITeamService;
}

export default class EditProfile extends React.Component<IEditProfileProps> {

    public componentDidMount() {
        if (microsoftTeams) {
            microsoftTeams.initialize();
        }
    }

    public render() {
        return <div>
            <button onClick={this.launchEditor.bind(this)}>Edit My Profile</button>
        </div>;
    }

    private launchEditor(event: React.MouseEvent<HTMLButtonElement>) {
        const url = this.props.teamService.getEditUrl();
        if (microsoftTeams) {
            const taskModuleInfo = {
                title: "Editor",
                url: url,
                // Show it as large as Teams will allow
                width: Number.MAX_VALUE,
                height: Number.MAX_VALUE
            };
            microsoftTeams.tasks.startTask(taskModuleInfo,
                (() => { this.refresh(); }));
        }
    }

    private refresh() {
        // this.props.refresh();
    }

}