import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new team
export const createTeam = mutation({
  args: {
    name: v.string(),
    members: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Generate a unique team code
    const teamCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const teamId = await ctx.db.insert("teams", {
      name: args.name,
      members: args.members,
      currentStage: 1,
      score: 0,
      createdAt: Date.now(),
      teamCode,
    });

    return { teamId, teamCode };
  },
});

// Join existing team by code
export const joinTeam = query({
  args: {
    teamCode: v.string(),
  },
  handler: async (ctx, args) => {
    const team = await ctx.db
      .query("teams")
      .withIndex("by_team_code", (q) => q.eq("teamCode", args.teamCode))
      .first();

    return team;
  },
});

// Get team by ID
export const getTeam = query({
  args: {
    teamId: v.id("teams"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.teamId);
  },
});

// Get all teams for leaderboard
export const getLeaderboard = query({
  handler: async (ctx) => {
    const teams = await ctx.db.query("teams").collect();
    return teams
      .sort((a, b) => {
        if (b.currentStage !== a.currentStage) {
          return b.currentStage - a.currentStage;
        }
        return b.score - a.score;
      })
      .slice(0, 10);
  },
});

// Update team progress
export const updateTeamProgress = mutation({
  args: {
    teamId: v.id("teams"),
    newStage: v.number(),
    pointsToAdd: v.number(),
  },
  handler: async (ctx, args) => {
    const team = await ctx.db.get(args.teamId);
    if (!team) throw new Error("Team not found");

    await ctx.db.patch(args.teamId, {
      currentStage: args.newStage,
      score: team.score + args.pointsToAdd,
    });
  },
});