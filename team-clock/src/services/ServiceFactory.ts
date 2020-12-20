import ITeamService from './TeamService/ITeamService';
import TeamServiceReal from './TeamService/TeamServiceReal';
import TeamServiceMock from './TeamService/TeamServiceMock';

import IClockService from './ClockService/IClockService';
import ClockService from './ClockService/ClockService';

export default class ServiceFactory {

    // Singletons for each service
    private static clockService?: IClockService;
    private static teamService?: ITeamService;

    static async getClockService(): Promise<IClockService> {
        if (!ServiceFactory.clockService) {
            ServiceFactory.clockService = new ClockService();
        }
        return Promise.resolve(ServiceFactory.clockService);
    }

    static async getTeamService(): Promise<ITeamService> {

        const clockService = await ServiceFactory.getClockService();
        if (!ServiceFactory.teamService) {
            if (process.env.REACT_APP_MOCK) {
                ServiceFactory.teamService = new TeamServiceMock(clockService);
            } else {
                const teamService = new TeamServiceReal(clockService);
                await teamService.init();
                ServiceFactory.teamService = teamService;
            }
        }
        return ServiceFactory.teamService;
    }
}