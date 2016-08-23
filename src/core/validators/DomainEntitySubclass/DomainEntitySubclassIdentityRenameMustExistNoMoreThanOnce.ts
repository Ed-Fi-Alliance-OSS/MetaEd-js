using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.DomainEntitySubclass
{
    public class DomainEntitySubclassIdentityRenameMustExistNoMoreThanOnce : ValidationRuleBase<MetaEdGrammar.DomainEntitySubclassContext>
    {
        public override bool IsValid(MetaEdGrammar.DomainEntitySubclassContext context)
        {
            var identityRenameCount = context.property()
                .Count(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null);
            return identityRenameCount <= 1;
        }

        public override string GetFailureMessage(MetaEdGrammar.DomainEntitySubclassContext context)
        {
            var identifier = context.entityName().GetText();
            var baseIdentifier = context.baseName().GetText();

            var identityRenames = context.property()
                .Select(y => y.GetProperty().propertyComponents().propertyAnnotation().identityRename())
                .Where(x => x != null);
            var basePropertyIdentifier = string.Join(", ", identityRenames.Select(pkr => pkr.baseKeyName().GetText()));
            
            return string.Format("Domain Entity '{0}' based on '{1}' tries to rename columns {2}.  Only one identity rename is allowed for a given Domain Entity.", identifier, baseIdentifier, basePropertyIdentifier);
        }
    }
}
