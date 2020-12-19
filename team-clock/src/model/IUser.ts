import ITimeZone from './ITimeZone';

export default interface IUser {
    firstName: string;
    lastName: string;
    timeZone: string;
    photoUrl: string;
    workDays: string;
    workHours: string;
    timeFormat: string;
    timeZoneObj: ITimeZone | null;
}