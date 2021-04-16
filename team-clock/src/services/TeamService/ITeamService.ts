import IPerson from '../../model/IPerson';
import IClockService from '../ClockService/IClockService';
import MSGraphService from '../MSGraphService/MSGraphService';

export interface ITeamServiceProps {
    clockService: IClockService;
    graphService: MSGraphService;
    spSiteUrl: string;
    spListName: string;
}

export default interface ITeamService {
    getEditUrl: () => string;
    getCurrentUser: (format: string) => Promise<IPerson>;
    getOtherTeamMembers: (currentUser: IPerson) => Promise<IPerson[]>;
}
