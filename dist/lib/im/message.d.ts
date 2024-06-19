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
export declare enum ImMsgType {
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
    CUSTOM = "custom"
}
/**
 * 环信Im单聊消息
 */
export declare class ImMessage {
    protected easeMob: EasemobBase;
    /**
     * 消息发送方的用户 ID。若不传入该字段，服务器默认设置为 admin。
     * ### 1、服务器不校验传入的用户 ID 是否存在，因此，如果你传入的用户 ID 不存在，服务器并不会提示，仍照常发送消息。
     * ### 2、若传入字段但值为空字符串 (“”)，请求失败。
     */
    protected from: string;
    /**
     * 消息接收方的用户 ID 数组。每次最多可向 600 个用户发送消息。
     * ### 服务器不校验传入的用户 ID 是否存在，因此，如果你传入的用户 ID 不存在，服务器并不会提示，仍照常发送消息。
     */
    protected to: string[];
    protected msgType: ImMsgType;
    protected msgBody: any;
    protected msgExt: Record<string, any>;
    constructor(easeMob: EasemobBase);
    setFrom(username: string): void;
    setReceiver(username: string): void;
    addReceiver(...usernames: string[]): void;
    setExt(ext: Record<string, any>): void;
    addExt(ext: Record<string, any>): void;
    protected send(): Promise<{
        [username: string]: string;
    }>;
    /**
     * 发送文本消息
     */
    sendTxtMessage(msg: string): Promise<{
        [username: string]: string;
    }>;
    /**
     * 发送透传消息
     * @param cmd 命令内容
     */
    sendCmdMessage(cmd: string): Promise<{
        [username: string]: string;
    }>;
    /**
     * 发送自定义消息
     * @param customEvent 用户自定义的事件类型。该参数的值必须满足正则表达式 [a-zA-Z0-9-_/\.]{1,32}，长度为 1-32 个字符
     * @param customExts 用户自定义的事件属性，类型必须是 Map<String,String>，最多可以包含 16 个元素。customExts 是可选的，不需要可以不传
     */
    sendCustomMessage(customEvent: string, customExts?: Record<string, string>): Promise<{
        [username: string]: string;
    }>;
}
