interface Text {
}

interface Choice {
    allowTextEntry: boolean;
    choices: string[];
    displayAs: string;
}

interface DefaultValue {
    value: string;
}

export default interface ISPListColumnDefinition {
    name: string;
    text?: Text;
    choice?: Choice;
    description?: string;
    defaultValue?: DefaultValue;
}