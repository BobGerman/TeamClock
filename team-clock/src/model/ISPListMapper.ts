// Implement ISPListMapper based on the details of your SharePoint list to allow
// list access via the MSGraph service in this project. Currently Create and Read list
// operations are supported.
import ISPListColumnDefinition from './ISPListColumnDefinition';

// https://docs.microsoft.com/en-us/graph/api/resources/fieldvalueset?view=graph-rest-1.0
export interface IFieldValues {
    fields: any;
}

// A class that can be used by the Graph Service to access a specific
// SharePoint list and map its items to/from a model class
// This allows reuse of Graph code across various lists
export default interface ISPListMapper {
    // Returns a comma-separated list of SP field values
    getFieldNames(): string;
    // Returns JSON needed to create a new list
    getColumnDefinitions(): ISPListColumnDefinition[];
    // Maps an array of SharePoint list items to an array of model objects
    getValuesFromFields(listItems: any[]): any[];
}