import IUser from './IUser';

export default interface ITimeZone {
    timeZone: string;
    abbreviation: string;
    offset: number;
    members: IUser[];
}