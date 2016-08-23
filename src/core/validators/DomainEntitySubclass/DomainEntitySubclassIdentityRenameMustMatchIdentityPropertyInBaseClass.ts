using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.DomainEntitySubclass
{
    public class DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass : ValidationRuleBase<MetaEdGrammar.DomainEntitySubclassContext>
    {
        private readonly ISymbolTable _symbolTable;

        public DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.DomainEntitySubclassContext context)
        {
            var identityRenames = context.property().Where(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null)
                                                      .Select(y => y.GetProperty().propertyComponents().propertyAnnotation().identityRename());
            if (!identityRenames.Any())
                return true;

            var entityType = context.DOMAIN_ENTITY().GetText();
            var baseIdentifier = context.baseName().GetText();
            var basePropertyIdentifier = identityRenames.First().baseKeyName().GetText();

            var baseSymbolTable = _symbolTable.Get(entityType, baseIdentifier);
            if (baseSymbolTable == null)
                return true; // this will cause a validation failure somewhere else

            var baseProperty = baseSymbolTable.PropertySymbolTable.Get(basePropertyIdentifier);
            if (baseProperty == null)
                return false;

            return baseProperty.propertyComponents().propertyAnnotation().identity() != null;
        }

        public override string GetFailureMessage(MetaEdGrammar.DomainEntitySubclassContext context)
        {
            var identifier = context.entityName().GetText();
            var baseIdentifier = context.baseName().GetText();

            var identityRenames = context.property().Where(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null)
                                                      .Select(y => y.GetProperty().propertyComponents().propertyAnnotation().identityRename());
            var basePropertyIdentifier = identityRenames.First().baseKeyName().GetText();
            
            return string.Format("DomainEntity '{0}' based on '{1}' tries to rename {2} which is not part of the identity.", identifier, baseIdentifier, basePropertyIdentifier);
        }
    }
}
