import {IMetaEdContext} from "../tasks/MetaEdContext";

export interface IListenerWithContext {
    withContext(context: IMetaEdContext): void;
}