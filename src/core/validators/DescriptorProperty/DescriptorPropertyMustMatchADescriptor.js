var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var DescriptorProperty;
            (function (DescriptorProperty) {
                class DescriptorPropertyMustMatchADescriptor extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var identifierToMatch = context.propertyName().GetText();
                        var descriptorType = MetaEdGrammar.TokenName(MetaEdGrammar.DESCRIPTOR_ENTITY);
                        return this._symbolTable.IdentifierExists(descriptorType, identifierToMatch);
                    }
                    getFailureMessage(context) {
                        return string.Format("Descriptor property '{0}' does not match any declared descriptor.", context.propertyName().GetText());
                    }
                }
                DescriptorProperty.DescriptorPropertyMustMatchADescriptor = DescriptorPropertyMustMatchADescriptor;
            })(DescriptorProperty = Validator.DescriptorProperty || (Validator.DescriptorProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DescriptorPropertyMustMatchADescriptor.js.map