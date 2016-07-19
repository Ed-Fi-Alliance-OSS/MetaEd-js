"use strict";
class StringHelper {
    static format(formatString, ...args) {
        let result = formatString;
        for (let i = 0; i < args.length; i++) {
            result = result.replace(new RegExp('\\{' + i + '\\}', 'gm'), args[i]);
        }
        return result;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StringHelper;
//# sourceMappingURL=StringHelper.js.map