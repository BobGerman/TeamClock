import noPhoto from '../../common/img/PersonPlaceholder.96x96x32.png'
import IClockService from '../ClockService/IClockService';
import IPerson from '../../model/IPerson';
import ITeamService  from './ITeamService';

export default class TeamServiceMock implements ITeamService {

    constructor (private clockService: IClockService) { };

    public async getCurrentUser(format: string) {

        const currentUser: IPerson = {
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
            timeZoneObj: this.clockService.getDefaultTimeZone()
        }
        if (currentUser.photoUrl === "") {
            currentUser.photoUrl = noPhoto;
        }
        let members = [];
        members.push(currentUser);
        currentUser.timeZoneObj = this.clockService.getTimeZones(members)[0];
        return currentUser;
    };

    public async getOtherTeamMembers(currentUser: IPerson) {
        const allTeamMembers = await this.getTeamMembers('time');
        let otherTeamMembers: IPerson[] = [];

        // Remove the current User
        // Need a better way of doing this
        allTeamMembers.forEach((m) => {
            if (m.firstName !== currentUser.firstName && m.lastName !== currentUser.lastName) {
                otherTeamMembers.push(m);
            }
        });

        return otherTeamMembers;
    }

    public async getTeamMembers(sortOrder: string): Promise<IPerson[]> {

        let mockMembers: IPerson[] = [
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
                timeZoneObj: this.clockService.getDefaultTimeZone()
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
                timeZoneObj: this.clockService.getDefaultTimeZone()
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
                timeZoneObj: this.clockService.getDefaultTimeZone()
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
                timeZoneObj: this.clockService.getDefaultTimeZone()
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
                timeZoneObj: this.clockService.getDefaultTimeZone()
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
                timeZoneObj: this.clockService.getDefaultTimeZone()
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
                timeZoneObj: this.clockService.getDefaultTimeZone()
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
                timeZoneObj: this.clockService.getDefaultTimeZone()
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
                timeZoneObj: this.clockService.getDefaultTimeZone()
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
                timeZoneObj: this.clockService.getDefaultTimeZone()
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
                timeZoneObj: this.clockService.getDefaultTimeZone()
            },
        ];
        mockMembers.forEach((m) => {
            m.photoUrl = m.photoUrl || noPhoto;
            m.timeZoneObj = this.clockService.getTimeZones([m])[0];
        });

        return mockMembers;
    }
}