import { pgTable, text, serial, integer, timestamp, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const officers = pgTable("officers", {
  id: serial("id").primaryKey(),
  discordId: text("discord_id").notNull().unique(),
  username: text("username").notNull(),
  hoursOnDuty: real("hours_on_duty").notNull().default(0),
  robberiesHandled: integer("robberies_handled").notNull().default(0),
  score: integer("score").notNull().default(0),
  status: text("status").notNull().default("off_duty"), // active, on_duty, off_duty, suspended
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const commandLogs = pgTable("command_logs", {
  id: serial("id").primaryKey(),
  discordId: text("discord_id").notNull(),
  command: text("command").notNull(),
  username: text("username").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const systemStatus = pgTable("system_status", {
  id: serial("id").primaryKey(),
  service: text("service").notNull(), // discord_bot, api_server, web_server
  status: text("status").notNull(), // online, offline, error
  lastChecked: timestamp("last_checked").defaultNow().notNull(),
});

export const insertOfficerSchema = createInsertSchema(officers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateOfficerSchema = createInsertSchema(officers).omit({
  id: true,
  discordId: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const insertCommandLogSchema = createInsertSchema(commandLogs).omit({
  id: true,
  timestamp: true,
});

export const insertSystemStatusSchema = createInsertSchema(systemStatus).omit({
  id: true,
  lastChecked: true,
});

export type Officer = typeof officers.$inferSelect;
export type InsertOfficer = z.infer<typeof insertOfficerSchema>;
export type UpdateOfficer = z.infer<typeof updateOfficerSchema>;
export type CommandLog = typeof commandLogs.$inferSelect;
export type InsertCommandLog = z.infer<typeof insertCommandLogSchema>;
export type SystemStatus = typeof systemStatus.$inferSelect;
export type InsertSystemStatus = z.infer<typeof insertSystemStatusSchema>;
