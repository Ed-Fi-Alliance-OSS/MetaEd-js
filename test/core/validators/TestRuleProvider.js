"use strict";
class TestRuleProvider {
    constructor(ruleIndex, validationRule) {
        if (ruleIndex === undefined)
            throw new Error("undefined rule index in test");
        this.ruleIndex = ruleIndex;
        this.validationRule = validationRule;
    }
    getAll(ruleIndex, symbolTable) {
        return this.ruleIndex === ruleIndex ? [this.validationRule] : [];
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TestRuleProvider;
//# sourceMappingURL=TestRuleProvider.js.map