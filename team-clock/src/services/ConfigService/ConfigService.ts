import * as microsoftTeams from "@microsoft/teams-js";

export interface IConfigInfo {
    spListName: string;
}

export class ConfigService {

  public static getEntityId(configInfo: IConfigInfo): string {
    return configInfo.spListName + "/" +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }

  public static async getConfigInfo(): Promise<IConfigInfo> {
    return new Promise<IConfigInfo>((resolve) => {
        microsoftTeams.getContext((context: microsoftTeams.Context) => {
            resolve({
                spListName: context.entityId.split('/')[0]
            });
        });
    });
  }

}