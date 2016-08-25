"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DescriptorPropertyMustMatchADescriptor extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var identifierToMatch = context.propertyName().GetText();
        var descriptorType = MetaEdGrammar.TokenName(MetaEdGrammar.DESCRIPTOR_ENTITY);
        return this._symbolTable.IdentifierExists(descriptorType, identifierToMatch);
    }
    getFailureMessage(context) {
        return `Descriptor property '${context.propertyName().GetText()}' does not match any declared descriptor.`;
    }
}
exports.DescriptorPropertyMustMatchADescriptor = DescriptorPropertyMustMatchADescriptor;
//# sourceMappingURL=DescriptorPropertyMustMatchADescriptor.js.map