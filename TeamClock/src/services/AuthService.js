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

        // TODO: Consider moving these into init and passing in the scope
        this.myMSALObj = new msal.PublicClientApplication(msalConfig);
        this.request = {
            scopes: ["user.read"]
        }

        this.userName = '';
        this.idToken = '';
        this.accessToken = '';
    }

    // Call this on every request to an authenticated page
    async init() {
        return new Promise((resolve, reject) => {
            this.myMSALObj.handleRedirectPromise()
                .then((resp) => {
                    let username;
                    if (resp != null) {
                        username = resp.account.username;
                    } else {
                        const currentAccounts = this.myMSALObj.getAllAccounts();
                        if (currentAccounts === null) {
                            resolve("");
                        } else if (currentAccounts.length > 1) {
                            reject("ERROR: Multiple accounts are logged in");
                        } else if (currentAccounts.length === 1) {
                            username = currentAccounts[0].username;
                        }
                    }
                    if (username) {
                        this.userName = username;
                        resolve(username);
                    } else reject("ERROR: user not found");

                })
                .catch(err => { reject(err); });
        });
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
            this.request.account = this.myMSALObj.getAccountByUsername(this.userName);
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