import ITimeZone from './ITimeZone';

export default interface IPerson {
    // Fields read from main list
    personLookupId: number;
    timeZone: string;
    workDays: string;
    workHours: string;
    dateFormat: string;
    timeFormat: string;
    // These fields are filled in from the User Information List based
    // on the personLookupId
    firstName: string;
    lastName: string;
    photoUrl: string;
    // This field is a new TimeZone object (see ITimeZone)
    timeZoneObj: ITimeZone;
}
