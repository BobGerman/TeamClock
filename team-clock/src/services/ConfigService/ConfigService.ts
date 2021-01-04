import * as microsoftTeams from "@microsoft/teams-js";

export interface IConfig {
  spListName: string;
}

export interface IContextAndConfig {
  teamsContext: microsoftTeams.Context;
  config: IConfig;
}

// Quick and dirty config stores a short string in the entity ID
export class ConfigService {

  public static getEntityId(configInfo: IConfig): string {
    return configInfo.spListName + "/" +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }

  public static async getContextAndConfig(): Promise<IContextAndConfig> {
    return new Promise<IContextAndConfig>((resolve) => {

      microsoftTeams.getContext((context: microsoftTeams.Context) => {
        resolve({
          teamsContext: context,
          config: {
            spListName: context.entityId.split('/')[0]
          },
        });
      });

    });
  }

}