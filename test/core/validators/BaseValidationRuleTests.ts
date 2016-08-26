//TODO: This is an extension of BaseValidationTest which is a helper now so this needs to either become a separate helper and duplicate helper logic or something else.
import ValidationTestHelper from './ValidationTestHelper'
import {ValidatorListener} from '../../../src/core/validators/ValidatorListener'
import {IRuleProvider} from '../../../src/core/validators/RuleProvider'

let antlr4 = require('antlr4/index');

export default class ValidationRuleTestHelper extends ValidationTestHelper {
    public setupPostBuilder(ruleProvider: IRuleProvider): void {
        let validator = new ValidatorListener(ruleProvider);
        validator.withContext(this.metaEdContext);
        antlr4.tree.ParseTreeWalker.Default.Walk(validator, this.parserContext);
    }
}