import ITeamService from './TeamService/ITeamService';
import TeamServiceReal from './TeamService/TeamServiceReal';
import TeamServiceMock from './TeamService/TeamServiceMock';

import IClockService from './ClockService/IClockService';
import ClockService from './ClockService/ClockService';
import MSGraphService from './MSGraphService/MSGraphService';
import MsalAuthService from './AuthService/MsalRefreshAuthService';
import TeamsAuthService from './AuthService/TeamsAuthService';

export enum ServiceOption {
    mockData,           // Use mock data
    msalAuth,           // Use the MSAL Refresh auth provider
    teamsAuth           // Use the MS Teams auth provider
}

export class ServiceFactory {

    // Clock service is a singleton
    private static clockService?: IClockService;
    static getClockService(): IClockService {

        if (!ServiceFactory.clockService) {
            ServiceFactory.clockService = new ClockService();
        }
        return ServiceFactory.clockService;

    }

    // Team service has a singleton for each service option
    private static mockTeamService?: ITeamService;
    private static msalTeamService?: ITeamService;
    private static teamsTeamService?: ITeamService;
    static async getTeamService(serviceOption: ServiceOption, spSiteUrl?: string, spListName?: string):
        Promise<ITeamService> {

        let result: ITeamService;
        const clockService = ServiceFactory.getClockService();

        if (serviceOption === ServiceOption.mockData || process.env.REACT_APP_MOCK) {
            // Provide mock service
            ServiceFactory.mockTeamService = ServiceFactory.mockTeamService || new TeamServiceMock(clockService);
            result = ServiceFactory.mockTeamService;
        } else if (serviceOption === ServiceOption.msalAuth && spSiteUrl && spListName) {
            // Provide msal service
            if (!ServiceFactory.msalTeamService) {
                const graphService = await MSGraphService.Factory(MsalAuthService);
                ServiceFactory.msalTeamService = new TeamServiceReal({
                    clockService: clockService,
                    graphService: graphService,
                    spSiteUrl: spSiteUrl,
                    spListName: spListName
                });
            }
            result = ServiceFactory.msalTeamService;
        } else if (serviceOption === ServiceOption.teamsAuth && spSiteUrl && spListName) {

            // Provide teams service
            if (!ServiceFactory.teamsTeamService) {
                const graphService = await MSGraphService.Factory(TeamsAuthService);
                ServiceFactory.teamsTeamService = new TeamServiceReal({
                    clockService: clockService,
                    graphService: graphService,
                    spSiteUrl: spSiteUrl,
                    spListName: spListName
                });
            }
            result = ServiceFactory.teamsTeamService;
        } else {
            throw new Error("Invalid service option or missing args in ServiceFactory.getTeamService()");
        }

        return result;
    }
}