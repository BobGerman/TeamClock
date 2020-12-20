import ITimeZone from '../../model/ITimeZone';
import IUser from '../../model/IUser';

export default interface IClockService {

    getCurrentTime: (format: string, timezone: string) =>
        string;
    isNextDay: (timezone:string) => boolean;
    getTimeZones: (teamMembers: IUser[]) => ITimeZone[];

}