import React from 'react';
import ITeamService from '../services/TeamService/ITeamService';

export interface IEditProfileProps {
    teamService: ITeamService;
}

export default class EditProfile extends React.Component<IEditProfileProps> {

    public render() {
        const editUrl = this.props.teamService.getEditUrl();

        return <div>
            <a href={editUrl} target="_blank">Edit My Profile</a>
        </div>;
    }

}