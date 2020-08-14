import * as msal from '@azure/msal-browser';

class AuthService {

    constructor() {
        const msalConfig = {
            auth: {
                clientId: "b64c58a1-2955-4819-9241-1a4b77bb85a1",
                authority: "https://login.microsoftonline.com/a25d4ef1-c73a-4dc1-bdb1-9a342260f216",
                redirectUri: "https://localhost:3000/",
            },
            cache: {
                cacheLocation: "sessionStorage", // This configures where your cache will be stored
                storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
            }
        };

        this.myMSALObj = new msal.PublicClientApplication(msalConfig);
        this.request = {
            scopes: ["user.read"]
        }
    }

    // Call this on every request to an authenticated page
    // Promise returns true if user is logged in, false if user is not
    async init() {
        return new Promise((resolve, reject) => {
            this.myMSALObj.handleRedirectPromise()
                .then((resp) => {
                    if (resp != null && resp.account.username) {
                        resolve(true);
                    } else {
                        const accounts = this.myMSALObj.getAllAccounts();
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
        const accounts = this.myMSALObj.getAllAccounts();
        return (accounts && accounts.length === 1);
    }

    // Get the logged in user name
    getUsername() {
        const accounts = this.myMSALObj.getAllAccounts();
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
            this.myMSALObj.loginRedirect(this.request);
        }
        catch (err) { console.log(err); }
    }

    // Call this to get an access token
    async getAccessToken(scopes) {

        return new Promise((resolve, reject) => {
            this.request.account = this.myMSALObj.getAccountByUsername(this.getUsername());
            if (scopes) {
                this.request.scopes = scopes;
            }
            this.myMSALObj.acquireTokenSilent(this.request)
                .then((resp) => {
                    resolve(resp.accessToken);
                })
                .catch((error) => {
                    console.warn("silent token acquisition fails. acquiring token using redirect");
                    if (error instanceof msal.InteractionRequiredAuthError) {
                        // fallback to interaction when silent call fails
                        return this.myMSALObj.acquireTokenRedirect(this.request);
                    } else {
                        console.warn(error);
                    }
                });
        });
    }
}

export default new AuthService();