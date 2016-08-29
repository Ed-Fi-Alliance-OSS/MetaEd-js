"use strict";
class Version {
    format() {
        let version = this.majorVersion;
        if (this.minorVersion)
            version += "." + this.minorVersion;
        if (!this.revisionVersion)
            return version;
        if (Number(this.revisionVersion))
            version += ".";
        else
            version += " ";
        version += this.revisionVersion;
        return version;
    }
    formatForSchema() {
        let version = this.twoDigit(this.majorVersion);
        version += this.minorVersion;
        if (Number(this.minorVersion))
            version += "0";
        if (!this.revisionVersion)
            version += "-" + this.revisionVersion;
        else
            version += this.twoDigit(this.revisionVersion);
        return version;
    }
    twoDigit(num) {
        let n = Number(num);
        if (n > 0 && n <= 9)
            return "0" + num;
        return num;
    }
}
exports.Version = Version;
//# sourceMappingURL=Version.js.map