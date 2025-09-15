import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { v4 as uuidv4 } from 'uuid';

// Create a new node
export const createNode = mutation({
  args: {
    nodeId: v.number(),
    clue: v.string(),
    question: v.string(),
    expectedAnswer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Generate unique QR code
    const correctQrCode = uuidv4();

    const newNodeId = await ctx.db.insert("nodes", {
      nodeId: args.nodeId,
      clue: args.clue,
      question: args.question,
      correctQrCode,
      expectedAnswer: args.expectedAnswer,
      isActive: true,
      createdAt: Date.now(),
    });

    return {
      newNodeId,
      qrCodeData: JSON.stringify({
        nodeId: args.nodeId,
        qrSecret: correctQrCode,
      }),
    };
  },
});

// Get all active nodes
export const getActiveNodes = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("nodes")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

// Get node by ID
export const getNode = query({
  args: {
    nodeId: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("nodes")
      .withIndex("by_node_id", (q) => q.eq("nodeId", args.nodeId))
      .first();
  },
});

// Validate QR code scan
export const validateQRCode = mutation({
  args: {
    teamId: v.id("teams"),
    scannedData: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const parsedQR = JSON.parse(args.scannedData);
      const team = await ctx.db.get(args.teamId);
      
      if (!team) {
        return { valid: false, message: "Team not found!" };
      }

      const node = await ctx.db
        .query("nodes")
        .withIndex("by_node_id", (q) => q.eq("nodeId", parsedQR.nodeId))
        .first();

      if (!node) {
        return { valid: false, message: "Invalid QR code!" };
      }

      // Check if team is at correct stage
      if (team.currentStage !== parsedQR.nodeId) {
        return { 
          valid: false, 
          message: "Wrong sequence! Complete previous nodes first." 
        };
      }

      // Validate QR secret
      if (parsedQR.qrSecret !== node.correctQrCode) {
        return { 
          valid: false, 
          message: "Haha wrong place! Keep exploring! 🗺️" 
        };
      }

      return { 
        valid: true, 
        node: {
          nodeId: node.nodeId,
          clue: node.clue,
          question: node.question,
        }
      };
    } catch (error) {
      return { valid: false, message: "Invalid QR code format!" };
    }
  },
});

// Update node
export const updateNode = mutation({
  args: {
    nodeId: v.number(),
    clue: v.string(),
    question: v.string(),
    expectedAnswer: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const node = await ctx.db
      .query("nodes")
      .withIndex("by_node_id", (q) => q.eq("nodeId", args.nodeId))
      .first();

    if (!node) throw new Error("Node not found");

    await ctx.db.patch(node._id, {
      clue: args.clue,
      question: args.question,
      expectedAnswer: args.expectedAnswer,
      isActive: args.isActive,
    });
  },
});