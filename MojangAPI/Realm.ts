import * as Request from "request-promise-native/";
import { Player } from "./Player";
import * as apiurls from "./apiurls.json";

// namespace MojangAPI {

export interface PlayerOnServer {
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

interface SlotOptions {
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
    world_type: string; //"NORMAL" | "MINIGAME" | "ADVENTUREMAP" | "EXPERIENCE" | "INSPIRATION";
  }
}

interface Subscription {
  startDate: number;
  daysLeft: number;
  subscriptionType: "NORMAL" | "RECURRING";
}

interface Download {
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

  private accessingPlayer: Player;

  constructor(_player: Player) {
    this.accessingPlayer = _player;
  }

  async get(): Promise<Realm> {
    return JSON.parse(await Request(await this.accessingPlayer.getConfig(this.processURL(apiurls.baseURL.java + apiurls.get.server.get))));
  }

  async getIP(): Promise<string> {
    try {
      let d: Download = JSON.parse(await Request(await this.accessingPlayer.getConfig(this.processURL(apiurls.baseURL.java + apiurls.get.server.ip))));
      return d.address;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
  async getBackups(): Promise<Backup[]> {
    let bs: Backup[] = JSON.parse(await Request(await this.accessingPlayer.getConfig(this.processURL(apiurls.baseURL.java + apiurls.get.server.backups)))).backups;
    return bs;
  }
  async getBackupDownload(_world: number): Promise<Download> {
    let d: Download = JSON.parse(await Request(await this.accessingPlayer.getConfig(this.processURL(apiurls.baseURL.java + apiurls.get.server.download, _world))));
    return d;
  }
  async getOPsUUIDs(): Promise<string[]> {
    return JSON.parse(await Request(await this.accessingPlayer.getConfig(this.processURL(apiurls.baseURL.java + apiurls.get.server.ops)))).ops;
  }
  async getSubscription(): Promise<Subscription> {
    return JSON.parse(await Request(await this.accessingPlayer.getConfig(this.processURL(apiurls.baseURL.java + apiurls.get.server.subscription))));
  }
  async invitePlayer(_playerName: string): Promise<Realm> {
    try {
      let realm: Realm = await Request(await this.postInvitePlayer(this.processURL(apiurls.baseURL.java + apiurls.post.server.add_user), this.accessingPlayer, _playerName));
      this.players = realm.players;
      return this;
    } catch (error) {
      console.log(error);
    }
    return null;
  }
  async removePlayer(_uuid: string): Promise<void> {
    await Request.delete(await this.postGeneric(this.processURL(apiurls.baseURL.java + apiurls.del.server.remove_user, 1, _uuid), this.accessingPlayer));
  }
  async opPlayer(_uuid: string): Promise<string[]> {
    return JSON.parse(await Request.post(await this.postGeneric(this.processURL(apiurls.baseURL.java + apiurls.post.server.op_user, 1, _uuid), this.accessingPlayer))).ops;
  }
  async deopPlayer(_uuid: string): Promise<void> {
    return JSON.parse(await Request.delete(await this.postGeneric(this.processURL(apiurls.baseURL.java + apiurls.del.server.deop_user, 1, _uuid), this.accessingPlayer))).ops;
  }
  // TODO
  // async switchToSlot(_slot: number): void { }
  // async resetActiveSlot(): void { }
  // async switchToMinigame(_m: Minigame): void { }

  async close(): Promise<any> {
    await Request.put(await this.postGeneric(this.processURL(apiurls.baseURL.java + apiurls.put.server.close), this.accessingPlayer));
    this.state = "CLOSED";
  }
  async open(): Promise<any> {
    await Request.put(await this.postGeneric(this.processURL(apiurls.baseURL.java + apiurls.put.server.open), this.accessingPlayer));
    this.state = "OPEN";
  }

  async getTemplates(_type: TEMPLATE_TYPE, _page: number = 1, _pageSize: number = 10): Promise<Templates> {
    let url: string = apiurls.baseURL.java + apiurls.get.template.get_templates;
    url = url.replace("$TEMPLATE", _type)
      .replace("$PAGE", _page.toString())
      .replace("$PAGE_SIZE", _pageSize.toString());
    console.log(url);
    return JSON.parse(await Request.get(await this.accessingPlayer.getConfig(url)));
  }

  private processURL(_url: string, _world: number = 0, _uuid: string = "12345"): string {
    let newURL: string = _url.replace("$SERVER_ID", this.id.toString())
      .replace("$WORLD", _world.toString())
      .replace("$UUID", _uuid)
      .replace("", "");
    return newURL;
  }

  private async postInvitePlayer(_url: string, _p: Player, _name: string): Promise<any> {
    let config = {
      url: _url,
      method: "POST",
      headers: {
        "Cookie": "sid=token:" + _p.accessToken + ":" + await _p.getUUID() + ";user=" + await _p.getName() + ";version=1.14.4", //TODO: don't hardcode the version. 
        name: "Content-Type",
        value: "application/json",
      },
      body: {
        name: _name
      },
      json: true
    }
    return config;
  }

  private async postGeneric(_url: string, _p: Player): Promise<any> {
    let config = {
      url: _url,
      headers: {
        "Cookie": "sid=token:" + _p.accessToken + ":" + await _p.getUUID() + ";user=" + await _p.getName() + ";version=1.14.4", //TODO: don't hardcode the version. 
      }
    }
    return config;
  }

}
// }