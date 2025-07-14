var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemoryStorage = class {
  users = /* @__PURE__ */ new Map();
  apps = /* @__PURE__ */ new Map();
  templates = /* @__PURE__ */ new Map();
  posts = /* @__PURE__ */ new Map();
  notifications = /* @__PURE__ */ new Map();
  userStats = /* @__PURE__ */ new Map();
  nextAppId = 1;
  nextPostId = 1;
  nextNotificationId = 1;
  constructor() {
    this.initializeSampleData();
  }
  initializeSampleData() {
    this.templates.set(1, {
      id: 1,
      name: "AI Chatbot",
      description: "Create an intelligent chatbot for customer support",
      category: "AI",
      icon: "\u{1F4AC}",
      config: { type: "chatbot", model: "gpt-3.5-turbo" },
      usage: 150,
      rating: 4.8,
      isPopular: true,
      createdAt: /* @__PURE__ */ new Date()
    });
    this.templates.set(2, {
      id: 2,
      name: "Text Analyzer",
      description: "Analyze text sentiment and extract insights",
      category: "NLP",
      icon: "\u{1F4CA}",
      config: { type: "text-analysis", analysisType: "sentiment" },
      usage: 89,
      rating: 4.5,
      isPopular: true,
      createdAt: /* @__PURE__ */ new Date()
    });
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return void 0;
  }
  async createUser(userData) {
    const user = {
      id: userData.id || Date.now().toString(),
      email: userData.email || "",
      password: userData.password || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      googleId: userData.googleId || null,
      emailVerified: userData.emailVerified || false,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(user.id, user);
    return user;
  }
  async updateUser(id, userData) {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error("User not found");
    }
    const updatedUser = {
      ...existingUser,
      ...userData,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async upsertUser(userData) {
    if (userData.id && this.users.has(userData.id)) {
      return this.updateUser(userData.id, userData);
    } else {
      return this.createUser(userData);
    }
  }
  async getUserStats(userId) {
    return this.userStats.get(userId) || {
      userId,
      totalApps: this.getUserAppCount(userId),
      publishedApps: this.getPublishedAppCount(userId),
      totalViews: 0,
      totalLikes: 0,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
  }
  getUserAppCount(userId) {
    return Array.from(this.apps.values()).filter((app2) => app2.userId === userId).length;
  }
  getPublishedAppCount(userId) {
    return Array.from(this.apps.values()).filter((app2) => app2.userId === userId && app2.isPublished).length;
  }
  // App operations
  async getUserApps(userId) {
    return Array.from(this.apps.values()).filter((app2) => app2.userId === userId);
  }
  async getApp(appId) {
    return this.apps.get(appId);
  }
  async createApp(appData) {
    const app2 = {
      ...appData,
      id: this.nextAppId++,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.apps.set(app2.id, app2);
    return app2;
  }
  async updateApp(appId, appData) {
    const existingApp = this.apps.get(appId);
    if (!existingApp) {
      throw new Error(`App with id ${appId} not found`);
    }
    const updatedApp = {
      ...existingApp,
      ...appData,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.apps.set(appId, updatedApp);
    return updatedApp;
  }
  async getMarketplaceApps() {
    return Array.from(this.apps.values()).filter((app2) => app2.isPublished);
  }
  // Template operations
  async getTemplates() {
    return Array.from(this.templates.values());
  }
  async getPopularTemplates() {
    return Array.from(this.templates.values()).slice(0, 6);
  }
  async getTemplate(templateId) {
    return this.templates.get(templateId);
  }
  // Community operations
  async getCommunityPosts() {
    return Array.from(this.posts.values());
  }
  async getCommunityHighlights() {
    return Array.from(this.posts.values()).slice(0, 3);
  }
  async createPost(postData) {
    const post = {
      ...postData,
      id: this.nextPostId++,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.posts.set(post.id, post);
    return post;
  }
  // Notification operations
  async getUserNotifications(userId) {
    return Array.from(this.notifications.values()).filter((n) => n.userId === userId);
  }
  async markNotificationAsRead(notificationId, userId) {
    const notification = this.notifications.get(notificationId);
    if (notification && notification.userId === userId) {
      notification.isRead = true;
    }
  }
  // App execution operations
  async executeAppWorkflow(appId, input, sessionId) {
    try {
      const workflow = input.workflow || [];
      const userInput = input.input || input;
      const componentResults = [];
      let currentInput = userInput;
      for (const component of workflow) {
        try {
          const result = await this.executeComponent(component, currentInput, sessionId);
          componentResults.push(result);
          currentInput = result;
        } catch (error) {
          componentResults.push({
            type: component.type,
            error: error instanceof Error ? error.message : "Component execution failed",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      }
      return {
        success: true,
        result: componentResults.length > 0 ? componentResults[componentResults.length - 1] : userInput,
        componentResults,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      console.error("Workflow execution error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
  }
  async executeComponent(component, input, sessionId) {
    const { type, config } = component;
    switch (type) {
      case "chatbot":
        return await this.executeChatbot(config, input);
      case "text-analysis":
        return await this.executeTextAnalysis(config, input);
      case "image-generation":
        return await this.executeImageGeneration(config, input);
      case "data-processor":
        return await this.executeDataProcessor(config, input);
      case "api-call":
        return await this.executeApiCall(config, input);
      case "speech-to-text":
        return await this.executeSpeechToText(config, input);
      case "document-analysis":
        return await this.executeDocumentAnalysis(config, input);
      case "code-generator":
        return await this.executeCodeGenerator(config, input);
      case "visual-search":
        return await this.executeVisualSearch(config, input);
      default:
        throw new Error(`Unknown component type: ${type}`);
    }
  }
  async saveAppConfiguration(appId, configuration) {
    const app2 = this.apps.get(appId);
    if (app2) {
      app2.configuration = configuration;
      app2.updatedAt = /* @__PURE__ */ new Date();
    }
  }
  async getAppConfiguration(appId) {
    const app2 = this.apps.get(appId);
    return app2?.configuration || null;
  }
};
var storage = new MemoryStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import MemoryStore from "memorystore";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const MemStore = MemoryStore(session);
  const sessionStore = new MemStore({
    checkPeriod: sessionTtl
  });
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "dev-secret-key",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !user.password) {
            return done(null, false, { message: "Invalid email or password" });
          }
          const isValid = await comparePasswords(password, user.password);
          if (!isValid) {
            return done(null, false, { message: "Invalid email or password" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            if (!email) {
              return done(new Error("No email found in Google profile"));
            }
            let user = await storage.getUserByEmail(email);
            if (user) {
              user = await storage.updateUser(user.id, {
                firstName: profile.name?.givenName || user.firstName,
                lastName: profile.name?.familyName || user.lastName,
                profileImageUrl: profile.photos?.[0]?.value || user.profileImageUrl,
                googleId: profile.id
              });
            } else {
              user = await storage.createUser({
                email,
                firstName: profile.name?.givenName || "",
                lastName: profile.name?.familyName || "",
                profileImageUrl: profile.photos?.[0]?.value || "",
                googleId: profile.id,
                emailVerified: true
                // Google emails are pre-verified
              });
            }
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName: firstName || "",
        lastName: lastName || "",
        emailVerified: false
      });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          emailVerified: user.emailVerified
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.login(user, (err2) => {
        if (err2) {
          return res.status(500).json({ message: "Login failed" });
        }
        res.status(200).json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          emailVerified: user.emailVerified
        });
      });
    })(req, res, next);
  });
  app2.get(
    "/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  app2.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth?error=google_auth_failed" }),
    (req, res) => {
      res.redirect("/");
    }
  );
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.sendStatus(401);
    }
    const user = req.user;
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      emailVerified: user.emailVerified
    });
  });
}

