"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EasemobPush = exports.PushStrategy = void 0;
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
var PushStrategy;
(function (PushStrategy) {
    /**
     * 第三方厂商通道优先，失败时走环信通道。
     */
    PushStrategy[PushStrategy["THIRD_FIRST"] = 0] = "THIRD_FIRST";
    /**
     * 只走环信通道：若用户在线，则直接推送；若用户离线，消息会保留一段时间（视购买的套餐包而定），等用户上线后向其推送消息。若用户在超过消息存储期限时仍为上线，则丢弃消息。
     */
    PushStrategy[PushStrategy["ONLY_EASEMOB"] = 1] = "ONLY_EASEMOB";
    /**
     * 只走第三方厂商通道：若用户离线，消息保留时间视不同厂商而定。若推送失败，直接丢弃推送消息。
     */
    PushStrategy[PushStrategy["ONLY_THIRD"] = 2] = "ONLY_THIRD";
    /**
     * 只走环信通道且只推在线用户。离线用户收不到推送通知。
     */
    PushStrategy[PushStrategy["ONLY_ONLINE_EASEMOB"] = 3] = "ONLY_ONLINE_EASEMOB";
})(PushStrategy = exports.PushStrategy || (exports.PushStrategy = {}));
/**
 * 环信推送
 */
var EasemobPush = /** @class */ (function () {
    function EasemobPush(easeMob) {
        this.easeMob = easeMob;
    }
    /**
     * 调用该接口以异步方式为指定的单个或多个用户进行消息推送。
     * 推送的目标用户 ID。最多可传 100 个
     */
    EasemobPush.prototype.sendToUsers = function (userNames, pushMessage, strategy) {
        if (strategy === void 0) { strategy = PushStrategy.THIRD_FIRST; }
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.easeMob.request('/push/single', {
                            targets: userNames,
                            strategy: strategy,
                            pushMessage: pushMessage
                        })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data[0]];
                }
            });
        });
    };
    /**
     * 向单个标签内的所有用户推送通知
     */
    EasemobPush.prototype.sendToUsersByLabel = function (labelName, pushMessage, strategy) {
        if (strategy === void 0) { strategy = PushStrategy.THIRD_FIRST; }
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.easeMob.request('/push/list/label', {
                            targets: labelName,
                            strategy: strategy,
                            pushMessage: pushMessage
                        })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    /**
    * 调用该接口，服务端会创建一个推送任务，生成推送任务 ID，用于推送任务的数据统计。
    */
    EasemobPush.prototype.sendToAll = function (pushMessage, strategy) {
        if (strategy === void 0) { strategy = PushStrategy.THIRD_FIRST; }
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.easeMob.request('/push/task', {
                            strategy: strategy,
                            pushMessage: pushMessage
                        })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    return EasemobPush;
}());
exports.EasemobPush = EasemobPush;
//# sourceMappingURL=push.js.map