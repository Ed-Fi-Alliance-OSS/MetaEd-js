var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var Association;
            (function (Association) {
                class FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var identifierToMatch = context.IdText();
                        return this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
                    }
                    getFailureMessage(context) {
                        return string.Format("Domain Entity property '{0}' does not match any declared domain or abstract entity.", context.IdText());
                    }
                }
                Association.FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity = FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity;
            })(Association = Validator.Association || (Validator.Association = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity.js.map