// shared/schema.ts
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer,
  real
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().notNull().default("gen_random_uuid()"),
  email: varchar("email").unique().notNull(),
  password: varchar("password"),
  // For email/password auth
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  googleId: varchar("google_id").unique(),
  // For Google OAuth
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var apps = pgTable("apps", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  slug: varchar("slug").unique(),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  templateId: integer("template_id").references(() => templates.id),
  status: varchar("status").notNull().default("draft"),
  // draft, published, archived
  config: jsonb("config"),
  // App configuration and workflow
  isPublic: boolean("is_public").default(false),
  price: real("price").default(0),
  downloads: integer("downloads").default(0),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  icon: varchar("icon").notNull(),
  config: jsonb("config"),
  // Template configuration
  usage: integer("usage").default(0),
  rating: real("rating").default(0),
  isPopular: boolean("is_popular").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  content: text("content"),
  userId: varchar("user_id").notNull().references(() => users.id),
  category: varchar("category").notNull(),
  replies: integer("replies").default(0),
  likes: integer("likes").default(0),
  isHighlighted: boolean("is_highlighted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type").notNull(),
  // app_review, community_follow, revenue, etc.
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  appsCreated: integer("apps_created").default(0),
  totalDownloads: integer("total_downloads").default(0),
  totalRevenue: real("total_revenue").default(0),
  credits: real("credits").default(0),
  rank: integer("rank").default(0),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertAppSchema = createInsertSchema(apps).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/routes.ts
async function registerRoutes(app2) {
  setupAuth(app2);
  const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };
  app2.get("/api/user/stats", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });
  app2.get("/api/apps", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const apps2 = await storage.getUserApps(userId);
      res.json(apps2);
    } catch (error) {
      console.error("Error fetching apps:", error);
      res.status(500).json({ message: "Failed to fetch apps" });
    }
  });
  app2.post("/api/apps", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const appData = insertAppSchema.parse({ ...req.body, userId });
      const app3 = await storage.createApp(appData);
      res.json(app3);
    } catch (error) {
      console.error("Error creating app:", error);
      res.status(500).json({ message: "Failed to create app" });
    }
  });
  app2.get("/api/apps/:id", isAuthenticated, async (req, res) => {
    try {
      const appId = parseInt(req.params.id);
      const app3 = await storage.getApp(appId);
      if (!app3) {
        return res.status(404).json({ message: "App not found" });
      }
      res.json(app3);
    } catch (error) {
      console.error("Error fetching app:", error);
      res.status(500).json({ message: "Failed to fetch app" });
    }
  });
  app2.put("/api/apps/:id", isAuthenticated, async (req, res) => {
    try {
      const appId = parseInt(req.params.id);
      const userId = req.user.id;
      const app3 = await storage.getApp(appId);
      if (!app3 || app3.createdBy !== userId) {
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
  app2.post("/api/apps/preview/execute", isAuthenticated, async (req, res) => {
    try {
      const { workflow, input, sessionId } = req.body;
      if (!workflow || !Array.isArray(workflow)) {
        return res.status(400).json({ message: "Invalid workflow provided" });
      }
      const result = await storage.executeAppWorkflow(0, { workflow, input }, sessionId);
      res.json({
        success: true,
        result,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        componentResults: result?.componentResults || []
      });
    } catch (error) {
      console.error("Error executing workflow:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to execute workflow",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  });
  app2.post("/api/apps/:id/deploy", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const appId = parseInt(req.params.id);
      const app3 = await storage.getApp(appId);
      if (!app3 || app3.createdBy !== userId) {
        return res.status(403).json({ message: "Unauthorized to deploy this app" });
      }
      const updatedApp = await storage.updateApp(appId, {
        status: "published",
        publishedAt: /* @__PURE__ */ new Date()
      });
      res.json({
        message: "App deployed successfully",
        app: updatedApp,
        deploymentUrl: `https://yvie-ai.app/${app3.slug || appId}`
      });
    } catch (error) {
      console.error("Error deploying app:", error);
      res.status(500).json({ message: "Failed to deploy app" });
    }
  });
  app2.post("/api/apps/:id/duplicate", isAuthenticated, async (req, res) => {
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
        status: "draft",
        publishedAt: null
      };
      const duplicatedApp = await storage.createApp(duplicateData);
      res.status(201).json(duplicatedApp);
    } catch (error) {
      console.error("Error duplicating app:", error);
      res.status(500).json({ message: "Failed to duplicate app" });
    }
  });
  app2.post("/api/apps/:id/execute", async (req, res) => {
    try {
      const appId = parseInt(req.params.id);
      const { input, sessionId } = req.body;
      const app3 = await storage.getApp(appId);
      if (!app3 || app3.status !== "published") {
        return res.status(404).json({ message: "App not found or not published" });
      }
      const result = await storage.executeAppWorkflow(appId, input, sessionId);
      res.json(result);
    } catch (error) {
      console.error("Error executing app:", error);
      res.status(500).json({ message: "Failed to execute app" });
    }
  });
  app2.get("/api/templates", async (req, res) => {
    try {
      const templates2 = await storage.getTemplates();
      res.json(templates2);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });
  app2.get("/api/templates/popular", async (req, res) => {
    try {
      const templates2 = await storage.getPopularTemplates();
      res.json(templates2);
    } catch (error) {
      console.error("Error fetching popular templates:", error);
      res.status(500).json({ message: "Failed to fetch popular templates" });
    }
  });
  app2.get("/api/templates/:id", async (req, res) => {
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
  app2.get("/api/marketplace/apps", async (req, res) => {
    try {
      const apps2 = await storage.getMarketplaceApps();
      res.json(apps2);
    } catch (error) {
      console.error("Error fetching marketplace apps:", error);
      res.status(500).json({ message: "Failed to fetch marketplace apps" });
    }
  });
  app2.get("/api/community/posts", async (req, res) => {
    try {
      const posts2 = await storage.getCommunityPosts();
      res.json(posts2);
    } catch (error) {
      console.error("Error fetching community posts:", error);
      res.status(500).json({ message: "Failed to fetch community posts" });
    }
  });
  app2.get("/api/community/highlights", async (req, res) => {
    try {
      const highlights = await storage.getCommunityHighlights();
      res.json(highlights);
    } catch (error) {
      console.error("Error fetching community highlights:", error);
      res.status(500).json({ message: "Failed to fetch community highlights" });
    }
  });
  app2.post("/api/community/posts", isAuthenticated, async (req, res) => {
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
  app2.get("/api/notifications", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const notifications2 = await storage.getUserNotifications(userId);
      res.json(notifications2);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });
  app2.put("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
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
  app2.put("/api/users/profile", isAuthenticated, async (req, res) => {
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
  app2.put("/api/users/password", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      const hashedPassword = await __require("crypto").scrypt(newPassword, "salt", 64);
      await storage.updateUser(userId, { password: hashedPassword.toString("hex") + ".salt" });
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ message: "Failed to update password" });
    }
  });
  app2.put("/api/users/notifications", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update notification settings" });
    }
  });
  app2.put("/api/users/privacy", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update privacy settings" });
    }
  });
  app2.put("/api/users/appearance", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update appearance settings" });
    }
  });
  app2.delete("/api/users/account", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      req.logout(() => {
        res.json({ success: true });
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete account" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
