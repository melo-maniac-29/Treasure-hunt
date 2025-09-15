import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get game settings
export const getGameSettings = query({
  handler: async (ctx) => {
    return await ctx.db.query("gameSettings").first();
  },
});

// Initialize game settings
export const initializeGameSettings = mutation({
  args: {
    totalNodes: v.number(),
    pointsPerNode: v.number(),
    adminPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if settings already exist
    const existing = await ctx.db.query("gameSettings").first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        totalNodes: args.totalNodes,
        pointsPerNode: args.pointsPerNode,
        adminPassword: args.adminPassword,
        gameActive: true,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("gameSettings", {
        totalNodes: args.totalNodes,
        gameActive: true,
        pointsPerNode: args.pointsPerNode,
        adminPassword: args.adminPassword,
      });
    }
  },
});

// Update game settings
export const updateGameSettings = mutation({
  args: {
    totalNodes: v.number(),
    gameActive: v.boolean(),
    pointsPerNode: v.number(),
    adminPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db.query("gameSettings").first();
    if (!settings) throw new Error("Game settings not found");

    await ctx.db.patch(settings._id, {
      totalNodes: args.totalNodes,
      gameActive: args.gameActive,
      pointsPerNode: args.pointsPerNode,
      adminPassword: args.adminPassword,
    });
  },
});

// Toggle game active status
export const toggleGameActive = mutation({
  args: {
    gameActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db.query("gameSettings").first();
    if (!settings) throw new Error("Game settings not found");

    await ctx.db.patch(settings._id, {
      gameActive: args.gameActive,
    });
  },
});

// Verify admin password
export const verifyAdminPassword = query({
  args: {
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db.query("gameSettings").first();
    if (!settings) return false;

    return settings.adminPassword === args.password;
  },
});

// Get game statistics
export const getGameStats = query({
  handler: async (ctx) => {
    const teams = await ctx.db.query("teams").collect();
    const submissions = await ctx.db.query("submissions").collect();
    const nodes = await ctx.db.query("nodes").collect();

    const activeTeams = teams.length;
    const pendingSubmissions = submissions.filter(s => s.status === "pending").length;
    const completedSubmissions = submissions.filter(s => s.status === "accepted").length;
    const activeNodes = nodes.filter(n => n.isActive).length;

    return {
      activeTeams,
      pendingSubmissions,
      completedSubmissions,
      activeNodes,
      totalSubmissions: submissions.length,
    };
  },
});