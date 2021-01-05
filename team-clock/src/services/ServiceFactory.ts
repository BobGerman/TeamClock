import ITeamService from './TeamService/ITeamService';
import TeamServiceReal from './TeamService/TeamServiceReal';
import TeamServiceMock from './TeamService/TeamServiceMock';

import IClockService from './ClockService/IClockService';
import ClockService from './ClockService/ClockService';

export enum ServiceOption {
    mockData,           // Use mock data
    msalAuth,           // Use the MSAL Refresh auth provider
    teamsAuth           // Use the MS Teams auth provider
}

export class ServiceFactory {

    // Clock service is a singleton
    private static clockService?: IClockService;
    static async getClockService(): Promise<IClockService> {

        if (!ServiceFactory.clockService) {
            ServiceFactory.clockService = new ClockService();
        }
        return Promise.resolve(ServiceFactory.clockService);

    }

    // Team service has a singleton for each service option
    private static mockTeamService?: ITeamService;
    private static msalTeamService?: ITeamService;
    private static teamsTeamService?: ITeamService;
    static async getTeamService(serviceOption: ServiceOption): Promise<ITeamService> {

        let result: ITeamService;
        const clockService = await ServiceFactory.getClockService();

        if (serviceOption === ServiceOption.mockData ||
            process.env.REACT_APP_MOCK) {
            // Provide mock service
            ServiceFactory.mockTeamService = ServiceFactory.mockTeamService || new TeamServiceMock(clockService);
            result = ServiceFactory.mockTeamService;
        } else if (serviceOption === ServiceOption.msalAuth) {
            // Provide msal service
            ServiceFactory.msalTeamService = ServiceFactory.msalTeamService || new TeamServiceReal(clockService);
            result = ServiceFactory.msalTeamService;
        } else if (serviceOption === ServiceOption.teamsAuth) {
            // Provide teams service
            ServiceFactory.teamsTeamService = ServiceFactory.msalTeamService || new TeamServiceReal(clockService);
            result = ServiceFactory.teamsTeamService;
        } else {
            throw new Error("Invalid service option in ServiceFactory.getTeamService()");
        }

        return result;
    }
}