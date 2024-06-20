import Redis from "ioredis";
import NodeCache from "node-cache";
export interface CacheEasemobToken {
    accessToken: string;
    /**
     * 时间戳秒
     */
    expires: number;
}
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
    constructor(conf: EasemobConf, cachehandle?: NodeCache | Redis);
    private token;
    private getUri;
    getAuthToken(): Promise<string>;
    /**
     *
     * @param uri
     */
    request(uri: string, body?: Record<string, any>, method?: 'POST' | 'GET' | 'PUT' | 'DELETE'): Promise<any>;
}
