import IUser from '../../model/IUser';

export default interface ITeamService {
    getCurrentUser: (format: string) => Promise<IUser>;
    getOtherTeamMembers: (currentUser: IUser) => Promise<IUser[]>;
    getTeamMembers: (sortOrder: string) => Promise<IUser[]>;
}
