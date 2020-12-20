import TeamServiceReal from './TeamServiceReal';
import TeamServiceMock from './TeamServiceMock';
import IUser from '../model/IUser';

export interface ITeamService {
    getCurrentUser: (format: string) => Promise<IUser>;
    getOtherTeamMembers: (currentUser: IUser) => Promise<IUser[]>;
    getTeamMembers: (sortOrder: string) => Promise<IUser[]>;
}

export class TeamService {

    static async factory(): Promise<ITeamService> {
        let service = null;
        if (process.env.REACT_APP_MOCK) {
            service = await TeamServiceMock.factory();
       } else {
            service = await TeamServiceReal.factory();
        }
        return service;
    }


}