import { ValidationRuleBase } from "../ValidationRuleBase";
export class InterchangeMustNotDuplicateInterchangeElementName extends ValidationRuleBase<MetaEdGrammar.InterchangeContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    private static duplicateInterchangeElements(context: MetaEdGrammar.InterchangeContext): string[] {
        var interchangeElements = context.interchangeComponent().interchangeElement().Select(x => x.ID().GetText());
        return interchangeElements.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    public isValid(context: MetaEdGrammar.InterchangeContext): boolean {
        return !DuplicateInterchangeElements(context).Any();
    }
    public getFailureMessage(context: MetaEdGrammar.InterchangeContext): string {
        var identifier = context.interchangeName().GetText();
        var duplicateInterchangeElements = DuplicateInterchangeElements(context);
        return string.Format("Interchange '{0}' declares duplicate interchange element{2} '{1}'.", identifier, string.Join("', '", duplicateInterchangeElements), duplicateInterchangeElements.Count() > 1 ? "s" : string.Empty);
    }
}
