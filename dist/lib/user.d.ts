import { EasemobBase } from "./easemob.base";
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
    [username: string]: 'online' | 'offline';
}
export declare class EasemobUser {
    protected easeMob: EasemobBase;
    constructor(easeMob: EasemobBase);
    /**
     * 注册
     */
    createUser(userName: string, password: string): Promise<EasemobUserInfo | null>;
    /**
     * 读取用户信息
     * @param userName
     * @returns
     */
    getUserInfo(userName: string): Promise<EasemobUserInfo | null>;
    /**
     * 修改用户密码
     */
    modifyPassword(userName: string, password: string): Promise<boolean>;
    /**
     * 获取用户状态
     */
    getUserStatus(userNames: string[]): Promise<EasemobUserStatus[]>;
}
