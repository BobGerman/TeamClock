import IAuthService from '../AuthService/IAuthService';
import * as MicrosoftGraphClient from "@microsoft/microsoft-graph-client";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";

export default class MSGraphService {

  public static async Factory(authService: IAuthService): Promise<MSGraphService> {

    let scopes = process.env.REACT_APP_AAD_GRAPH_DELEGATED_SCOPES?.split(',') || [];

    // Ensure we are logged in
    if (!authService.isLoggedIn()) {
      await authService.login(scopes);
    }

    // Initialize a new Graph client
    let graphClient = MicrosoftGraphClient.Client.init({

      authProvider: async (done: MicrosoftGraphClient.AuthProviderCallback) => {
        const token = await authService.getAccessToken(scopes);
        done(null, token);
      }

    });

    return new MSGraphService(graphClient);
  }

  private constructor(private client: MicrosoftGraphClient.Client) { }

  public async getMessages(): Promise<MicrosoftGraph.Message[]> {

    return new Promise<MicrosoftGraph.Message[]>((resolve, reject) => {

      this.client
        .api("me/mailFolders/inbox/messages")
        .select(["receivedDateTime", "subject"])
        .top(15)
        .get(async (error: MicrosoftGraphClient.GraphError, response: any) => {
          if (!error) {
            resolve(response.value as MicrosoftGraph.Message[]);
          } else {
            reject(error);
          }
        });

    });
  }

}