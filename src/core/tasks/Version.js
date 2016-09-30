
export interface IVersion {
    majorVersion: string;
    minorVersion: string;
    revisionVersion: string;
    format(): string;
    formatForSchema(): string;
}

export class Version implements IVersion {
    public majorVersion: string;
    public minorVersion: string;
    public revisionVersion: string;

    public format(): string {
        let version = this.majorVersion;
        if (this.minorVersion)
            version += "." + this.minorVersion;
        if (!this.revisionVersion)
            return version;
        if (Number(this.revisionVersion))
            version += "."
        else
            version += " "
        version += this.revisionVersion
        return version
    }

    public formatForSchema(): string {
        let version: string = this.twoDigit(this.majorVersion)
            version += this.minorVersion
        if (Number(this.minorVersion))
            version += "0";
        if (!this.revisionVersion)
            version += "-" + this.revisionVersion
        else 
            version += this.twoDigit(this.revisionVersion);
        return version;
    }

    public twoDigit(num: string): string {
        let n = Number(num);
        if (n > 0 && n <= 9)
            return "0" + num;
        return num;
    }
}