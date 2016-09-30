import { ValidationRuleBase } from "./ValidationRuleBase";
import ValidationMessage from "../../common/ValidationMessage"
import {ISymbolTableBuilderListener, ITerminalNode} from "./ISymbolTableBuilderListener"
import {IMetaEdContext} from "../tasks/MetaEdContext"
import ParserRuleContext = MetaEdGrammar.ParserRuleContext;

export class CrossEntityTypeNamingValidator implements ISymbolTableBuilderListener {
    private _trackedEntityNames: ISet<string> = new HashSet<string>();
    private _context: IMetaEdContext;
    public withContext(context: IMetaEdContext): void {
        this._context = context;
    }
    public beforeAddEntity(candidateEntityType: string, candidateEntityNameIdNode: ITerminalNode, candidateContext: ParserRuleContext): boolean {
        if (candidateContext.IsExtensionContext())
            return true;
        if (candidateContext instanceof MetaEdGrammar.DomainContext
            || candidateContext instanceof MetaEdGrammar.SubdomainContext
            || candidateContext instanceof MetaEdGrammar.InterchangeContext
            || candidateContext instanceof MetaEdGrammar.EnumerationContext
            || candidateContext instanceof MetaEdGrammar.DescriptorContext)
            return true;

        if (this._trackedEntityNames.Contains(candidateEntityNameIdNode.getText())) {
            let metaEdFile = this._context.metaEdFileIndex.getFileAndLineNumber(candidateEntityNameIdNode.Symbol.Line);
            let failure: ValidationMessage = {
                message: `${candidateEntityType} named ${candidateEntityNameIdNode.getText()} is a duplicate declaration of that name.`,
                characterPosition: candidateEntityNameIdNode.Symbol.Column,
                concatenatedLineNumber: candidateEntityNameIdNode.Symbol.Line,
                fileName: metaEdFile.fileName,
                lineNumber: metaEdFile.lineNumber
            };
            this._context.errorMessageCollection.push(failure);
            return false;
        }
        this._trackedEntityNames.Add(candidateEntityNameIdNode.ToString());
        return true;
    }
    public reset(): void {
        this._trackedEntityNames.Clear();
    }
}
