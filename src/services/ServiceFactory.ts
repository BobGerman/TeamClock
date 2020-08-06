export enum ServiceOption {
    mock, v1
}

export class ServiceFactory {

    public static getService(option: ServiceOption) : any {

        if (option === ServiceOption.v1) {
            return null;
        } else {
            return null;
        }
    }
}
