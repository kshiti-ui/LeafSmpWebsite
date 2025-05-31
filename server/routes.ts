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
      const data = await response.json();
      
      if (data && data.online) {
        const serverStatus = {
          ip: "play.leafsmp.org",
          port: 25590,
          online: data.online,
          playerCount: data.players?.online || 0,
          maxPlayers: data.players?.max || 500,
          version: data.version || "1.20.x"
        };

        // Update storage with live data
        await storage.updateServerStatus(serverStatus);
        res.json(serverStatus);
      } else {
        // Server is offline, return cached data
        const cachedStatus = await storage.getServerStatus();
        res.json({
          ...cachedStatus,
          online: false,
          playerCount: 0
        });
      }
    } catch (error) {
      console.error("Error fetching live server status:", error);
      // Return cached data on error
      const cachedStatus = await storage.getServerStatus();
      res.json(cachedStatus);
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
        icon: "fas fa-mask",
        description: "Stealth & Agility",
        features: [
          "5 Home Locations",
          "/fly Command",
          "Green Name Tag",
          "Priority Join"
        ]
      },
      {
        id: "master",
        name: "MASTER",
        price: 120,
        color: "#3b82f6",
        icon: "fas fa-crown",
        description: "Expert Status",
        features: [
          "Everything from Ninja",
          "10 Home Locations",
          "/god Command",
          "Blue Name Tag"
        ]
      },
      {
        id: "deadliest",
        name: "DEADLIEST",
        price: 150,
        color: "#ef4444",
        icon: "fas fa-skull",
        description: "Ultimate Power",
        features: [
          "Everything from Master",
          "15 Home Locations",
          "/heal Command",
          "Red Name Tag"
        ]
      },
      {
        id: "immortal",
        name: "IMMORTAL",
        price: 200,
        color: "#B10DC9",
        icon: "fas fa-infinity",
        description: "Legendary Status",
        features: [
          "Everything from Deadliest",
          "Unlimited Homes",
          "All Commands",
          "Purple Name Tag"
        ]
      }
    ];

    res.json(ranks);
  });

  const httpServer = createServer(app);
  return httpServer;
}
