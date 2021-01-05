import noPhoto from '../../common/img/PersonPlaceholder.96x96x32.png'
import IClockService from '../ClockService/IClockService';
import IUser from '../../model/IUser';
import ITimeZone from '../../model/ITimeZone';
import ITeamService  from './ITeamService';

export default class TeamServiceReal implements ITeamService {

    constructor (private clockService: IClockService) { };

    public async init(): Promise<void> {
        return Promise.resolve();
    }

    public async getCurrentUser(format: string) {

        const currentUser: IUser = {
            firstName: "Real",
            lastName: "Service",
            timeZone: "America/New_York",
            /* Preferred work week, 1 char/day, o=off, w=work */
            workDays: 'owwwwwo',
            /* Preferred work day, 1 char/hour, n=night, e=extended, d=day */
            workHours: 'nnnnnnneedddddddddeeeeen',
            photoUrl: "",
            dateFormat: "MM/dd/yyyy",
            timeFormat: "h:mm a",
            timeZoneObj: this.getDefaultTimeZone()
        }
        if (currentUser.photoUrl === "") {
            currentUser.photoUrl = noPhoto;
        }
        let members = [];
        members.push(currentUser);
        currentUser.timeZoneObj = this.clockService.getTimeZones(members)[0];
        return currentUser;
    };

    public async getOtherTeamMembers(currentUser: IUser) {
        const allTeamMembers = await this.getTeamMembers('time');
        let otherTeamMembers: IUser[] = [];

        // Remove the current User
        // Need a better way of doing this
        allTeamMembers.forEach((m) => {
            if (m.firstName !== currentUser.firstName && m.lastName !== currentUser.lastName) {
                otherTeamMembers.push(m);
            }
        });

        return otherTeamMembers;
    }

    public async getTeamMembers(sortOrder: string): Promise<IUser[]> {

        let mockMembers: IUser[] = [
            {
                firstName: "Derek",
                lastName: "Cash-Peterson",
                timeZone: "America/New_York",
                /* Preferred work week, 1 char/day, o=off, w=work */
                workDays: 'owwwwwo',
                /* Preferred work day, 1 char/hour, n=night, e=extended, d=day */
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                dateFormat: "MM/dd/yyyy",
                timeFormat: "h:mm a",
                timeZoneObj: this.getDefaultTimeZone()
            },
            {
                firstName: "Ayca",
                lastName: "",
                timeZone: "Asia/Dubai",
                /* Preferred work week, 1 char/day, o=off, w=work */
                workDays: 'owwwwwo',
                /* Preferred work day, 1 char/hour, n=night, e=extended, d=day */
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                dateFormat: "MM/dd/yyyy",
                timeFormat: "h:mm a",
                timeZoneObj: this.getDefaultTimeZone()
            },
            {
                firstName: "Barnam",
                lastName: "",
                timeZone: "Australia/Melbourne",
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                dateFormat: "MM/dd/yyyy",
                timeFormat: "h:mm a",
                timeZoneObj: this.getDefaultTimeZone()
            },
            {
                firstName: "Bob",
                lastName: "German",
                timeZone: "America/New_York",
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                dateFormat: "MM/dd/yyyy",
                timeFormat: "h:mm a",
                timeZoneObj: this.getDefaultTimeZone()
            },
            {
                firstName: "Dan",
                lastName: "",
                timeZone: "America/Phoenix",
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                dateFormat: "MM/dd/yyyy",
                timeFormat: "h:mm a",
                timeZoneObj: this.getDefaultTimeZone()
            },
            {
                firstName: "Emily",
                lastName: "",
                timeZone: "America/Los_Angeles",
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                dateFormat: "MM/dd/yyyy",
                timeFormat: "h:mm a",
                timeZoneObj: this.getDefaultTimeZone()
            },
            {
                firstName: "Matt",
                lastName: "",
                timeZone: "America/Los_Angeles",
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                dateFormat: "MM/dd/yyyy",
                timeFormat: "h:mm a",
                timeZoneObj: this.getDefaultTimeZone()
            },
            {
                firstName: "Rabia",
                lastName: "",
                timeZone: "Australia/Brisbane",
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                dateFormat: "MM/dd/yyyy",
                timeFormat: "h:mm a",
                timeZoneObj: this.getDefaultTimeZone()
            },
            {
                firstName: "Todd",
                lastName: "",
                timeZone: "America/Chicago",
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                dateFormat: "MM/dd/yyyy",
                timeFormat: "h:mm a",
                timeZoneObj: this.getDefaultTimeZone()
            },
            {
                firstName: "Tomomi",
                lastName: "",
                timeZone: "America/Los_Angeles",
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                dateFormat: "MM/dd/yyyy",
                timeFormat: "h:mm a",
                timeZoneObj: this.getDefaultTimeZone()
            },
            {
                firstName: "Waldek",
                lastName: "",
                timeZone: "Europe/Amsterdam",
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                photoUrl: "",
                dateFormat: "MM/dd/yyyy",
                timeFormat: "h:mm a",
                timeZoneObj: this.getDefaultTimeZone()
            },
        ];
        mockMembers.forEach((m) => {
            m.photoUrl = m.photoUrl || noPhoto;
            m.timeZoneObj = this.clockService.getTimeZones([m])[0];
        });

        return mockMembers;
    }

    private getDefaultTimeZone(): ITimeZone {
        return {
            timeZone: "Etc/UTC",
            abbreviation: "UTC",
            offset: 0,
            members: []
        };
    }

}