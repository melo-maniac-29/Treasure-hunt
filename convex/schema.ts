import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  teams: defineTable({
    name: v.string(),
    members: v.array(v.string()),
    currentStage: v.number(),
    score: v.number(),
    createdAt: v.number(),
    teamCode: v.string(),
  }).index("by_team_code", ["teamCode"]),

  nodes: defineTable({
    nodeId: v.number(),
    clue: v.string(),
    question: v.string(),
    correctQrCode: v.string(),
    expectedAnswer: v.optional(v.string()),
    createdAt: v.number(),
    isActive: v.boolean(),
  }).index("by_node_id", ["nodeId"]).index("by_active", ["isActive"]),

  submissions: defineTable({
    teamId: v.id("teams"),
    nodeId: v.number(),
    submittedAnswer: v.string(),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected")),
    submittedAt: v.number(),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.string()),
  }).index("by_status", ["status"]).index("by_team", ["teamId"]),

  gameSettings: defineTable({
    totalNodes: v.number(),
    gameActive: v.boolean(),
    pointsPerNode: v.number(),
    adminPassword: v.string(),
  }),
});