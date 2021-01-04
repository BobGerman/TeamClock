export default interface IAuthService {
    isLoggedIn: () => boolean;
    login: (scopes?: string[]) => Promise<void>;
    getUsername: () => string;
    getAccessToken: (scopes: string[]) => Promise<string>;
}
