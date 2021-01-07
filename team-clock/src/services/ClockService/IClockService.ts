import moment from 'moment-timezone';
import ITimeZone from '../../model/ITimeZone';
import IPerson from '../../model/IPerson';

export default interface IClockService {

    getCurrentTime: (date: Date, format: string, timezone: string) =>
        string;
    getMeetingHours: (date: Date, format: string, timezone: string, numberofHours: number) =>
        string[];
    isNextDay: (timezone: string) => boolean;
    getTimeZones: (teamMembers: IPerson[]) => ITimeZone[];
    convertTimeZone: (originalTime: Date, convertToTimeZone: string) => moment.Moment;
    isLeapYear: (date: Date) => boolean;
}