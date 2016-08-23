using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.DomainEntitySubclass
{
    public class DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity : ValidationRuleBase<MetaEdGrammar.DomainEntitySubclassContext>
    {
        private readonly ISymbolTable _symbolTable;

        public DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.DomainEntitySubclassContext context)
        {
            var anyIdentityRenames =
                context.property()
                    .Any(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null);
            if (!anyIdentityRenames)
                return true;

            var baseIdentifier = context.baseName().GetText();

            var baseSymbolTable = _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), baseIdentifier);
            if (baseSymbolTable == null)
                return true; // this will cause a validation failure somewhere else

            // Zero case is ok here because the Identity Property Reference check will handle that
            return
                baseSymbolTable.PropertySymbolTable.Values()
                    .Count(v => v.propertyComponents().propertyAnnotation().identity() != null) <= 1;
        }

        public override string GetFailureMessage(MetaEdGrammar.DomainEntitySubclassContext context)
        {
            var identifier = context.entityName().GetText();
            var baseIdentifier = context.baseName().GetText();
            
            return string.Format("Domain Entity '{0}' based on '{1}' is invalid for identity rename because parent entity '{1}' has more than one identity property.", identifier, baseIdentifier);
        }
    }
}
