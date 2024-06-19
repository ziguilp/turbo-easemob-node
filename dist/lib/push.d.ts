import { EasemobBase } from "./easemob.base";
export declare enum PushStrategy {
    /**
     * 第三方厂商通道优先，失败时走环信通道。
     */
    THIRD_FIRST = 0,
    /**
     * 只走环信通道：若用户在线，则直接推送；若用户离线，消息会保留一段时间（视购买的套餐包而定），等用户上线后向其推送消息。若用户在超过消息存储期限时仍为上线，则丢弃消息。
     */
    ONLY_EASEMOB = 1,
    /**
     * 只走第三方厂商通道：若用户离线，消息保留时间视不同厂商而定。若推送失败，直接丢弃推送消息。
     */
    ONLY_THIRD = 2,
    /**
     * 只走环信通道且只推在线用户。离线用户收不到推送通知。
     */
    ONLY_ONLINE_EASEMOB = 3
}
/**
 * 推送配置
 */
export interface EasemobPushMessage {
    title: string;
    content: string;
    sub_title?: string;
    config?: {
        /**
         * Android
         * - 环信 iOS 推送通道只支持设置为 url
         * 在通知栏中点击触发的动作，均为字符串类型：
            - url：打开自定义的 URL；
            - action：打开应用的指定页面；
            - activity ：打开应用包名或 Activity 组件路径。若不传该字段，默认打开应用的首页。
         */
        clickAction?: {
            url?: string;
            action?: string;
            activity?: string;
        };
        /**
         * 角标
         * Android
         * 推送角标，包含以下三个字段：
            - addNum：整型，表示推送通知到达设备时，角标数字累加的值。
            - setNum：整型，表示推送通知到达设备时，角标数字显示的值。
            - activity：字符串类型，入口类（华为角标需要配置）。
            #
         */
        badge?: {
            addNum?: number;
            setNum?: number;
            activity?: string;
        };
    };
    easemob: {
        /**
         * 展示样式。
        -（默认）0：普通样式；
        - 1：大文本样式；
        - 2：大图片样式。
         */
        style: 0 | 1 | 2;
        iconUrl: string;
        bigPicture?: string;
        /**
         * 提示音
         */
        sound?: 0 | 1;
        /**
         * 震动
         */
        vibrate?: 0 | 1;
    };
    ext?: Record<string, string>;
}
/**
 * 环信推送
 */
export declare class EasemobPush {
    protected easeMob: EasemobBase;
    constructor(easeMob: EasemobBase);
    /**
     * 调用该接口以异步方式为指定的单个或多个用户进行消息推送。
     * 推送的目标用户 ID。最多可传 100 个
     */
    sendToUsers(userNames: string[], pushMessage: EasemobPushMessage, strategy?: PushStrategy): Promise<{
        id: string;
        pushStatus: 'SUCCESS' | 'FAIL' | 'ERROR' | 'ASYNC_SUCCESS';
        desc?: string | undefined;
    }>;
    /**
     * 向单个标签内的所有用户推送通知
     */
    sendToUsersByLabel(labelName: string, pushMessage: EasemobPushMessage, strategy?: PushStrategy): Promise<{
        taskId: string;
    }>;
    /**
    * 调用该接口，服务端会创建一个推送任务，生成推送任务 ID，用于推送任务的数据统计。
    */
    sendToAll(pushMessage: EasemobPushMessage, strategy?: PushStrategy): Promise<string>;
}
