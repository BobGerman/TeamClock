import ITimeZone from './ITimeZone';

export default interface IPerson {
    firstName: string;
    lastName: string;
    timeZone: string;
    photoUrl: string;
    workDays: string;
    workHours: string;
    dateFormat: string;
    timeFormat: string;
    timeZoneObj: ITimeZone;
}
