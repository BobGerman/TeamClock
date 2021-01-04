import * as microsoftTeams from "@microsoft/teams-js";

export enum PageChoice { main="main", test="test" }
export interface IConfig {
  pageChoice: PageChoice;
  spListName: string;
}

export interface IContextAndConfig {
  teamsContext: microsoftTeams.Context;
  config: IConfig;
}

// Quick and dirty config stores a short string in the entity ID
export class ConfigService {

  public static getEntityId(configInfo: IConfig): string {
    return configInfo.pageChoice + "/" + 
           configInfo.spListName + "/" +
           Math.random().toString(36).substring(2, 15) +  // Randomness to ensure entity ID is unique
           Math.random().toString(36).substring(2, 15);
  }

  public static async getContextAndConfig(): Promise<IContextAndConfig> {
    return new Promise<IContextAndConfig>((resolve) => {

      microsoftTeams.getContext((context: microsoftTeams.Context) => {
        
        const contextInfo = context.entityId.split('/');
        if (contextInfo.length < 2) {
          resolve({
            teamsContext: context,
            config: {
              pageChoice: PageChoice.main,
              spListName: ""
            },
          });
        } else {
          resolve({
            teamsContext: context,
            config: {
              pageChoice: contextInfo[0] as PageChoice,
              spListName: contextInfo[1]
            },
          });
        }
      });

    });
  }

}