"use strict";
class TestRuleProvider {
    constructor(ruleIndex, validationRule) {
        this.ruleIndex = ruleIndex;
        this.validationRule = validationRule;
    }
    getAll(ruleIndex, symbolTable) {
        return this.ruleIndex === ruleIndex ? [this.validationRule] : [];
    }
}
exports.TestRuleProvider = TestRuleProvider;
//# sourceMappingURL=TestRuleProvider.js.map