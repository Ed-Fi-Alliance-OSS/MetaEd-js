declare class describe {
    static (description: string, spec: () => void): void;
}

declare class it {
    static (description: string, spec: () => void): void;
}

declare class before {
    static (spec: () => void): void;
}