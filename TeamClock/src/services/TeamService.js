import noPhoto from '../common/img/PersonPlaceholder.96x96x32.png'
import ClockService from './ClockService';

export default class TeamService {

    static async factory() {
        const service = new TeamService();
        return Promise.resolve(service); //((resolve) => { resolve(service); });
    }

    async getCurrentUser(format) {

        const currentUser = {
            firstName: "Derek",
            lastName: "Cash-Peterson",
            timeZone: "America/New_York",
            photoUrl: "",
            timeFormat: "LTS"

        }
        if (currentUser.photoUrl === "") {
            currentUser.photoUrl = noPhoto;
        }
        let clockService = await ClockService.factory();
        let members = [];
        members.push(currentUser);
        currentUser.timeZoneObj = clockService.getTimeZones(members)[0];
        return currentUser;
    };

    async getOtherTeamMembers(currentUser) {
        const allTeamMembers = await this.getTeamMembers('time');
        let otherTeamMembers = [];

        // Remove the current User
        // Need a better way of doing this
        allTeamMembers.forEach((m) => {
            if (m.firstName !== currentUser.firstName && m.lastName !== currentUser.lastName) {
                otherTeamMembers.push(m);
            }
        });

        return otherTeamMembers;
    }

    async getTeamMembers(sortOrder) {

        let result = [
            {
                name: 'Derek',
                city: 'Boston',
                utcOffset: 4,
                /* Preferred work week, 1 char/day, o=off, w=work */
                workDays: 'owwwwwo',
                /* Preferred work day, 1 char/hour, n=night, e=extended, d=day */
                workHours: 'nnnnnnneedddddddddeeeeen',
                firstName: "Derek",
                lastName: "Cash-Peterson",
                timeZone: "America/New_York",
                photoUrl: "",
                timeFormat: "h:mm:ss a"
            },
            {
                name: 'Ayca',
                city: 'Dubai',
                utcOffset: 4,
                /* Preferred work week, 1 char/day, o=off, w=work */
                workDays: 'owwwwwo',
                /* Preferred work day, 1 char/hour, n=night, e=extended, d=day */
                workHours: 'nnnnnnneedddddddddeeeeen',
                firstName: "Ayca",
                lastName: "",
                timeZone: "Asia/Dubai",
                photoUrl: "",
                timeFormat: "h:mm:ss a"

            },
            {
                name: 'Barnam',
                city: 'Melbourne',
                utcOffset: 10,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                firstName: "Barnam",
                lastName: "",
                timeZone: "Australia/Melbourne",
                photoUrl: "",
                timeFormat: "h:mm:ss a"
            },
            {
                name: 'Bob',
                city: 'Boston',
                utcOffset: -4,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                firstName: "Bob",
                lastName: "German",
                timeZone: "America/New_York",
                photoUrl: "",
                timeFormat: "h:mm:ss a"
            },
            {
                name: 'Dan',
                city: 'Phoenix',
                utcOffset: -7,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                firstName: "Dan",
                lastName: "",
                timeZone: "America/Phoenix",
                photoUrl: "",
                timeFormat: "h:mm:ss a"
            },
            {
                name: 'Emily',
                city: 'Bay area',
                utcOffset: -7,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                firstName: "Emily",
                lastName: "",
                timeZone: "America/Los_Angeles",
                photoUrl: "",
                timeFormat: "h:mm:ss a"
            },
            {
                name: 'Matt',
                city: 'Los Angeles',
                utcOffset: -7,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                firstName: "Matt",
                lastName: "",
                timeZone: "America/Los_Angeles",
                photoUrl: "",
                timeFormat: "h:mm:ss a"
            },
            {
                name: 'Rabia',
                city: 'Brisbane',
                utcOffset: 10,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                firstName: "Rabia",
                lastName: "",
                timeZone: "Australia/Melbourne",
                photoUrl: "",
                timeFormat: "h:mm:ss a"
            },
            {
                name: 'Todd',
                city: 'Austin',
                utcOffset: -5,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                firstName: "Matt",
                lastName: "",
                timeZone: "America/Chicago",
                photoUrl: "",
                timeFormat: "h:mm:ss a"
            },
            {
                name: 'Tomomi',
                city: 'Bay area',
                utcOffset: -7,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                firstName: "Tomomi",
                lastName: "",
                timeZone: "America/Los_Angeles",
                photoUrl: "",
                timeFormat: "h:mm:ss a"
            },
            {
                name: 'Waldek',
                city: 'Netherlands',
                utcOffset: 2,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
                firstName: "Waldek",
                lastName: "",
                timeZone: "Europe/Amsterdam",
                photoUrl: "",
                timeFormat: "h:mm:ss a"
            },
        ];
        let clockService = new ClockService();
        result.map((u) => {
            if (u.photoUrl === "") {
                u.photoUrl = noPhoto;
            }
            let members = [];
            members.push(u);
            u.timeZoneObj = clockService.getTimeZones(members);
            return u;
        });

        if (sortOrder === "time") {
            result.sort((a, b) => { return b.utcOffset - a.utcOffset })
        } else {
            result.sort((a, b) => { return a.name < b.name ? -1 : 1 })
        }
        return result;
    }

}