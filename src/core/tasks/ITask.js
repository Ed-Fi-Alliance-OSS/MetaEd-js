import {IMetaEdContext} from './MetaEdContext';

declare type Type = any;//System.Type

export interface ITask {
  name: string,
  prerequisite: Type,
  executeTask(context: IMetaEdContext): boolean
}
