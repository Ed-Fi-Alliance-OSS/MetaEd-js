using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var Association;
            (function (Association) {
                class SecondDomainEntityPropertyMustNotCollideWithOtherProperty {
                }
                ValidationRuleBase < MetaEdGrammar.SecondDomainEntityContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        SecondDomainEntityPropertyMustNotCollideWithOtherProperty(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, SecondDomainEntityContext = context) {
                            var identifierToMatch = context.IdText();
                            var withContextContext = context.withContext();
                            var withContextPrefix = withContextContext == null ? string.Empty : withContextContext.withContextName().ID().GetText();
                            var associationName = ((MetaEdGrammar.AssociationContext)), context, parent, associationName = ().IdText();
                            var associationType = MetaEdGrammar.TokenName(MetaEdGrammar.ASSOCIATION);
                            var entitySymbolTable = _symbolTable.Get(associationType, associationName);
                            return entitySymbolTable.PropertySymbolTable.Get(withContextPrefix + identifierToMatch) == null;
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, SecondDomainEntityContext = context) {
                            var associationName = ((MetaEdGrammar.AssociationContext)), context, parent, associationName = ().IdText();
                            return string.Format("Entity {0} has duplicate properties named {1}", associationName, context.IdText());
                        }
                    };
            })(Association = Validator.Association || (Validator.Association = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=SecondDomainEntityPropertyMustNotCollideWithOtherProperty.js.map