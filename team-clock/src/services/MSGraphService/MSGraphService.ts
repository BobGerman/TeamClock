import IAuthService from '../AuthService/IAuthService';
import * as MicrosoftGraphClient from "@microsoft/microsoft-graph-client";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import ISPListMapper from '../../model/ISPListMapper';

import ICreateListResponse from './GraphResponses/ICreateListResponse';
import IGetListItemsResponse from './GraphResponses/IGetListItemsResponse';
import IGetPersonListItemsBatch from './GraphResponses/IGetPersonListItemsBatch';
export default class MSGraphService {

  public static async Factory(authService: IAuthService): Promise<MSGraphService> {

    let scopes = process.env.REACT_APP_AAD_GRAPH_DELEGATED_SCOPES?.split(',') || [];

    // Try to log in - but even if it fails, set up the Graph client
    try {
      if (!authService.isLoggedIn()) {
        await authService.login(scopes);
      }
    }
    catch { }

    // Initialize a new Graph client
    let graphClient = MicrosoftGraphClient.Client.init({

      authProvider: async (done: MicrosoftGraphClient.AuthProviderCallback) => {
        let token = "";
        try {
          token = await authService.getAccessToken(scopes);
        }
        catch { }
        done(null, token);
      }

    });

    return new MSGraphService(graphClient);
  }

  private constructor(private client: MicrosoftGraphClient.Client) { }

  // Get a site ID given a SharePoint Online URL
  public async getSiteId(spSiteUrl: string): Promise<string> {

    return new Promise<string>((resolve, reject) => {

      const siteUrl = new URL(spSiteUrl);

      const query = this.client.api(
        `sites/${siteUrl.hostname}:${siteUrl.pathname}`
      );//.select('id');
      query.get((error: MicrosoftGraphClient.GraphError, response: MicrosoftGraph.Site) => {
        if (!error) {
          resolve(response.id ?? "");
        } else {
          reject(error);
        }
      });
    });
  }


  // Get a list ID given a site ID and list name
  public async getListId(siteId: string, listName: string): Promise<string> {

    return new Promise<string>((resolve, reject) => {
      const query = this.client
        .api(
          `sites/${siteId}/lists/${listName}`
        )
        .select('id');
      query.get((error: MicrosoftGraphClient.GraphError, response: MicrosoftGraph.List) => {
        if (error) {
          reject(error);
        } else {
          resolve(response.id ?? "");
        }
      });
    });
  }

  // Get list items given a site ID and list ID. The specified mapper maps list
  // items to an array of T, allowing this function to be generic
  public async getAllListItems<T>(siteId: string, listId: string, mapper: ISPListMapper):
    Promise<T[]> {

    return new Promise<T[]>((resolve, reject) => {
      const query = this.client
        .api(
          `/sites/${siteId}/lists/${listId}/items`
        )
        .expand(
          `fields($select%3D${mapper.getFieldNames()})`
        );

      query.get((error: MicrosoftGraphClient.GraphError, response: IGetListItemsResponse) => {
        if (error) {
          reject(error);
        } else {
          const result = mapper.getValuesFromFields(response.value);
          resolve(result);
        }
      });
    });
  }

  // Get list items by item ID given a site ID and list ID. The specified mapper maps list
  // items to an array of T, allowing this function to be generic
  public async getListItemsById<T>(siteId: string, listId: string, itemIds: number[], mapper: ISPListMapper):
    Promise<T[]> {

    interface IBatchRequestStep { id: number; method: string; url: string; }
    let batch: IBatchRequestStep[] = [];
    for (let itemId of itemIds) {
      let request = {
        "id": itemId,
        "method": "GET",
        "url": `/sites/${siteId}/lists/${listId}/items/${itemId}?$expand=fields($select%3Did,FirstName,LastName,Picture)`
      };
      batch.push(request);
    }
    return new Promise<T[]>((resolve, reject) => {
      const query = this.client
        .api(
          `/$batch`
        );
      query.post({
        "requests": batch
      }, ((error: MicrosoftGraphClient.GraphError, response: IGetPersonListItemsBatch) => {
        if (error) {
          reject(error);
        } else {
          const result = mapper.getValuesFromFields(response.responses);
          resolve(result);
        }
      }));
    });
  }


  public createList(siteId: string, listName: string, mapper: ISPListMapper):
    Promise<string> {

    return new Promise<string>((resolve, reject) => {

      const query = this.client
        .api(
          `/sites/${siteId}/lists/`
        );

      const payload = {
        displayName: listName,
        columns: mapper.getColumnDefinitions()
      };

      query.post(payload, ((error: MicrosoftGraphClient.GraphError, response: ICreateListResponse) => {
        if (error) {
          reject(error);
        } else {
          resolve(response.id);
        }
      }));
    });
  }
}