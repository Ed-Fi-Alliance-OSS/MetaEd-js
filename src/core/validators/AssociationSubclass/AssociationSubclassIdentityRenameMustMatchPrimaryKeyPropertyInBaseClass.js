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
            var AssociationSubclass;
            (function (AssociationSubclass) {
                class AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass {
                }
                ValidationRuleBase < MetaEdGrammar.AssociationSubclassContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, AssociationSubclassContext = context) {
                            var identityRenames = context.property().Where(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null)
                                .Select(y => y.GetProperty().propertyComponents().propertyAnnotation().identityRename());
                            if (!identityRenames.Any())
                                return true;
                            var entityType = context.ASSOCIATION().GetText();
                            var baseIdentifier = context.baseName().GetText();
                            var basePropertyIdentifier = identityRenames.First().baseKeyName().GetText();
                            var baseSymbolTable = _symbolTable.Get(entityType, baseIdentifier);
                            if (baseSymbolTable == null)
                                return true; // this will cause a validation failure somewhere else
                            var baseProperty = baseSymbolTable.PropertySymbolTable.Get(basePropertyIdentifier);
                            if (baseProperty == null)
                                return false;
                            return baseProperty.propertyComponents().propertyAnnotation().identity() != null;
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, AssociationSubclassContext = context) {
                            var identifier = context.associationName().GetText();
                            var baseIdentifier = context.baseName().GetText();
                            var identityRenames = context.property().Where(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null)
                                .Select(y => y.GetProperty().propertyComponents().propertyAnnotation().identityRename());
                            var basePropertyIdentifier = identityRenames.First().baseKeyName().GetText();
                            return string.Format("Association '{0}' based on '{1}' tries to rename {2} which is not part of the identity.", identifier, baseIdentifier, basePropertyIdentifier);
                        }
                    };
            })(AssociationSubclass = Validator.AssociationSubclass || (Validator.AssociationSubclass = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=AssociationSubclassIdentityRenameMustMatchPrimaryKeyPropertyInBaseClass.js.map