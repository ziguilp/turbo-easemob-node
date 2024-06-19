import { EasemobBase } from "./lib/easemob.base";
import { ImMessage } from "./lib/im/message";
import { EasemobPush } from "./lib/push";
import { EasemobUser } from "./lib/user";
declare const _default: {
    easemob: typeof EasemobBase;
    User: typeof EasemobUser;
    Push: typeof EasemobPush;
    ImMessage: typeof ImMessage;
};
export default _default;
