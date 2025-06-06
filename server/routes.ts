import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertServerStatusSchema, insertTicketSchema } from "@shared/schema";
import jwt from "jsonwebtoken";

const JWT_SECRET = "leafsmp-admin-secret-key-2024";
const ADMIN_CREDENTIALS = [
  { username: "Kanhaiya", password: "NcY42#1gdh" },
  { username: "Rondieeno", password: "Mskle7&3@hg" }
];

// Middleware to verify admin token
const verifyAdminToken = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

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
      const response = await fetch("https://api.mcsrvstat.us/3/play.leafsmp.org:25590");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const serverStatus = {
        ip: "play.leafsmp.org",
        port: 25590,
        online: data.online || false,
        playerCount: data.players?.online || 0,
        maxPlayers: data.players?.max || 500,
        version: data.version || "1.21.1"
      };

      // Update storage with live data
      await storage.updateServerStatus(serverStatus);
      res.json(serverStatus);

    } catch (error) {
      console.error("Error fetching live server status:", error);
      
      // Return cached data from storage on error
      const cachedStatus = await storage.getServerStatus();
      if (cachedStatus) {
        res.json(cachedStatus);
      } else {
        // Return default data if no cached data exists
        res.json({
          ip: "play.leafsmp.org",
          port: 25590,
          online: true,
          playerCount: 0,
          maxPlayers: 500,
          version: "1.21.1"
        });
      }
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

  // Admin authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const admin = ADMIN_CREDENTIALS.find(
        cred => cred.username === username && cred.password === password
      );

      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { username: admin.username, role: "admin" },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({ token, username: admin.username });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Ticket routes
  app.post("/api/tickets", async (req, res) => {
    try {
      const ticketData = req.body;
      const ticket = await storage.createTicket({
        ...ticketData,
        status: "open",
        priority: "normal",
        category: "rank_purchase",
      });
      res.json(ticket);
    } catch (error) {
      console.error("Error creating ticket:", error);
      res.status(500).json({ error: "Failed to create ticket" });
    }
  });

  app.get("/api/user-tickets", async (req, res) => {
    try {
      const { minecraft, discord } = req.query;
      if (!minecraft || !discord) {
        return res.status(400).json({ error: "Both minecraft and discord usernames are required" });
      }
      const tickets = await storage.getUserTickets(minecraft as string, discord as string);
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching user tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  });

  app.get("/api/admin/tickets", verifyAdminToken, async (req, res) => {
    try {
      const tickets = await storage.getAllTickets();
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching admin tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  });

  app.patch("/api/admin/tickets/:id", verifyAdminToken, async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const updates = req.body;
      const ticket = await storage.updateTicket(ticketId, updates);
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      res.json(ticket);
    } catch (error) {
      console.error("Error updating ticket:", error);
      res.status(500).json({ error: "Failed to update ticket" });
    }
  });

  // Chat routes
  app.post("/api/tickets/:id/messages", async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const { sender, senderName, message, imageUrl } = req.body;
      
      const chatMessage = await storage.addChatMessage({
        ticketId,
        sender,
        senderName,
        message,
        imageUrl,
      });
      
      res.json(chatMessage);
    } catch (error) {
      console.error("Error adding chat message:", error);
      res.status(500).json({ error: "Failed to add message" });
    }
  });

  app.get("/api/tickets/:id/messages", async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const messages = await storage.getChatMessages(ticketId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Image upload route
  app.post("/api/upload-image", async (req, res) => {
    try {
      const formData = await new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
          const data = Buffer.concat(chunks);
          resolve(data);
        });
        req.on('error', reject);
      });

      // Generate a unique filename
      const filename = `image_${Date.now()}.jpg`;
      
      // In a real implementation, you would save the file to a storage service
      // For now, we'll return a mock URL
      const imageUrl = `/uploads/${filename}`;
      
      res.json({ imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}