import IUser from '../../model/IUser';
import IClockService from '../ClockService/IClockService';
import MSGraphService from '../MSGraphService/MSGraphService';

export interface ITeamServiceProps {
    clockService: IClockService;
    graphService: MSGraphService;
    spSiteUrl: string;
    spListName: string;
}

export default interface ITeamService {
    getCurrentUser: (format: string) => Promise<IUser>;
    getOtherTeamMembers: (currentUser: IUser) => Promise<IUser[]>;
    getTeamMembers: (sortOrder: string) => Promise<IUser[]>;
}
