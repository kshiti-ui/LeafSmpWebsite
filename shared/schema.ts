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

export interface RankTier {
  id: string;
  name: string;
  price: number;
  color: string;
  icon: string;
  features: string[];
  description: string;
}
