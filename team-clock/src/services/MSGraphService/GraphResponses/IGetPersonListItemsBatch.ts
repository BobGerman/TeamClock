interface User {
    email: string;
    id: string;
    displayName: string;
}

interface CreatedBy {
    user: User;
}

interface LastModifiedBy {
    user: User;
}

interface ParentReference {
    siteId: string;
}

interface ContentType {
    id: string;
    name: string;
}

interface Picture {
    Description: string;
    Url: string;
}

interface Fields {
    Title: string;
    Name: string;
    EMail: string;
    Notes: string;
    SipAddress: string;
    IsSiteAdmin: boolean;
    Deleted: boolean;
    UserInfoHidden: boolean;
    Picture: Picture;
    FirstName: string;
    LastName: string;
    LinkTitle: string;
    UserName: string;
    SPSPictureTimestamp: string;
    SPSPicturePlaceholderState: number;
    SPSPictureExchangeSyncState: number;
    id: string;
    ContentType: string;
    Modified: Date;
    Created: Date;
    AuthorLookupId: string;
    EditorLookupId: string;
    _UIVersionString: string;
    Attachments: boolean;
    Edit: string;
    LinkTitleNoMenu: string;
    ItemChildCount: string;
    FolderChildCount: string;
    _ComplianceFlags: string;
    _ComplianceTag: string;
    _ComplianceTagWrittenTime: string;
    _ComplianceTagUserId: string;
    ImnName: string;
    PictureOnly_Size_36px: string;
    PictureOnly_Size_48px: string;
    PictureOnly_Size_72px: string;
    NameWithPictureAndDetails: string;
    EditUser: string;
    UserSelection: string;
    ContentTypeDisp: string;
    AppAuthorLookupId: string;
}

interface Body {
    createdDateTime: Date;
    eTag: string;
    id: string;
    lastModifiedDateTime: Date;
    webUrl: string;
    createdBy: CreatedBy;
    lastModifiedBy: LastModifiedBy;
    parentReference: ParentReference;
    contentType: ContentType;
    fields: Fields;
}

export interface Response {
    id: string;
    status: number;
    body: Body;
}

export default interface Responses {
    responses: Response[];
}
