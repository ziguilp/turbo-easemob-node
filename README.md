<!--
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2022-12-18 19:29:30
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2024-06-19 11:19:24
 * @FilePath      : /turbo-easemob-node/README.md
 * @Description   : 
 * 
 * Copyright (c) 2022 by turbo 664120459@qq.com, All Rights Reserved. 
-->
## 环信推送nodeserver简易版SDK 暂未接入环信IM其他环节
根据环信开放平台放出的文档简单处理，[原文档传送门](https://doc.easemob.com/document/server-side/account_system.html)


---
### 使用文档

```
yarn add turbo-easemob-node
```

``` Typescript
import ease from 'turbo-easemob-node'

/**
 * 创建easemob实例
 */
const easemob = new ease.easemob({
    appKey: '**********#demo',
    clientId: '********',
    clientSecret: '********',
    appName: 'demo',
    orgName: '******'
}, {
    set() {
        console.log(`set:`, arguments)
    },
    get() {
        return null
    }
});

try {
    // 用户体系
    const user = new ease.User(easemob);
    // 注册用户【推送和IM通用】
    user.createUser('test', '123456');
    // 修改密码
    user.modifyPassword('test', '1234567');
    // 读取用户信息
    user.getUserInfo('test')
    // 读取用户在线状态
    user.getUserStatus(['test']);

    // 推送体系
    const push = new ease.Push(easemob);
    // 推送给用户信息
    push.sendToUsers(['test'], {
        title: '测试',
        content: "这是一个测试信息",
        easemob: {
            style: 0,
            iconUrl: ""
        },
    })

    // 推送给指定标签下的用户信息
    push.sendToUsersByLabel('man', {
        title: '测试',
        content: "这是一个测试信息",
        easemob: {
            style: 0,
            iconUrl: ""
        },
    })

    // 推送给所有人
    push.sendToAll({
        title: '测试',
        content: "这是一个测试信息",
        easemob: {
            style: 0,
            iconUrl: ""
        },
    })

    // Im，只支持文本、透传、自定义消息类型
    const im = new ease.ImMessage(easemob);
    // 发送文本消息
    im.sendTxtMessage("这是文本消息");
    // 发送透传消息
    im.sendCmdMessage("action1");
    // 发送自定义消息
    im.sendCustomMessage("envent1", {
        param1: 'val1'
    });
} catch (error) {
    console.error(error)
}
```