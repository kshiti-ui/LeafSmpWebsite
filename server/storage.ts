import { users, serverStatus, tickets, type User, type InsertUser, type ServerStatus, type InsertServerStatus, type Ticket, type InsertTicket } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getServerStatus(): Promise<ServerStatus | undefined>;
  updateServerStatus(status: InsertServerStatus): Promise<ServerStatus>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  getUserTickets(minecraftUsername: string, discordUsername: string): Promise<Ticket[]>;
  getAllTickets(): Promise<Ticket[]>;
  updateTicket(id: number, updates: Partial<Ticket>): Promise<Ticket | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tickets: Map<number, Ticket>;
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
  private ticketCounter: number;

  constructor() {
    this.users = new Map();
    this.tickets = new Map();
    this.currentId = 1;
    this.ticketCounter = 1;

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

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = this.currentId++;
    const ticketNumber = `LEAF-${this.ticketCounter.toString().padStart(4, '0')}`;
    this.ticketCounter++;

    const ticket: Ticket = {
      ...insertTicket,
      id,
      ticketNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tickets.set(id, ticket);
    return ticket;
  }

  async getUserTickets(minecraftUsername: string, discordUsername: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(
      ticket => ticket.minecraftUsername === minecraftUsername && 
                ticket.discordUsername === discordUsername
    );
  }

  async getAllTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values());
  }

  async updateTicket(id: number, updates: Partial<Ticket>): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;

    const updatedTicket: Ticket = {
      ...ticket,
      ...updates,
      updatedAt: new Date(),
    };

    this.tickets.set(id, updatedTicket);
    return updatedTicket;
  }
}

export const storage = new MemStorage();