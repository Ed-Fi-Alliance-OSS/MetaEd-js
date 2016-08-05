export class MetaEdFile {
    private _contents: string;
    private _lineCount: number;

    public directoryName: string;
    public fileName: string;

    public get Contents(): string { return this._contents }

    public set Contents(value: string) {
        this._contents = value;
        if (this._contents == null)
            this._contents = "";

        if (!this._contents.endsWith("\n"))
            this._contents += "\n";
        this._lineCount = this._contents.split("\n").length - 1;
    }

    public get FullName(): string {
        if (this.directoryName == null || this.directoryName == "")
            return this.fileName;

        return `${this.directoryName}/${this.fileName}`;
    }

    public get LineCount(): number { return this._lineCount; }

    public constructor(directoryName: string, fileName: string, contents: string) {
        this.directoryName = directoryName;
        this.fileName = fileName;
        this._contents = contents;
    }
}