/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2024-06-19 10:51:42
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2024-06-19 11:15:46
 * @FilePath      : /turbo-easemob-node/src/lib/im/message.ts
 * @Description   : 
 * 
 * Copyright (c) 2024 by turbo 664120459@qq.com, All Rights Reserved. 
 */
import { EasemobBase } from "../easemob.base";

/**
 * 消息类型：
- txt：文本消息；
- img：图片消息；
- audio：语音消息；
- video：视频消息；
- file：文件消息；
- loc：位置消息；
- cmd：透传消息；
- custom：自定义消息。
 */
export enum ImMsgType {
    /** 文本消息 */
    TEXT = "txt",
    /** 图片消息 */
    IMAGE = "img",
    /** 语音消息 */
    AUDIO = "audio",
    /** 视频消息 */
    VIDEO = "video",
    /** 文件消息 */
    FILE = "file",
    /** 位置消息 */
    LOC = "loc",
    /** 透传消息 */
    CMD = "cmd",
    /** 自定义消息 */
    CUSTOM = "custom",
}

/**
 * 环信Im单聊消息
 */
export class ImMessage {

    protected easeMob: EasemobBase;

    /**
     * 消息发送方的用户 ID。若不传入该字段，服务器默认设置为 admin。
     * ### 1、服务器不校验传入的用户 ID 是否存在，因此，如果你传入的用户 ID 不存在，服务器并不会提示，仍照常发送消息。
     * ### 2、若传入字段但值为空字符串 (“”)，请求失败。
     */
    protected from: string = 'admin';

    /**
     * 消息接收方的用户 ID 数组。每次最多可向 600 个用户发送消息。
     * ### 服务器不校验传入的用户 ID 是否存在，因此，如果你传入的用户 ID 不存在，服务器并不会提示，仍照常发送消息。
     */
    protected to: string[] = [];

    protected msgType: ImMsgType = ImMsgType.TEXT;

    protected msgBody: any = {};

    protected msgExt: Record<string, any> = {};

    public constructor(easeMob: EasemobBase) {
        this.easeMob = easeMob;
    }

    public setFrom(username: string) {
        this.from = username;
    }

    public setReceiver(username: string) {
        this.to = [username];
    }

    public addReceiver(...usernames: string[]) {
        this.to = this.to.concat(usernames);
    }

    public setExt(ext: Record<string, any>) {
        this.msgExt = ext;
    }

    public addExt(ext: Record<string, any>) {
        this.msgExt = {
            ...this.msgExt,
            ...ext
        };
    }

    protected async send() {
        const res: {
            data: {
                [username: string]: string
            }
        } = await this.easeMob.request('/messages/users', {
            from: this.from,
            to: this.to,
            type: this.msgType,
            body: this.msgBody,
            sync_device: true,
            ext: {
                em_ignore_notification: false,
                ...this.msgExt,
            }
        })
        return res.data;
    }

    /**
     * 发送文本消息
     */
    public async sendTxtMessage(msg: string) {
        this.msgType = ImMsgType.TEXT;
        this.msgBody = {
            msg
        }
        return await this.send()
    }

    /**
     * 发送透传消息
     * @param cmd 命令内容
     */
    public async sendCmdMessage(cmd: string) {
        this.msgType = ImMsgType.CMD;
        this.msgBody = {
            action: cmd
        }
        return await this.send()
    }

    /**
     * 发送自定义消息
     * @param customEvent 用户自定义的事件类型。该参数的值必须满足正则表达式 [a-zA-Z0-9-_/\.]{1,32}，长度为 1-32 个字符
     * @param customExts 用户自定义的事件属性，类型必须是 Map<String,String>，最多可以包含 16 个元素。customExts 是可选的，不需要可以不传
     */
    public async sendCustomMessage(customEvent: string, customExts: Record<string, string> = {}) {
        this.msgType = ImMsgType.CUSTOM;
        this.msgBody = {
            customEvent,
            customExts
        }
        return await this.send()
    }
}