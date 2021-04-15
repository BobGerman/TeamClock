import IUserInformation from './IUserInformation';
import ISPListMapper, { IFieldValues } from './ISPListMapper';
import ISPListColumnDefinition from './ISPListColumnDefinition';
import noPhoto from '../common/img/PersonPlaceholder.96x96x32.png';
import { ServiceFactory } from '../services/ServiceFactory';
import { Response } from '../services/MSGraphService/GraphResponses/IGetPersonListItemsBatch';

// Class used by Graph Service to hide list details from the Graph code
export default class PersonSPListMapper implements ISPListMapper {

    public getFieldNames(): string {
        return ('id,FirstName,LastName,Picture');
    }

    public getColumnDefinitions(): ISPListColumnDefinition[] {
        // We will not be creating this list, it is built into SharePoint
        return ([]);
    }

    // Convert field value set to model object
    public getValuesFromFields(listItems: Response[]): IUserInformation[] {

        let result = listItems.map(i => ({
            id: parseInt(i.id),
            firstName: i.body.fields.FirstName,
            lastName: i.body.fields.LastName,
            photoUrl: i.body.fields.Picture?.Url
        }));
        return result;
    }
}

