/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2024-06-18 17:07:07
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2024-06-19 10:01:07
 * @FilePath      : /turbo-easemob-node/src/lib/cache.ts
 * @Description   : 
 * 
 * Copyright (c) 2024 by turbo 664120459@qq.com, All Rights Reserved. 
 */
export class EaseCache {

    private $handle: any;

    public constructor(handle: any) {
        this.$handle = handle;
    }

    public async set(key: string, value: any, expire: number | null) {
        return await this.$handle.set(key, JSON.stringify(value), {
            ttl: expire
        });
    }

    public async get(key: string) {
        const res = await this.$handle.get(key)
        return res ? JSON.parse(res) : undefined
    }
}