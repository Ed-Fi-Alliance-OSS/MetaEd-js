using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var DescriptorProperty;
            (function (DescriptorProperty) {
                class DescriptorPropertyMustMatchADescriptor {
                }
                ValidationRuleBase < MetaEdGrammar.DescriptorPropertyContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        DescriptorPropertyMustMatchADescriptor(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, DescriptorPropertyContext = context) {
                            var identifierToMatch = context.propertyName().GetText();
                            var descriptorType = MetaEdGrammar.TokenName(MetaEdGrammar.DESCRIPTOR_ENTITY);
                            return _symbolTable.IdentifierExists(descriptorType, identifierToMatch);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, DescriptorPropertyContext = context) {
                            return string.Format("Descriptor property '{0}' does not match any declared descriptor.", context.propertyName().GetText());
                        }
                    };
            })(DescriptorProperty = Validator.DescriptorProperty || (Validator.DescriptorProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DescriptorPropertyMustMatchADescriptor.js.map