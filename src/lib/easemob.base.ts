/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2024-06-17 17:43:00
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2024-06-19 10:01:02
 * @FilePath      : /turbo-easemob-node/src/lib/easemob.base.ts
 * @Description   : 
 * 
 * Copyright (c) 2024 by turbo 664120459@qq.com, All Rights Reserved. 
 */

import axios from "axios"
import { EaseCache } from "./cache"

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

    private cache: EaseCache;

    constructor(conf: EasemobConf, cachehandle: any) {
        this.conf = conf;
        this.cache = new EaseCache(cachehandle);
    }

    private token: {
        /**
         * Token
         */
        accessToken: string
        /**
         * 过期时间：秒
         */
        expires: number
    } | undefined = undefined;

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
        const cache = await this.cache.get(key);
        if (cache) {
            this.token = cache;
            return cache.accessToken;
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
            }
            this.cache.set(key, this.token, 86100)
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