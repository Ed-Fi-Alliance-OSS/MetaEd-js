"use strict";
//TODO: This is an extension of BaseValidationTest which is a helper now so this needs to either become a separate helper and duplicate helper logic or something else.
const ValidationTestHelper_1 = require('./ValidationTestHelper');
const ValidatorListener_1 = require('../../../src/core/validators/ValidatorListener');
let antlr4 = require('antlr4/index');
class ValidationRuleTestHelper extends ValidationTestHelper_1.default {
    setupPostBuilder(ruleProvider) {
        let validator = new ValidatorListener_1.ValidatorListener(ruleProvider);
        validator.withContext(this.metaEdContext);
        antlr4.tree.ParseTreeWalker.Default.Walk(validator, this.parserContext);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ValidationRuleTestHelper;
//# sourceMappingURL=BaseValidationRuleTests.js.map