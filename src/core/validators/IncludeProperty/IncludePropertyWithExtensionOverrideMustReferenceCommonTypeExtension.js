using;
MetaEd.Grammar.Antlr;
using;
MetaEd.Grammar.Antlr.Extensions;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var IncludeProperty;
            (function (IncludeProperty) {
                class IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension {
                }
                ValidationRuleBase < MetaEdGrammar.IncludePropertyContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, IncludePropertyContext = context) {
                            if (context.includeExtensionOverride() == null)
                                return true;
                            var identifierToMatch = context.propertyName().GetText();
                            return _symbolTable.IdentifierExists(SymbolTableEntityType.CommonTypeExtensionEntityType(), identifierToMatch);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, IncludePropertyContext = context) {
                            var topLevelEntity = context.GetAncestorContext();
                            var propertyWithComponents = context.GetAncestorContext();
                            return;
                            string.Format("'include extension' is invalid for property {0} on {1} '{2}'.  'include extension' is only valid for referencing common type extensions.", propertyWithComponents.IdNode().GetText(), topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName());
                        }
                    };
            })(IncludeProperty = Validator.IncludeProperty || (Validator.IncludeProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension.js.map