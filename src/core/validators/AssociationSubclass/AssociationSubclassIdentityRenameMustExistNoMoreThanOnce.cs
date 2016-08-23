using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.AssociationSubclass
{
    public class AssociationSubclassIdentityRenameMustExistNoMoreThanOnce : ValidationRuleBase<MetaEdGrammar.AssociationSubclassContext>
    {
        public override bool IsValid(MetaEdGrammar.AssociationSubclassContext context)
        {
            var identityRenameCount = context.property()
                .Count(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null);
            return identityRenameCount <= 1;
        }

        public override string GetFailureMessage(MetaEdGrammar.AssociationSubclassContext context)
        {
            var identifier = context.associationName().GetText();
            var baseIdentifier = context.baseName().GetText();

            var identityRenames = context.property()
                .Select(y => y.GetProperty().propertyComponents().propertyAnnotation().identityRename())
                .Where(x => x != null);
            var basePropertyIdentifier = string.Join(", ", identityRenames.Select(pkr => pkr.baseKeyName().GetText()));
            
            return string.Format("Association '{0}' based on '{1}' tries to rename columns {2}.  Only one identity rename is allowed for a given Association.", identifier, baseIdentifier, basePropertyIdentifier);
        }
    }
}
