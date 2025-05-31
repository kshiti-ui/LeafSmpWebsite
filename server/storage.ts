import { users, serverStatus, type User, type InsertUser, type ServerStatus, type InsertServerStatus } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getServerStatus(): Promise<ServerStatus | undefined>;
  updateServerStatus(status: InsertServerStatus): Promise<ServerStatus>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private serverStatusData: ServerStatus | null = {
    id: 1,
    ip: "play.leafsmp.org",
    port: 25590,
    online: false,
    playerCount: 0,
    maxPlayers: 500,
    version: "1.20.x",
    lastChecked: new Date(),
  };
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;

    // Initialize with default server status
    this.serverStatusData = {
      id: 1,
      ip: "play.leafsmp.org",
      port: 25590,
      online: true,
      playerCount: 362,
      maxPlayers: 500,
      version: "1.21.1",
      lastChecked: new Date(),
    };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getServerStatus(): Promise<ServerStatus | undefined> {
    return this.serverStatusData;
  }

  async updateServerStatus(status: InsertServerStatus): Promise<ServerStatus> {
    this.serverStatusData = {
      id: 1,
      ...status,
      lastChecked: new Date(),
    };
    return this.serverStatusData;
  }
}

export const storage = new MemStorage();