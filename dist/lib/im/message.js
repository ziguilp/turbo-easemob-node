"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.ImMessage = exports.ImMsgType = void 0;
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
var ImMsgType;
(function (ImMsgType) {
    /** 文本消息 */
    ImMsgType["TEXT"] = "txt";
    /** 图片消息 */
    ImMsgType["IMAGE"] = "img";
    /** 语音消息 */
    ImMsgType["AUDIO"] = "audio";
    /** 视频消息 */
    ImMsgType["VIDEO"] = "video";
    /** 文件消息 */
    ImMsgType["FILE"] = "file";
    /** 位置消息 */
    ImMsgType["LOC"] = "loc";
    /** 透传消息 */
    ImMsgType["CMD"] = "cmd";
    /** 自定义消息 */
    ImMsgType["CUSTOM"] = "custom";
})(ImMsgType = exports.ImMsgType || (exports.ImMsgType = {}));
/**
 * 环信Im单聊消息
 */
var ImMessage = /** @class */ (function () {
    function ImMessage(easeMob) {
        /**
         * 消息发送方的用户 ID。若不传入该字段，服务器默认设置为 admin。
         * ### 1、服务器不校验传入的用户 ID 是否存在，因此，如果你传入的用户 ID 不存在，服务器并不会提示，仍照常发送消息。
         * ### 2、若传入字段但值为空字符串 (“”)，请求失败。
         */
        this.from = 'admin';
        /**
         * 消息接收方的用户 ID 数组。每次最多可向 600 个用户发送消息。
         * ### 服务器不校验传入的用户 ID 是否存在，因此，如果你传入的用户 ID 不存在，服务器并不会提示，仍照常发送消息。
         */
        this.to = [];
        this.msgType = ImMsgType.TEXT;
        this.msgBody = {};
        this.msgExt = {};
        this.easeMob = easeMob;
    }
    ImMessage.prototype.setFrom = function (username) {
        this.from = username;
    };
    ImMessage.prototype.setReceiver = function (username) {
        this.to = [username];
    };
    ImMessage.prototype.addReceiver = function () {
        var usernames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            usernames[_i] = arguments[_i];
        }
        this.to = this.to.concat(usernames);
    };
    ImMessage.prototype.setExt = function (ext) {
        this.msgExt = ext;
    };
    ImMessage.prototype.addExt = function (ext) {
        this.msgExt = __assign(__assign({}, this.msgExt), ext);
    };
    ImMessage.prototype.send = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.easeMob.request('/messages/users', {
                            from: this.from,
                            to: this.to,
                            type: this.msgType,
                            body: this.msgBody,
                            sync_device: true,
                            ext: __assign({ em_ignore_notification: false }, this.msgExt)
                        })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    /**
     * 发送文本消息
     */
    ImMessage.prototype.sendTxtMessage = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.msgType = ImMsgType.TEXT;
                        this.msgBody = {
                            msg: msg
                        };
                        return [4 /*yield*/, this.send()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 发送透传消息
     * @param cmd 命令内容
     */
    ImMessage.prototype.sendCmdMessage = function (cmd) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.msgType = ImMsgType.CMD;
                        this.msgBody = {
                            action: cmd
                        };
                        return [4 /*yield*/, this.send()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 发送自定义消息
     * @param customEvent 用户自定义的事件类型。该参数的值必须满足正则表达式 [a-zA-Z0-9-_/\.]{1,32}，长度为 1-32 个字符
     * @param customExts 用户自定义的事件属性，类型必须是 Map<String,String>，最多可以包含 16 个元素。customExts 是可选的，不需要可以不传
     */
    ImMessage.prototype.sendCustomMessage = function (customEvent, customExts) {
        if (customExts === void 0) { customExts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.msgType = ImMsgType.CUSTOM;
                        this.msgBody = {
                            customEvent: customEvent,
                            customExts: customExts
                        };
                        return [4 /*yield*/, this.send()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return ImMessage;
}());
exports.ImMessage = ImMessage;
//# sourceMappingURL=message.js.map