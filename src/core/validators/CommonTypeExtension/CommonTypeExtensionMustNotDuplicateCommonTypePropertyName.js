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
                class CommonTypeExtensionMustNotDuplicateCommonTypePropertyName {
                }
                ValidationRuleBase < MetaEdGrammar.CommonTypeExtensionContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        CommonTypeExtensionMustNotDuplicateCommonTypePropertyName(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, CommonTypeExtensionContext = context) {
                            var entityType = context.COMMON_TYPE().GetText();
                            var extensionType = context.COMMON_TYPE().GetText() + context.ADDITIONS();
                            var identifier = context.extendeeName().GetText();
                            // compare on symbol table identifiers
                            var commonTypePropertyIdentifiers = _symbolTable.IdentifiersForEntityProperties(entityType, identifier);
                            var extensionPropertyIdentifiers = _symbolTable.IdentifiersForEntityProperties(extensionType, identifier);
                            return !commonTypePropertyIdentifiers.Intersect(extensionPropertyIdentifiers).Any();
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, CommonTypeExtensionContext = context) {
                            var entityType = context.COMMON_TYPE().GetText();
                            var extensionType = context.COMMON_TYPE().GetText() + context.ADDITIONS();
                            var identifier = context.extendeeName().GetText();
                            // get real names for error message
                            var commonTypePropertyIdentifiers = _symbolTable.IdentifiersForEntityProperties(entityType, identifier).ToList();
                            var propertyRuleContextsForDuplicates = _symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, commonTypePropertyIdentifiers);
                            var duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.Select(x => x.IdNode().GetText());
                            return string.Format("Common Type additions '{0}' declares '{1}' already in property list of Common Type.", identifier, string.Join(",", duplicatePropertyIdentifierList));
                        }
                    };
            })(CommonTypeExtension = Validator.CommonTypeExtension || (Validator.CommonTypeExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=CommonTypeExtensionMustNotDuplicateCommonTypePropertyName.js.map