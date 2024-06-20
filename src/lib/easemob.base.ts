/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2024-06-17 17:43:00
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2024-06-20 11:18:42
 * @FilePath      : /turbo-easemob-node/src/lib/easemob.base.ts
 * @Description   : 
 * 
 * Copyright (c) 2024 by turbo 664120459@qq.com, All Rights Reserved. 
 */

import axios from "axios"
import Redis from "ioredis"
import NodeCache from "node-cache"

export interface CacheEasemobToken {
    accessToken: string
    /**
     * 时间戳秒
     */
    expires: number
}

export interface EasemobConf {
    orgName: string
    appName: string
    clientId: string
    clientSecret: string
    appKey: string
}

export class EasemobBase {

    private host = 'https://a1.easemob.com';

    private conf: EasemobConf;

    private cache: NodeCache | Redis;

    constructor(conf: EasemobConf, cachehandle?: NodeCache | Redis) {
        this.conf = conf;
        if (!cachehandle) {
            cachehandle = new NodeCache()
        }
        this.cache = cachehandle;
    }

    private token: CacheEasemobToken | undefined = undefined;

    private getUri(uri: string) {
        if (!uri.startsWith("/")) {
            uri = `/${uri}`;
        }
        return `${this.host}/${this.conf.orgName}/${this.conf.appName}${uri}`
    }

    public async getAuthToken() {

        if (this.token && this.token.expires > ((new Date()).getTime() / 1000)) {
            return this.token.accessToken
        }

        const key = `easemob-authtoken:${this.conf.appKey}`;
        let cache = await this.cache.get(key);
        if (cache) {
            let cacheToken: CacheEasemobToken = 'string' == typeof cache ? JSON.parse(cache) : cache;
            this.token = cacheToken;
            return cacheToken.accessToken;
        }

        const res: {
            application: string
            access_token: string
            expires_in: number
        } = await this.request(this.getUri('/token'), {
            grant_type: "client_credentials",
            client_id: this.conf.clientId,
            client_secret: this.conf.clientSecret,
            // token 有效期，单位为秒。
            ttl: 86400
        });
        if (res.access_token) {

            this.token = {
                accessToken: res.access_token,
                expires: Math.round((new Date()).getTime() / 1000 + 86100)
            } as CacheEasemobToken;

            if (this.cache instanceof Redis) {
                this.cache.set(key, JSON.stringify(this.token), 'EX', 86100)
            } else {
                this.cache.set(key, this.token, 86100)
            }
            return this.token.accessToken
        }
        return ''
    }

    /**
     * 
     * @param uri 
     */
    public async request(uri: string, body: Record<string, any> = {}, method: 'POST' | 'GET' | 'PUT' | 'DELETE' = 'POST') {
        console.log(`发处`, uri)
        if (!uri.startsWith("https://") && !uri.startsWith("http://")) {
            uri = this.getUri(uri)
        }
        console.log(`发处1`, uri)
        let headers: Record<string, any> = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        if (!uri.endsWith("/token")) {
            headers['Authorization'] = `Bearer ${await this.getAuthToken()}`
        }
        const res = await axios.request({
            url: uri,
            method,
            data: body,
            headers
        })
        return res.data;
    }

}