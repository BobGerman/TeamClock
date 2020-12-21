import TeamServiceReal from './TeamServiceReal';
import TeamServiceMock from './TeamServiceMock';

export default class TeamService {

    static async factory(isMock) {
        let service = null;
        if (process.env.REACT_APP_MOCK) {
            service = await TeamServiceMock.factory();
        } else {
            service = await TeamServiceReal.factory();
        }
        return service;
    }


}