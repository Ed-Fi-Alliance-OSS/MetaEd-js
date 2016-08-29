"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DescriptorPropertyMustMatchADescriptor extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let identifierToMatch = context.propertyName().GetText();
        let descriptorType = MetaEdGrammar.TokenName(MetaEdGrammar.DESCRIPTOR_ENTITY);
        return this.symbolTable.identifierExists(descriptorType, identifierToMatch);
    }
    getFailureMessage(context) {
        return `Descriptor property '${context.propertyName().GetText()}' does not match any declared descriptor.`;
    }
}
exports.DescriptorPropertyMustMatchADescriptor = DescriptorPropertyMustMatchADescriptor;
//# sourceMappingURL=DescriptorPropertyMustMatchADescriptor.js.map