import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertAppSchema, insertPostSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  setupAuth(app);

  // Authentication middleware function
  const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // User stats endpoint
  app.get('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Apps endpoints
  app.get('/api/apps', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const apps = await storage.getUserApps(userId);
      res.json(apps);
    } catch (error) {
      console.error("Error fetching apps:", error);
      res.status(500).json({ message: "Failed to fetch apps" });
    }
  });

  app.post('/api/apps', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const appData = insertAppSchema.parse({ ...req.body, userId });
      const app = await storage.createApp(appData);
      res.json(app);
    } catch (error) {
      console.error("Error creating app:", error);
      res.status(500).json({ message: "Failed to create app" });
    }
  });

  app.get('/api/apps/:id', isAuthenticated, async (req: any, res) => {
    try {
      const appId = parseInt(req.params.id);
      const app = await storage.getApp(appId);
      if (!app) {
        return res.status(404).json({ message: "App not found" });
      }
      res.json(app);
    } catch (error) {
      console.error("Error fetching app:", error);
      res.status(500).json({ message: "Failed to fetch app" });
    }
  });

  app.put('/api/apps/:id', isAuthenticated, async (req: any, res) => {
    try {
      const appId = parseInt(req.params.id);
      const userId = req.user.id;
      const app = await storage.getApp(appId);
      
      if (!app || app.createdBy !== userId) {
        return res.status(403).json({ message: "Unauthorized to edit this app" });
      }

      const appData = insertAppSchema.partial().parse(req.body);
      const updatedApp = await storage.updateApp(appId, appData);
      res.json(updatedApp);
    } catch (error) {
      console.error("Error updating app:", error);
      res.status(500).json({ message: "Failed to update app" });
    }
  });

  // App preview execution endpoint
  app.post('/api/apps/preview/execute', isAuthenticated, async (req: any, res) => {
    try {
      const { workflow, input, sessionId } = req.body;
      
      if (!workflow || !Array.isArray(workflow)) {
        return res.status(400).json({ message: "Invalid workflow provided" });
      }
      
      // Execute the workflow with the provided input
      const result = await storage.executeAppWorkflow(0, { workflow, input }, sessionId);
      
      res.json({
        success: true,
        result: result,
        timestamp: new Date().toISOString(),
        componentResults: result?.componentResults || []
      });
    } catch (error) {
      console.error("Error executing workflow:", error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : "Failed to execute workflow",
        timestamp: new Date().toISOString()
      });
    }
  });

  // App deployment endpoint
  app.post('/api/apps/:id/deploy', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const appId = parseInt(req.params.id);
      
      const app = await storage.getApp(appId);
      if (!app || app.createdBy !== userId) {
        return res.status(403).json({ message: "Unauthorized to deploy this app" });
      }
      
      // Update app status to published
      const updatedApp = await storage.updateApp(appId, { 
        status: 'published',
        publishedAt: new Date()
      });
      
      res.json({ 
        message: "App deployed successfully", 
        app: updatedApp,
        deploymentUrl: `https://yvie-ai.app/${app.slug || appId}`
      });
    } catch (error) {
      console.error("Error deploying app:", error);
      res.status(500).json({ message: "Failed to deploy app" });
    }
  });

  // App duplication endpoint
  app.post('/api/apps/:id/duplicate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const appId = parseInt(req.params.id);
      
      const originalApp = await storage.getApp(appId);
      if (!originalApp) {
        return res.status(404).json({ message: "App not found" });
      }
      
      const { id, createdAt, updatedAt, ...appDataToCopy } = originalApp;
      const duplicateData = {
        ...appDataToCopy,
        name: `${originalApp.name} (Copy)`,
        slug: `${originalApp.slug}-copy-${Date.now()}`,
        createdBy: userId,
        status: 'draft' as const,
        publishedAt: null
      };
      
      const duplicatedApp = await storage.createApp(duplicateData);
      res.status(201).json(duplicatedApp);
    } catch (error) {
      console.error("Error duplicating app:", error);
      res.status(500).json({ message: "Failed to duplicate app" });
    }
  });

  // App execution endpoint (for running AI workflows)
  app.post('/api/apps/:id/execute', async (req: any, res) => {
    try {
      const appId = parseInt(req.params.id);
      const { input, sessionId } = req.body;
      
      const app = await storage.getApp(appId);
      if (!app || app.status !== 'published') {
        return res.status(404).json({ message: "App not found or not published" });
      }
      
      // Execute the app's workflow with the provided input
      const result = await storage.executeAppWorkflow(appId, input, sessionId);
      res.json(result);
    } catch (error) {
      console.error("Error executing app:", error);
      res.status(500).json({ message: "Failed to execute app" });
    }
  });

  // Templates endpoints
  app.get('/api/templates', async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get('/api/templates/popular', async (req, res) => {
    try {
      const templates = await storage.getPopularTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching popular templates:", error);
      res.status(500).json({ message: "Failed to fetch popular templates" });
    }
  });

  app.get('/api/templates/:id', async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      const template = await storage.getTemplate(templateId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  // Marketplace endpoints
  app.get('/api/marketplace/apps', async (req, res) => {
    try {
      const apps = await storage.getMarketplaceApps();
      res.json(apps);
    } catch (error) {
      console.error("Error fetching marketplace apps:", error);
      res.status(500).json({ message: "Failed to fetch marketplace apps" });
    }
  });

  // Community endpoints
  app.get('/api/community/posts', async (req, res) => {
    try {
      const posts = await storage.getCommunityPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching community posts:", error);
      res.status(500).json({ message: "Failed to fetch community posts" });
    }
  });

  app.get('/api/community/highlights', async (req, res) => {
    try {
      const highlights = await storage.getCommunityHighlights();
      res.json(highlights);
    } catch (error) {
      console.error("Error fetching community highlights:", error);
      res.status(500).json({ message: "Failed to fetch community highlights" });
    }
  });

  app.post('/api/community/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const postData = insertPostSchema.parse({ ...req.body, userId });
      const post = await storage.createPost(postData);
      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  // Notifications endpoints
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.put('/api/notifications/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const userId = req.user.id;
      await storage.markNotificationAsRead(notificationId, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // User settings endpoints
  app.put('/api/users/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profileData = req.body;
      const user = await storage.updateUser(userId, profileData);
      res.json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.put('/api/users/password', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      
      // For demo purposes, just update the password
      // In production, you'd verify the current password first
      const hashedPassword = await require('crypto').scrypt(newPassword, 'salt', 64);
      await storage.updateUser(userId, { password: hashedPassword.toString('hex') + '.salt' });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ message: "Failed to update password" });
    }
  });

  app.put('/api/users/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      // For demo, just return success
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update notification settings" });
    }
  });

  app.put('/api/users/privacy', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      // For demo, just return success
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update privacy settings" });
    }
  });

  app.put('/api/users/appearance', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      // For demo, just return success
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update appearance settings" });
    }
  });

  app.delete('/api/users/account', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      req.logout(() => {
        res.json({ success: true });
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete account" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
