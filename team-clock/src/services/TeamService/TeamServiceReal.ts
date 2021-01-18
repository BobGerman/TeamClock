import noPhoto from '../../common/img/PersonPlaceholder.96x96x32.png'
import IPerson from '../../model/IPerson';
import PersonSPListMapper from '../../model/PersonSPListMapper';
import ITimeZone from '../../model/ITimeZone';
import ITeamService, { ITeamServiceProps } from './ITeamService';

export default class TeamServiceReal implements ITeamService {

    constructor(private teamServiceProps: ITeamServiceProps) { };

    public async getCurrentUser(format: string) {

        const currentUser: IPerson = {
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
        currentUser.timeZoneObj = this.teamServiceProps.clockService.getTimeZones(members)[0];
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
    };

    private async getTeamMembers(sortOrder: string): Promise<IPerson[]> {

        const listMapper = new PersonSPListMapper();
        const graphService = this.teamServiceProps.graphService;

        let siteId: string;
        let listId: string;
        let result: IPerson[] = [];

        try {
            // 1. Get Site ID
            siteId = await graphService.getSiteId(this.teamServiceProps.spSiteUrl);

            // 2. Get List ID or create list if needed
            try {
                listId = await graphService.getListId(siteId, this.teamServiceProps.spListName);
            } catch (error) {
                if (error.statusCode === 404) {
                    listId = await graphService.createList(siteId, this.teamServiceProps.spListName, listMapper);
                } else throw (error);
            }

            // 3. Get the list items mapped to the model
            result = await graphService.getListItems<IPerson>(siteId, listId, listMapper);

            return result;
        } catch (error) {
            throw new Error(error)
        };
        // #region OLD JUNK
        // let mockMembers: IPerson[] = [
        //     {
        //         firstName: "Derek",
        //         lastName: "Cash-Peterson",
        //         timeZone: "America/New_York",
        //         /* Preferred work week, 1 char/day, o=off, w=work */
        //         workDays: 'owwwwwo',
        //         /* Preferred work day, 1 char/hour, n=night, e=extended, d=day */
        //         workHours: 'nnnnnnneedddddddddeeeeen',
        //         photoUrl: "",
        //         dateFormat: "MM/dd/yyyy",
        //         timeFormat: "h:mm a",
        //         timeZoneObj: this.getDefaultTimeZone()
        //     },
        //     {
        //         firstName: "Ayca",
        //         lastName: "",
        //         timeZone: "Asia/Dubai",
        //         /* Preferred work week, 1 char/day, o=off, w=work */
        //         workDays: 'owwwwwo',
        //         /* Preferred work day, 1 char/hour, n=night, e=extended, d=day */
        //         workHours: 'nnnnnnneedddddddddeeeeen',
        //         photoUrl: "",
        //         dateFormat: "MM/dd/yyyy",
        //         timeFormat: "h:mm a",
        //         timeZoneObj: this.getDefaultTimeZone()
        //     },
        //     {
        //         firstName: "Barnam",
        //         lastName: "",
        //         timeZone: "Australia/Melbourne",
        //         workDays: 'owwwwwo',
        //         workHours: 'nnnnnnneedddddddddeeeeen',
        //         photoUrl: "",
        //         dateFormat: "MM/dd/yyyy",
        //         timeFormat: "h:mm a",
        //         timeZoneObj: this.getDefaultTimeZone()
        //     },
        //     {
        //         firstName: "Bob",
        //         lastName: "German",
        //         timeZone: "America/New_York",
        //         workDays: 'owwwwwo',
        //         workHours: 'nnnnnnneedddddddddeeeeen',
        //         photoUrl: "",
        //         dateFormat: "MM/dd/yyyy",
        //         timeFormat: "h:mm a",
        //         timeZoneObj: this.getDefaultTimeZone()
        //     },
        //     {
        //         firstName: "Dan",
        //         lastName: "",
        //         timeZone: "America/Phoenix",
        //         workDays: 'owwwwwo',
        //         workHours: 'nnnnnnneedddddddddeeeeen',
        //         photoUrl: "",
        //         dateFormat: "MM/dd/yyyy",
        //         timeFormat: "h:mm a",
        //         timeZoneObj: this.getDefaultTimeZone()
        //     },
        //     {
        //         firstName: "Emily",
        //         lastName: "",
        //         timeZone: "America/Los_Angeles",
        //         workDays: 'owwwwwo',
        //         workHours: 'nnnnnnneedddddddddeeeeen',
        //         photoUrl: "",
        //         dateFormat: "MM/dd/yyyy",
        //         timeFormat: "h:mm a",
        //         timeZoneObj: this.getDefaultTimeZone()
        //     },
        //     {
        //         firstName: "Matt",
        //         lastName: "",
        //         timeZone: "America/Los_Angeles",
        //         workDays: 'owwwwwo',
        //         workHours: 'nnnnnnneedddddddddeeeeen',
        //         photoUrl: "",
        //         dateFormat: "MM/dd/yyyy",
        //         timeFormat: "h:mm a",
        //         timeZoneObj: this.getDefaultTimeZone()
        //     },
        //     {
        //         firstName: "Rabia",
        //         lastName: "",
        //         timeZone: "Australia/Brisbane",
        //         workDays: 'owwwwwo',
        //         workHours: 'nnnnnnneedddddddddeeeeen',
        //         photoUrl: "",
        //         dateFormat: "MM/dd/yyyy",
        //         timeFormat: "h:mm a",
        //         timeZoneObj: this.getDefaultTimeZone()
        //     },
        //     {
        //         firstName: "Todd",
        //         lastName: "",
        //         timeZone: "America/Chicago",
        //         workDays: 'owwwwwo',
        //         workHours: 'nnnnnnneedddddddddeeeeen',
        //         photoUrl: "",
        //         dateFormat: "MM/dd/yyyy",
        //         timeFormat: "h:mm a",
        //         timeZoneObj: this.getDefaultTimeZone()
        //     },
        //     {
        //         firstName: "Tomomi",
        //         lastName: "",
        //         timeZone: "America/Los_Angeles",
        //         workDays: 'owwwwwo',
        //         workHours: 'nnnnnnneedddddddddeeeeen',
        //         photoUrl: "",
        //         dateFormat: "MM/dd/yyyy",
        //         timeFormat: "h:mm a",
        //         timeZoneObj: this.getDefaultTimeZone()
        //     },
        //     {
        //         firstName: "Waldek",
        //         lastName: "",
        //         timeZone: "Europe/Amsterdam",
        //         workDays: 'owwwwwo',
        //         workHours: 'nnnnnnneedddddddddeeeeen',
        //         photoUrl: "",
        //         dateFormat: "MM/dd/yyyy",
        //         timeFormat: "h:mm a",
        //         timeZoneObj: this.getDefaultTimeZone()
        //     },
        // ];
        // mockMembers.forEach((m) => {
        //     m.photoUrl = m.photoUrl || noPhoto;
        //     m.timeZoneObj = this.teamServiceProps.clockService.getTimeZones([m])[0];
        // });

        // return mockMembers;
        //#endregion

    }

    public getEditUrl() {

        return `${this.teamServiceProps.spSiteUrl}/Lists/${this.teamServiceProps.spListName}/AllItems.aspx`;

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