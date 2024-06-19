export interface EasemobConf {
    orgName: string;
    appName: string;
    clientId: string;
    clientSecret: string;
    appKey: string;
}
export declare class EasemobBase {
    private host;
    private conf;
    private cache;
    constructor(conf: EasemobConf, cachehandle: any);
    private token;
    private getUri;
    getAuthToken(): Promise<any>;
    /**
     *
     * @param uri
     */
    request(uri: string, body?: Record<string, any>, method?: 'POST' | 'GET' | 'PUT' | 'DELETE'): Promise<any>;
}
