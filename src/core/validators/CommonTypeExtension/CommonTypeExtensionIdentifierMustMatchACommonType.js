using;
System.Linq;
using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var CommonTypeExtension;
            (function (CommonTypeExtension) {
                class CommonTypeExtensionIdentifierMustMatchACommonType {
                }
                ValidationRuleBase < MetaEdGrammar.CommonTypeExtensionContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        CommonTypeExtensionIdentifierMustMatchACommonType(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, CommonTypeExtensionContext = context) {
                            var entityType = context.COMMON_TYPE().GetText();
                            var identifier = context.extendeeName().GetText();
                            return _symbolTable.IdentifiersForEntityType(entityType).Any(x => x.Equals(identifier));
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, CommonTypeExtensionContext = context) {
                            return string.Format("Common Type additions '{0}' does not match any declared Common Type.", context.extendeeName().GetText());
                        }
                    };
            })(CommonTypeExtension = Validator.CommonTypeExtension || (Validator.CommonTypeExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=CommonTypeExtensionIdentifierMustMatchACommonType.js.map