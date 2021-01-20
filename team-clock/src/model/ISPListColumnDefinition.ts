// Subset of https://docs.microsoft.com/en-us/graph/api/resources/columndefinition?view=graph-rest-1.0

interface Text {
}

interface Choice {
    allowTextEntry: boolean;
    choices: string[];
    displayAs: string;
}

export interface PersonOrGroup {
    allowMultipleSelection: boolean;
    displayAs: string;
    chooseFromType: string;
}
interface DefaultValue {
    value: string;
}

export default interface ISPListColumnDefinition {
    name: string;
    text?: Text;
    choice?: Choice;
    personOrGroup?: PersonOrGroup;
    description?: string;
    defaultValue?: DefaultValue;
}