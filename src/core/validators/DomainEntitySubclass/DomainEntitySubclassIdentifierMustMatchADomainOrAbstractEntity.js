var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var DomainEntitySubclass;
            (function (DomainEntitySubclass) {
                class DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var basedOnName = context.baseName().GetText();
                        return this._symbolTable.IdentifiersForEntityType(SymbolTableEntityType.DomainEntityEntityType()).Any(x => x.Equals(basedOnName)) || this._symbolTable.IdentifiersForEntityType(SymbolTableEntityType.AbstractEntityEntityType()).Any(x => x.Equals(basedOnName));
                    }
                    getFailureMessage(context) {
                        return string.Format("Domain Entity '{0}' based on '{1}' does not match any declared domain or abstract entity.", context.entityName().GetText(), context.baseName().GetText());
                    }
                }
                DomainEntitySubclass.DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity = DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity;
            })(DomainEntitySubclass = Validator.DomainEntitySubclass || (Validator.DomainEntitySubclass = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity.js.map