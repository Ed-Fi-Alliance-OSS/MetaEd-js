using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.MergePartOfReference
{
    public class MergeStatementMustStartMergePathWithPropertyName : ValidationRuleBase<MetaEdGrammar.MergePartOfReferenceContext>
    {
        public override bool IsValid(MetaEdGrammar.MergePartOfReferenceContext context)
        {
            var parent = context.Parent as MetaEdGrammar.ReferencePropertyContext;
            if (parent == null)
                return false;

            var referenceName = parent.propertyName().IdText();

            return context.mergePropertyPath().propertyPath().PropertyPathParts()[0] == referenceName;
        }

        public override string GetFailureMessage(MetaEdGrammar.MergePartOfReferenceContext context)
        {
            return "Merge statement must start first property path with the referenced entity name of the current property.";
        }
    }
}