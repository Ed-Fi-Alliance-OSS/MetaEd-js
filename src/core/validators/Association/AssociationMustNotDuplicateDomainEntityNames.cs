using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.Association
{
    public class AssociationMustNotDuplicateDomainEntityNames : ValidationRuleBase<MetaEdGrammar.AssociationContext>
    {
        public override bool IsValid(MetaEdGrammar.AssociationContext context)
        {
            var firstDomainEntityName = context.firstDomainEntity().IdText();
            var secondDomainEntityName = context.secondDomainEntity().IdText();

            if (!firstDomainEntityName.Equals(secondDomainEntityName)) return true;

            // need to check 'with context' for naming collisions
            var firstContext = context.firstDomainEntity().withContext();
            var secondContext = context.secondDomainEntity().withContext();

            var firstContextName = firstContext == null ? string.Empty : firstContext.withContextName().ID().GetText();
            var secondContextName = secondContext == null ? string.Empty : secondContext.withContextName().ID().GetText();

            return !firstContextName.Equals(secondContextName);
        }

        public override string GetFailureMessage(MetaEdGrammar.AssociationContext context)
        {
            var identifier = context.associationName().GetText();
            var firstDomainEntityName = context.firstDomainEntity().IdText();

            return string.Format("Association '{0}' has duplicate declarations of Domain Entity '{1}'.", identifier, firstDomainEntityName);
        }
    }
}
