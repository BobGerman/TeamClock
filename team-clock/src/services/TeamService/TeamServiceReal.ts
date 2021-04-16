import noPhoto from '../../common/img/PersonPlaceholder.96x96x32.png'
import IPerson from '../../model/IPerson';
import PersonSPListMapper from '../../model/PersonSPListMapper';
import ITimeZone from '../../model/ITimeZone';
import ITeamService, { ITeamServiceProps } from './ITeamService';
import IUserInformation from '../../model/IUserInformation';
import UserInformationListSPListMapper from '../../model/UserInformationListMapper';

export default class TeamServiceReal implements ITeamService {

    constructor(private teamServiceProps: ITeamServiceProps) { };

    public async getCurrentUser(format: string) {

        // TODO Fix this
        const currentUser: IPerson = {
            firstName: "Real",
            lastName: "Service",
            timeZone: "America/New_York",
            personLookupId: -1,
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

        const personListMapper = new PersonSPListMapper();
        const userListMapper = new UserInformationListSPListMapper();
        const graphService = this.teamServiceProps.graphService;

        let siteId: string;
        let listId: string;
        let members: IPerson[] = [];
        let users: IUserInformation[] = [];

        try {
            // 1. Get Site ID
            siteId = await graphService.getSiteId(this.teamServiceProps.spSiteUrl);

            // 2. Get List ID or create list if needed
            try {
                listId = await graphService.getListId(siteId, this.teamServiceProps.spListName);
            } catch (error) {
                if (error.statusCode === 404) {
                    listId = await graphService.createList(siteId, this.teamServiceProps.spListName, personListMapper);
                } else throw (error);
            }

            // 3. Get the list items mapped to the model
            members = await graphService.getAllListItems<IPerson>(siteId, listId, personListMapper);

            // 4. The list items are missing information from the User Information List in SharePoint
            //    Get the list ID for the User Information List
            const userInfoListId = await graphService.getListId(siteId, 'User Information List');

            //    Read the needed rows from that list
            let itemIds: number[] = [];
            for (let member of members) {
                itemIds.push(member.personLookupId);
            };
            users = await graphService.getListItemsById<IUserInformation>(siteId, userInfoListId, itemIds,
                userListMapper);

            // 5. Fill in the missing properties from the user information list and time zone object
            for (let member of members) {
                let user = users.find(u => u.id === member.personLookupId);
                if (user) {
                    member.firstName = user?.firstName;
                    member.lastName = user?.lastName;
                    member.photoUrl = user?.photoUrl;
                    // TODO: Either move this into a new step or refactor
//                    member.timeZoneObj = this.teamServiceProps.clockService.getTimeZones(members)[0];
                }
            }

            return members;

        } catch (error) {
            throw new Error(error)
        };
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