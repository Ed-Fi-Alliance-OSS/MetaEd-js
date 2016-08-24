import { ValidationRuleBase } from "../ValidationRuleBase";
    export class InterchangeMustNotDuplicateIdentityTemplateName extends ValidationRuleBase<MetaEdGrammar.InterchangeContext>
    {
        private _symbolTable: ISymbolTable;
        constructor(symbolTable: ISymbolTable) {
            this._symbolTable = symbolTable;
        }
        private static duplicateIdentityTemplates(context: MetaEdGrammar.InterchangeContext): string[] {
            var identityTemplates = context.interchangeComponent().interchangeIdentityTemplate().Select(x => x.ID().GetText());
            return identityTemplates.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
        }
        public isValid(context: MetaEdGrammar.InterchangeContext): boolean {
            return !DuplicateIdentityTemplates(context).Any();
        }
        public getFailureMessage(context: MetaEdGrammar.InterchangeContext): string {
            var identifier = context.interchangeName().GetText();
            var duplicateIdentityTemplates = DuplicateIdentityTemplates(context);
            return string.Format("Interchange '{0}' declares duplicate identity template{2} '{1}'.", identifier, string.Join("', '", duplicateIdentityTemplates), duplicateIdentityTemplates.Count() > 1 ? "s" : string.Empty);
        }
    }
