import IPerson from './IPerson';
import ISPListMapper, { IFieldValues, IColumnDefinition } from './ISPListMapper';
import noPhoto from '../common/img/PersonPlaceholder.96x96x32.png';
import { ServiceFactory } from '../services/ServiceFactory';

// Field value set for a SharePoint list item
interface IListItem extends IFieldValues {
    fields: {
        id: number;
        Title: string;
        FirstName: string;
        LastName: string;
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

    public getColumnDefinitions(): IColumnDefinition[] {
        return ([
            { name: 'FirstName', text: { }},
            { name: 'LastName', text: { }},
            { name: 'TimeZone', text: { }},
            { name: 'WorkDays', text: { }},
            { name: 'WorkHours', text: { }},
            { name: 'DateFormat', text: { }},
            { name: 'TimeFormat', text: { }}
        ]);
    }

    // Convert field value set to model object
    public getValuesFromFields(listItems: IListItem[]): IPerson[] {

        let clockService = ServiceFactory.getClockService();
        let result = listItems.map(i => ({
            id: i.fields.id,
            title: i.fields.Title,
            firstName: i.fields.FirstName,
            lastName: i.fields.LastName,
            timeZone: i.fields.TimeZone,
            photoUrl: noPhoto,
            workDays: i.fields.WorkDays,
            workHours: i.fields.WorkHours,
            dateFormat: i.fields.DateFormat,
            timeFormat: i.fields.TimeFormat,
            timeZoneObj: clockService.getDefaultTimeZone()
        }));
        return result;
    }

    // Convert updated properties of model object to field value set
    public setFields(item: any): IListItem {
        let values: any = {};
        if (item.title !== undefined) values.Title = item.title;
        if (item.firstName !== undefined) values.FirstName = item.firstName;
        if (item.lastName !== undefined) values.LastName = item.lastName;
        if (item.timeZone !== undefined) values.TimeZone = item.timeZone;
        if (item.workDays !== undefined) values.StateProvince = item.WorkDays;
        if (item.workHours !== undefined) values.Country = item.WorkHours;
        if (item.dateFormat !== undefined) values.latitude = item.DateFormat;
        if (item.timeFormat !== undefined) values.longitude = item.TimeFormat;
        return { fields: values };
    }
}

