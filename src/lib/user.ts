import { AxiosError } from "axios";
import { EasemobBase } from "./easemob.base";

/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2024-06-18 18:14:38
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2024-06-19 08:46:33
 * @FilePath      : /turbo-easemob-node/src/lib/user.ts
 * @Description   : 
 * 
 * Copyright (c) 2024 by turbo 664120459@qq.com, All Rights Reserved. 
 */
export interface EasemobUserInfo {
    /**
     * 环信UUID
     */
    uuid: string;
    type: string;
    /**
     * 创建时间戳-毫秒
     */
    created: number;
    /**
     * 更新时间戳-毫秒
     */
    modified: number;
    username: string;
    activated: boolean;
}

export interface EasemobUserStatus {
    [username: string]: 'online' | 'offline'
}

export class EasemobUser {

    protected easeMob: EasemobBase;

    public constructor(easeMob: EasemobBase) {
        this.easeMob = easeMob;
    }

    /**
     * 注册
     */
    public async createUser(userName: string, password: string) {
        try {
            const res: {
                entities: EasemobUserInfo[],
            } = await this.easeMob.request('/users', {
                username: userName,
                password
            })
            console.log(`zhuce`, res)
            if (res.entities && res.entities.length > 0) {
                return res.entities[0]
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.error || "系统错误")
            }
            throw error
        }
        return null;
    }

    /**
     * 读取用户信息
     * @param userName 
     * @returns 
     */
    public async getUserInfo(userName: string) {
        try {
            const res: {
                entities: EasemobUserInfo[]
            } = await this.easeMob.request(`/users/${userName}`)
            return res.entities[0]
        } catch (error) {

        }
        return null
    }

    /**
     * 修改用户密码
     */
    public async modifyPassword(userName: string, password: string) {
        try {
            await this.easeMob.request(`/users/${userName}/password`, {
                newpassword: password
            }, 'PUT');
            return true
        } catch (error) {

        }
        return false;
    }

    /**
     * 获取用户状态
     */
    public async getUserStatus(userNames: string[]) {
        try {
            const res: {
                data: EasemobUserStatus[]
            } = await this.easeMob.request(`/users/batch/status`, {
                usernames: userNames
            }, 'POST');
            return res.data
        } catch (error) {

        }
        return [];
    }
}