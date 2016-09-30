import {MetaEdFile} from '../../grammar/MetaEdFile'

export class FilesToLoad {
    private _files: MetaEdFile[];
    public namespace: string;
    public projectExtension: string;
    public isExtension: boolean;
    
    public get files(): MetaEdFile[] {
        return this._files;
    }

    constructor() {
        this._files = [];
    }
}