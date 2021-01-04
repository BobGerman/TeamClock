import IAuthState from './IAuthState';
import IAuthService from './IAuthService';
import * as microsoftTeams from "@microsoft/teams-js";

// TeamsAuthService is a singleton so it can retain the user's state independent of React state.
// This module exports the single instance of the service rather than the service class; just use it,
// don't new it up.
class TeamsAuthService implements IAuthService {

    private authState: IAuthState = {
        username: "",
        accessToken: "",
        scopes: [],
        expiresOn: Date.now()
    }

    // Determine if someone is logged in
    public isLoggedIn() {
        return Date.now() < this.authState.expiresOn;
    }

    // Call this to log the user in
    public login(scopes?: string[]): Promise<void> {

        return new Promise<void>((resolve, reject) => {

            if (scopes &&
                this.compareScopes(scopes, this.authState.scopes) &&
                this.isLoggedIn()) {
                // We're already logged in with this scope, nothing to do
                resolve();
            } else {
                if (scopes) {
                    this.authState.scopes = scopes;
                    microsoftTeams.authentication.authenticate({
                        url: window.location.origin + "/#teamsauthpopup",
                        width: 600,
                        height: 535,
                        successCallback: (response) => {
                            if (response) {
                                const { username, accessToken, expiresOn } =
                                    JSON.parse(response);
                                this.authState = { username, accessToken, scopes, expiresOn };
                                resolve(accessToken);
                            } else {
                                reject('Empty response from microsoftTeams.authentication.authenticate');
                            }
                        },
                        failureCallback: (reason) => {
                            reject(reason);
                        }
                    });
                }
            }
        });
    }

    
    // Get the logged in user name or null if not logged in
    getUsername() {
        return this.authState.username;
    }

    // Call this to get an access token
    public async getAccessToken(scopes: string[]): Promise<string> {
        
        return new Promise<string>((resolve, reject) => {

            if (!this.compareScopes(scopes, this.authState.scopes) ||
                !this.isLoggedIn()) {
                    // We're not logged in or scopes have changed
                this.login(scopes)
                .then(() => {
                    resolve(this.authState.accessToken);
                })
                .catch(() => {
                    reject();
                })
            }
            // We're already logged in with this scope, nothing to do
            resolve(this.authState.accessToken);

        });

    }

    private compareScopes(scopes1: string[], scopes2: string[]): boolean {
        let result = false;

        if (scopes1.length === scopes2.length) {
            const s1 = scopes1.slice().sort();
            const s2 = scopes2.slice().sort();

            return s1.every((s: string, i: number) => s === s2[i]);
        }

        return result;
    }
}

export default new TeamsAuthService();