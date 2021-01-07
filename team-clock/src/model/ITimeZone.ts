import IPerson from './IPerson';

export default interface ITimeZone {
    timeZone: string;
    abbreviation: string;
    offset: number;
    members: IPerson[];
}