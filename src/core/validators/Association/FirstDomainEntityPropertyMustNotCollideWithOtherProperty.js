var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var Association;
            (function (Association) {
                class FirstDomainEntityPropertyMustNotCollideWithOtherProperty extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var identifierToMatch = context.IdText();
                        var withContextContext = context.withContext();
                        var withContextPrefix = withContextContext == null ? string.Empty : withContextContext.withContextName().ID().GetText();
                        var associationName = context.parent.associationName().IdText();
                        var associationType = MetaEdGrammar.TokenName(MetaEdGrammar.ASSOCIATION);
                        var entitySymbolTable = this._symbolTable.Get(associationType, associationName);
                        return entitySymbolTable.PropertySymbolTable.Get(withContextPrefix + identifierToMatch) == null;
                    }
                    getFailureMessage(context) {
                        var associationName = context.parent.associationName().IdText();
                        return string.Format("Entity {0} has duplicate properties named {1}", associationName, context.IdText());
                    }
                }
                Association.FirstDomainEntityPropertyMustNotCollideWithOtherProperty = FirstDomainEntityPropertyMustNotCollideWithOtherProperty;
            })(Association = Validator.Association || (Validator.Association = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=FirstDomainEntityPropertyMustNotCollideWithOtherProperty.js.map