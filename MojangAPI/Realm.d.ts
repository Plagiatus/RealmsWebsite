declare namespace MojangAPI {
    interface PlayerOnServer {
        uuid: string;
        name: string;
        operator: boolean;
        accepted: boolean;
        online: boolean;
        permission: "MEMBER" | "OPERATOR";
    }
    interface Slot {
        options: string;
        slotID: number;
    }
    interface Backup {
        backupId: string;
        lastModifiedDate: number;
        size: number;
        metadata: {
            game_difficulty: number;
            name: string;
            game_server_version: string;
            enabled_packs: string;
            description: string;
            game_mode: string;
            world_type: string;
        };
    }
    interface Subscription {
        startDate: number;
        daysLeft: number;
        subscriptionType: "NORMAL" | "RECURRING";
    }
    interface Download {
        downloadLink: string;
        resourcePackUrl: string;
        resourcePackHash: string;
    }
    interface Template {
        id: number;
        name: string;
        version: string;
        author: string;
        link: string;
        image: string;
        type: "NORMAL" | "MINIGAME" | "ADVENTUREMAP" | "EXPERIENCE" | "INSPIRATION";
    }
    interface Minigame extends Template {
    }
    class Realm {
        id: number;
        remoteSubscriptionId: string;
        owner: string;
        ownerUUID: string;
        name: string;
        motd: string;
        defaultPermission: "MEMBER";
        state: "ADMIN_LOCK" | "CLOSED" | "OPEN" | "UNINITIALIZED";
        daysLeft: number;
        expired: boolean;
        expiredTrial: boolean;
        gracePeriod: boolean;
        worldType: "NORMAL" | "MINIGAME" | "ADVENTUREMAP" | "EXPERIENCE" | "INSPIRATION";
        players: PlayerOnServer[];
        maxPlayers: number;
        minigameName: string;
        minigameId: number;
        minigameImage: string;
        activeSlot: 1 | 2 | 3 | 4;
        slots: Slot[];
        member: boolean;
        clubId: number;
        private accessingPlayer;
        getIP(): string;
        getBackups(): Backup[];
        getOPsUUIDs(): string[];
        getSubscription(): Subscription;
        invitePlayer(_player: PlayerOnServer): void;
        removePlayer(_player: PlayerOnServer): void;
        opPlayer(_player: PlayerOnServer): void;
        deopPlayer(_player: PlayerOnServer): void;
        switchToSlot(_s: 1 | 2 | 3 | 4): void;
        getDownload(_s: 1 | 2 | 3 | 4): Download;
        resetActiveSlot(): void;
        static getMinigames(): Template[];
        switchToMinigame(_m: Minigame): void;
    }
}
