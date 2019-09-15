export interface Status {
    [name: string]: "green" | "yellow" | "red";
}
export interface Names {
    [i: number]: {
        name: string;
        changedToAt: number;
    };
}
export declare class API {
    private static status;
    static getStatus(): Promise<Status[]>;
    static getUUIDFromName(_name: string): Promise<string>;
    static getNamesFromUUID(_uuid: string): Promise<Names>;
}
