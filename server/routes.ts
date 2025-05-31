import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertServerStatusSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get server status
  app.get("/api/server/status", async (req, res) => {
    try {
      const status = await storage.getServerStatus();
      if (!status) {
        return res.status(404).json({ message: "Server status not found" });
      }
      res.json(status);
    } catch (error) {
      console.error("Error fetching server status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get live player count from Minecraft server API
  app.get("/api/server/live-status", async (req, res) => {
    try {
      const response = await fetch("https://api.mcsrvstat.us/2/play.leafsmp.org:25590");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Minecraft API response:", data);
      
      const serverStatus = {
        ip: "play.leafsmp.org",
        port: 25590,
        online: data.online || false,
        playerCount: data.players?.online || 0,
        maxPlayers: data.players?.max || 500,
        version: data.version || "1.20.x"
      };

      // Update storage with live data
      await storage.updateServerStatus(serverStatus);
      console.log("Returning server status:", serverStatus);
      res.json(serverStatus);
      
    } catch (error) {
      console.error("Error fetching live server status:", error);
      
      // Return default data on error
      const defaultStatus = {
        ip: "play.leafsmp.org",
        port: 25590,
        online: false,
        playerCount: 0,
        maxPlayers: 500,
        version: "1.20.x"
      };
      
      res.json(defaultStatus);
    }
  });

  // Get rank information
  app.get("/api/ranks", async (req, res) => {
    const ranks = [
      {
        id: "ninja",
        name: "NINJA",
        price: 80,
        color: "#22c55e",
        icon: "mask",
        description: "Stealth & Agility",
        features: [
          "3 Home Locations",
          "Green Name Tag",
          "Priority Support",
          "Special Rank Kit",
          "Full Diamond Armor & Tools",
          "1 Zombie, 1 Skeleton, 1 Spider Spawner"
        ]
      },
      {
        id: "master",
        name: "MASTER",
        price: 120,
        color: "#3b82f6",
        icon: "crown",
        description: "Expert Status",
        features: [
          "Everything from Ninja",
          "4 Home Locations",
          "Blue Name Tag",
          "Priority Support",
          "Full Diamond Armor & Netherite Pickaxe",
          "3 Zombie, 3 Skeleton, 3 Spider Spawners"
        ]
      },
      {
        id: "deadliest",
        name: "DEADLIEST",
        price: 150,
        color: "#B10DC9",
        icon: "skull",
        description: "Ultimate Power",
        features: [
          "Everything from Master",
          "5 Home Locations",
          "Purple Name Tag",
          "Priority Support",
          "Netherite Chestplate & Tools",
          "5 Spawners + 1 Enderman Spawner"
        ]
      },
      {
        id: "immortal",
        name: "IMMORTAL",
        price: 200,
        color: "#ef4444",
        icon: "infinity",
        description: "Legendary Status",
        features: [
          "Everything from Deadliest",
          "5 Home Locations",
          "Red Name Tag",
          "Priority Support",
          "Full Netherite Armor & Tools",
          "8 Spawners + 2 Enderman Spawners"
        ]
      }
    ];

    res.json(ranks);
  });

  const httpServer = createServer(app);
  return httpServer;
}
