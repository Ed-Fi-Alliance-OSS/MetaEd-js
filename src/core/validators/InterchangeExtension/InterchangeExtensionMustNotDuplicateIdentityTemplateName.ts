module MetaEd.Core.Validator.InterchangeExtension {
    export class InterchangeExtensionMustNotDuplicateIdentityTemplateName extends ValidationRuleBase<MetaEdGrammar.InterchangeExtensionContext>
    {
        private _symbolTable: ISymbolTable;
        constructor(symbolTable: ISymbolTable) {
            this._symbolTable = symbolTable;
        }
        private static duplicateIdentityTemplates(context: MetaEdGrammar.InterchangeExtensionContext): string[] {
            var identityTemplates = context.interchangeExtensionComponent().interchangeIdentityTemplate().Select(x => x.ID().GetText());
            return identityTemplates.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
        }
        public isValid(context: MetaEdGrammar.InterchangeExtensionContext): boolean {
            return !DuplicateIdentityTemplates(context).Any();
        }
        public getFailureMessage(context: MetaEdGrammar.InterchangeExtensionContext): string {
            var identifier = context.extendeeName().GetText();
            var duplicateIdentityTemplates = DuplicateIdentityTemplates(context);
            return string.Format("Interchange additions '{0}' declares duplicate identity template{2} '{1}'.", identifier, string.Join("', '", duplicateIdentityTemplates), duplicateIdentityTemplates.Count() > 1 ? "s" : string.Empty);
        }
    }
}