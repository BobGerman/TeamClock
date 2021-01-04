export default interface IAuthState {
    username: string;
    accessToken: string;
    scopes: string[];
    expiresOn: number;
}

