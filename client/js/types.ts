namespace RealmPage {
  export interface PlayerOnServer {
    uuid: string;
    name: string;
    operator: boolean;
    accepted: boolean;
    online: boolean;
    permission: "MEMBER" | "OPERATOR";
  }

  export interface Slot {
    options: string;
    slotID: number;
  }

  export interface SlotOptions {
    slotName: string;
    pvp: boolean;
    spawnAnimals: boolean;
    spawnMonsters: boolean;
    spawnNPCs: boolean;
    spawnProtection: number;
    commandBlocks: boolean;
    forceGameMode: boolean;
    gameMode: number;
    difficulty: number;
    worldTemplateId: number;
    worldTemplateImage: string;
    adventureMap: boolean;
    resourcePackHash: string;
    incompatibilities: [];
    versionRef: string;
    versionLock: boolean;
    cheatsAllowed: boolean;
    texturePacksRequired: boolean;
    enabledPacks: {
      resourcePacks: [];
      behaviourPacks: [];
      customGameServerGlobalProperties: any;
    }
  }

  export interface Backup {
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
      world_type: string; //"NORMAL" | "MINIGAME" | "ADVENTUREMAP" | "EXPERIENCE" | "INSPIRATION";
    }
  }

  export interface Subscription {
    startDate: number;
    daysLeft: number;
    subscriptionType: "NORMAL" | "RECURRING";
  }

  export interface Download {
    address: string;
    downloadLink: string;
    resourcePackUrl: string;
    resourcePackHash: string;
  }

  export interface Template {
    id: number;
    name: string;
    version: string;
    author: string;
    link: string;
    image: string;
    type: TEMPLATE_TYPE;
  }

  export enum TEMPLATE_TYPE {
    "NORMAL" = "NORMAL",
    "MINIGAME" = "MINIGAME",
    "ADVENTUREMAP" = "ADVENTUREMAP",
    "EXPERIENCE" = "EXPERIENCE",
    "INSPIRATION" = "INSPIRATION"
  }

  export interface Templates {
    templates: Template[];
    page: number;
    size: number;
    total: number;
  }

  export interface Invite {
    invitationId: number;
    worldName: string;
    worldDescription: string;
    worldOwnerName: string;
    wolrdOwnerUuid: string;
    date: number
  }

  export class Realm {
    id: number;
    remoteSubscriptionId: string;
    owner: string;
    ownerUUID: string;
    name: string;
    motd: string;
    defaultPermission: "MEMBER"
    state: "ADMIN_LOCK" | "CLOSED" | "OPEN" | "UNINITIALIZED";
    daysLeft: number;
    expired: boolean;
    expiredTrial: boolean;
    gracePeriod: boolean;
    worldType: TEMPLATE_TYPE;
    players: PlayerOnServer[];
    maxPlayers: number;
    minigameName: string;
    minigameId: number;
    minigameImage: string;
    activeSlot: 1 | 2 | 3 | 4;
    slots: Slot[];
    member: boolean;
    clubId: number;
  }

  export interface Name {
    name: string;
    changedToAt: number;
  }
  export class Player {
    name: string;
    uuid: string;
    accessToken: string;
    email: string;
    password: string;
  }
}