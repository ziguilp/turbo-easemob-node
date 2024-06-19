import { EasemobBase } from "./easemob.base";

/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2024-06-18 18:14:38
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2024-06-19 09:41:04
 * @FilePath      : /turbo-easemob-node/src/lib/push.ts
 * @Description   : 
 * 
 * Copyright (c) 2024 by turbo 664120459@qq.com, All Rights Reserved. 
 */

// 推送策略：
// -0：第三方厂商通道优先，失败时走环信通道。
// - 1：只走环信通道：若用户在线，则直接推送；若用户离线，消息会保留一段时间（视购买的套餐包而定），等用户上线后向其推送消息。若用户在超过消息存储期限时仍为上线，则丢弃消息。
// -（默认）2：只走第三方厂商通道：若用户离线，消息保留时间视不同厂商而定。若推送失败，直接丢弃推送消息。
// - 3：在线走环信通道，离线走第三方厂商通道。如果厂商推送失败，则等待用户上线后通过环信通道下发。
// - 4：只走环信通道且只推在线用户。离线用户收不到推送通知。
export enum PushStrategy {
    /**
     * 第三方厂商通道优先，失败时走环信通道。
     */
    THIRD_FIRST,
    /**
     * 只走环信通道：若用户在线，则直接推送；若用户离线，消息会保留一段时间（视购买的套餐包而定），等用户上线后向其推送消息。若用户在超过消息存储期限时仍为上线，则丢弃消息。
     */
    ONLY_EASEMOB,
    /**
     * 只走第三方厂商通道：若用户离线，消息保留时间视不同厂商而定。若推送失败，直接丢弃推送消息。
     */
    ONLY_THIRD,
    /**
     * 只走环信通道且只推在线用户。离线用户收不到推送通知。
     */
    ONLY_ONLINE_EASEMOB
}

/**
 * 推送配置
 */
export interface EasemobPushMessage {
    title: string
    content: string
    sub_title?: string,
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
            url?: string
            action?: string
            activity?: string
        },
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
            addNum?: number
            setNum?: number
            activity?: string
        }
    },
    easemob: {
        /**
         * 展示样式。
        -（默认）0：普通样式；
        - 1：大文本样式；
        - 2：大图片样式。
         */
        style: 0 | 1 | 2
        iconUrl: string
        bigPicture?: string
        /**
         * 提示音
         */
        sound?: 0 | 1
        /**
         * 震动
         */
        vibrate?: 0 | 1
    },
    ext?: Record<string, string>
}

/**
 * 环信推送
 */
export class EasemobPush {

    protected easeMob: EasemobBase;

    public constructor(easeMob: EasemobBase) {
        this.easeMob = easeMob;
    }

    /**
     * 调用该接口以异步方式为指定的单个或多个用户进行消息推送。
     * 推送的目标用户 ID。最多可传 100 个
     */
    public async sendToUsers(userNames: string[], pushMessage: EasemobPushMessage, strategy: PushStrategy = PushStrategy.THIRD_FIRST) {
        const res: {
            data: {
                id: string
                pushStatus: 'SUCCESS' | 'FAIL' | 'ERROR' | 'ASYNC_SUCCESS',
                desc?: string
            }[]
        } = await this.easeMob.request('/push/single', {
            targets: userNames,
            strategy,
            pushMessage
        })
        return res.data[0]
    }

    /**
     * 向单个标签内的所有用户推送通知
     */
    public async sendToUsersByLabel(labelName: string, pushMessage: EasemobPushMessage, strategy: PushStrategy = PushStrategy.THIRD_FIRST) {
        const res: {
            data: {
                taskId: string
            }
        } = await this.easeMob.request('/push/list/label', {
            targets: labelName,
            strategy,
            pushMessage
        })
        return res.data
    }

    /**
    * 调用该接口，服务端会创建一个推送任务，生成推送任务 ID，用于推送任务的数据统计。
    */
    public async sendToAll(pushMessage: EasemobPushMessage, strategy: PushStrategy = PushStrategy.THIRD_FIRST) {
        const res: {
            data: string
        } = await this.easeMob.request('/push/task', {
            strategy,
            pushMessage
        })
        return res.data
    }

}