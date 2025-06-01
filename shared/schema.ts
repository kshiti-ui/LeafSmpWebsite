import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const serverStatus = pgTable("server_status", {
  id: serial("id").primaryKey(),
  ip: text("ip").notNull(),
  port: integer("port").notNull(),
  online: boolean("online").notNull().default(false),
  playerCount: integer("player_count").notNull().default(0),
  maxPlayers: integer("max_players").notNull().default(500),
  version: text("version"),
  lastChecked: timestamp("last_checked").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertServerStatusSchema = createInsertSchema(serverStatus).omit({
  id: true,
  lastChecked: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ServerStatus = typeof serverStatus.$inferSelect;
export type InsertServerStatus = z.infer<typeof insertServerStatusSchema>;

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  ticketNumber: text("ticket_number").notNull().unique(),
  minecraftUsername: text("minecraft_username").notNull(),
  discordUsername: text("discord_username").notNull(),
  selectedRank: text("selected_rank").notNull(),
  status: text("status").notNull().default("open"), // open, in_progress, closed
  priority: text("priority").notNull().default("normal"), // low, normal, high, urgent
  category: text("category").notNull().default("rank_purchase"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  adminNotes: text("admin_notes"),
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  ticketNumber: true,
  createdAt: true,
  updatedAt: true,
});

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;

export interface RankTier {
  id: string;
  name: string;
  price: number;
  color: string;
  icon: string;
  features: string[];
  description: string;
}
