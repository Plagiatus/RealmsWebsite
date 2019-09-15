declare namespace MojangAPI {
    interface Name {
        name: string;
        changedToAt: number;
    }
    class Player {
        name: string;
        uuid: string;
        accessToken: string;
        constructor();
        getUUID(): void;
        getName(): void;
        authenticate(): void;
        refreshToken(): void;
        validate(): void;
        signout(): void;
        invalidate(): void;
        getNameHistory(): Name[];
        setSkin(): void;
        resetSkin(): void;
        getRealmsInviteAmount(): number;
    }
}
