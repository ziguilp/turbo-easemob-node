import { EasemobBase } from "./lib/easemob.base";
import { ImMessage } from "./lib/im/message";
import { EasemobPush } from "./lib/push";
import { EasemobUser } from "./lib/user";

/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2024-06-17 17:42:00
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2024-06-19 11:17:01
 * @FilePath      : /turbo-easemob-node/src/index.ts
 * @Description   : 
 * 
 * Copyright (c) 2024 by turbo 664120459@qq.com, All Rights Reserved. 
 */
export default {
    easemob: EasemobBase,
    User: EasemobUser,
    Push: EasemobPush,
    ImMessage: ImMessage
}