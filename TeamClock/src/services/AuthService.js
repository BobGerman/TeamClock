import * as msal from '@azure/msal-browser';
import * as Config from '../Config';

// AuthService is a singleton so one PublicClientApplication
// can retain state. This module exports the single instance
// of the service rather than the service class; just use it,
// don't new it up.
class AuthService {

    constructor() {

        const msalConfig = {
            auth: {
                clientId: Config.clientId,
                authority: Config.authority,
                redirectUri: Config.redirectUri
            },
            cache: {
                cacheLocation: "sessionStorage", // This configures where your cache will be stored
                storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
            }
        };

        // MSAL request object to use over and over
        this.request = {
            scopes: ["user.read"]
        }

        this.msalClient = new msal.PublicClientApplication(msalConfig);
    }

    // Call this on every request to an authenticated page
    // Promise returns true if user is logged in, false if user is not
    async init() {
        return new Promise((resolve, reject) => {
            this.msalClient.handleRedirectPromise()
                .then((resp) => {
                    if (resp != null && resp.account.username) {
                        resolve(true);
                    } else {
                        const accounts = this.msalClient.getAllAccounts();
                        if (accounts === null || accounts.length === 0) {
                            resolve(false);
                        } else if (accounts.length > 1) {
                            reject("ERROR: Multiple accounts are logged in");
                        } else if (accounts.length === 1) {
                            resolve(true);
                        }
                    }
                })
                .catch(err => { reject(err); });
        });
    }

    // Determine if someone is logged in
    isLoggedIn() {
        const accounts = this.msalClient.getAllAccounts();
        return (accounts && accounts.length === 1);
    }

    // Get the logged in user name or null if not logged in
    getUsername() {
        const accounts = this.msalClient.getAllAccounts();
        let result = null;

        if (accounts && accounts.length === 1) {
            result = accounts[0].username;
        } else if (accounts && accounts.length > 1) {
            console.log('ERROR: Multiple users logged in');
        }
        return result;
    }

    // Call this to log the user in
    login() {
        try {
            this.msalClient.loginRedirect(this.request);
        }
        catch (err) { console.log(err); }
    }

    // Call this to get an access token
    async getAccessToken(scopes) {

        return new Promise((resolve, reject) => {
            this.request.account = this.msalClient.getAccountByUsername(this.getUsername());
            if (scopes) {
                this.request.scopes = scopes;
            }
            this.msalClient.acquireTokenSilent(this.request)
                .then((resp) => {
                    resolve(resp.accessToken);
                })
                .catch((error) => {
                    console.warn("silent token acquisition fails. acquiring token using redirect");
                    if (error instanceof msal.InteractionRequiredAuthError) {
                        // fallback to interaction when silent call fails
                        return this.msalClient.acquireTokenRedirect(this.request);
                    } else {
                        console.warn(error);
                    }
                });
        });
    }
}

export default new AuthService();