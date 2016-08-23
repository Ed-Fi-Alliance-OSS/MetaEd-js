"use strict";
class TestRuleProvider {
    constructor(validationRule) {
        this.validationRule = validationRule;
    }
    getAll(symbolTable) {
        return [this.validationRule];
    }
}
exports.TestRuleProvider = TestRuleProvider;
//# sourceMappingURL=TestRuleProvider.js.map