import IPerson from './IPerson';
import ISPListMapper, { IFieldValues } from './ISPListMapper';
import ISPListColumnDefinition from './ISPListColumnDefinition';
import noPhoto from '../common/img/PersonPlaceholder.96x96x32.png';
import { ServiceFactory } from '../services/ServiceFactory';

// Field value set for a SharePoint list item
interface IListItem extends IFieldValues {
    fields: {
        id: number;
        Title: string;
        PersonLookupId: number;
        TimeZone: string;
        WorkDays: string;
        WorkHours: string;
        DateFormat: string;
        TimeFormat: string;
    };
}

// Class used by Graph Service to hide list details from the Graph code
export default class PersonSPListMapper implements ISPListMapper {

    public getFieldNames(): string {
        return ('id,Title,FirstName,LastName,TimeZone,WorkDays,WorkHours,DateFormat,TimeFormat');
    }

    public getColumnDefinitions(): ISPListColumnDefinition[] {
        return ([
            {
               "name": "Person", "personOrGroup": {
                    "allowMultipleSelection": false,
                    "displayAs": "nameWithPictureAndDetails",
                    "chooseFromType": "peopleOnly"
                }
            },
            {
                "name": "TimeZone", "choice": {
                    "allowTextEntry": false,
                    "choices": [
                        "America/Chicago",
                        "America/Los_Angeles",
                        "America/New_York",
                        "America/Phoenix",
                        "Asia/Dubai",
                        "Asia/Kolkata",
                        "Australia/Brisbane",
                        "Australia/Melbourne",
                        "Europe/Amsterdam",
                        "Europe/Helsinki",
                        "Europe/London"
                    ],
                    "displayAs": "dropDownMenu"
                }, "description": "Select user's time zone"
            },
            {
                "name": "WorkDays", "text": {}, "defaultValue": { "value": "owwwwwo" },
                "description": "Enter 7 characters corresponding to the 7 days of the week with o=off work, w=working"
            },
            {
                "name": "WorkHours", "text": {}, "defaultValue": { "value": "nnnnnnneedddddddddeeeeen" },
                "description": "Enter 24 characters corresponding to the 24 hours in a day with n=night, e=evening, d=day"
            },
            {
                "name": "DateFormat", "choice": {
                    "allowTextEntry": true,
                    "choices": ["MM/dd/yyyy", "dd/MM/yyyy"],
                    "displayAs": "dropDownMenu"
                },
                "defaultValue": { "value": "MM/dd/yyyy" },
                "description": "Formatting when this user views the clock"
            },
            {
                "name": "TimeFormat", "choice": {
                    "allowTextEntry": true,
                    "choices": ["h:mm a", "hh:mm"],
                    "displayAs": "dropDownMenu"
                },
                "defaultValue": { "value": "h:mm a" },
                "description": "Formatting when this user views the clock"
            }
        ]);
    }

    // Convert field value set to model object
    public getValuesFromFields(listItems: IListItem[]): IPerson[] {

        let clockService = ServiceFactory.getClockService();
        let result = listItems.map(i => ({
            id: i.fields.id,
            personLookupId: i.fields.PersonLookupId,
            title: i.fields.Title,
            timeZone: i.fields.TimeZone,
            workDays: i.fields.WorkDays,
            workHours: i.fields.WorkHours,
            dateFormat: i.fields.DateFormat,
            timeFormat: i.fields.TimeFormat,
            // These fields will be filled in later
            firstName: "",
            lastName: "",
            photoUrl: noPhoto,
            timeZoneObj: clockService.getDefaultTimeZone()
        }));
        return result;
    }
}

