"use strict";
/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2024-06-17 17:43:00
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2024-06-20 11:18:42
 * @FilePath      : /turbo-easemob-node/src/lib/easemob.base.ts
 * @Description   :
 *
 * Copyright (c) 2024 by turbo 664120459@qq.com, All Rights Reserved.
 */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EasemobBase = void 0;
var axios_1 = __importDefault(require("axios"));
var ioredis_1 = __importDefault(require("ioredis"));
var node_cache_1 = __importDefault(require("node-cache"));
var EasemobBase = /** @class */ (function () {
    function EasemobBase(conf, cachehandle) {
        this.host = 'https://a1.easemob.com';
        this.token = undefined;
        this.conf = conf;
        if (!cachehandle) {
            cachehandle = new node_cache_1.default();
        }
        this.cache = cachehandle;
    }
    EasemobBase.prototype.getUri = function (uri) {
        if (!uri.startsWith("/")) {
            uri = "/".concat(uri);
        }
        return "".concat(this.host, "/").concat(this.conf.orgName, "/").concat(this.conf.appName).concat(uri);
    };
    EasemobBase.prototype.getAuthToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var key, cache, cacheToken, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.token && this.token.expires > ((new Date()).getTime() / 1000)) {
                            return [2 /*return*/, this.token.accessToken];
                        }
                        key = "easemob-authtoken:".concat(this.conf.appKey);
                        return [4 /*yield*/, this.cache.get(key)];
                    case 1:
                        cache = _a.sent();
                        if (cache) {
                            cacheToken = 'string' == typeof cache ? JSON.parse(cache) : cache;
                            this.token = cacheToken;
                            return [2 /*return*/, cacheToken.accessToken];
                        }
                        return [4 /*yield*/, this.request(this.getUri('/token'), {
                                grant_type: "client_credentials",
                                client_id: this.conf.clientId,
                                client_secret: this.conf.clientSecret,
                                // token 有效期，单位为秒。
                                ttl: 86400
                            })];
                    case 2:
                        res = _a.sent();
                        if (res.access_token) {
                            this.token = {
                                accessToken: res.access_token,
                                expires: Math.round((new Date()).getTime() / 1000 + 86100)
                            };
                            if (this.cache instanceof ioredis_1.default) {
                                this.cache.set(key, JSON.stringify(this.token), 'EX', 86100);
                            }
                            else {
                                this.cache.set(key, this.token, 86100);
                            }
                            return [2 /*return*/, this.token.accessToken];
                        }
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    /**
     *
     * @param uri
     */
    EasemobBase.prototype.request = function (uri, body, method) {
        if (body === void 0) { body = {}; }
        if (method === void 0) { method = 'POST'; }
        return __awaiter(this, void 0, void 0, function () {
            var headers, _a, _b, _c, res;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log("\u53D1\u5904", uri);
                        if (!uri.startsWith("https://") && !uri.startsWith("http://")) {
                            uri = this.getUri(uri);
                        }
                        console.log("\u53D1\u59041", uri);
                        headers = {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        };
                        if (!!uri.endsWith("/token")) return [3 /*break*/, 2];
                        _a = headers;
                        _b = 'Authorization';
                        _c = "Bearer ".concat;
                        return [4 /*yield*/, this.getAuthToken()];
                    case 1:
                        _a[_b] = _c.apply("Bearer ", [_d.sent()]);
                        _d.label = 2;
                    case 2: return [4 /*yield*/, axios_1.default.request({
                            url: uri,
                            method: method,
                            data: body,
                            headers: headers
                        })];
                    case 3:
                        res = _d.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    return EasemobBase;
}());
exports.EasemobBase = EasemobBase;
//# sourceMappingURL=easemob.base.js.map