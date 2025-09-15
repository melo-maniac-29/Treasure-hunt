import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Submit answer for review
export const submitAnswer = mutation({
  args: {
    teamId: v.id("teams"),
    nodeId: v.number(),
    submittedAnswer: v.string(),
  },
  handler: async (ctx, args) => {
    const submissionId = await ctx.db.insert("submissions", {
      teamId: args.teamId,
      nodeId: args.nodeId,
      submittedAnswer: args.submittedAnswer,
      status: "pending",
      submittedAt: Date.now(),
    });

    return submissionId;
  },
});

// Get pending submissions for admin
export const getPendingSubmissions = query({
  handler: async (ctx) => {
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    // Get team details for each submission
    const submissionsWithTeams = await Promise.all(
      submissions.map(async (submission) => {
        const team = await ctx.db.get(submission.teamId);
        return {
          ...submission,
          team,
        };
      })
    );

    return submissionsWithTeams;
  },
});

// Admin review submission
export const reviewSubmission = mutation({
  args: {
    submissionId: v.id("submissions"),
    approved: v.boolean(),
    adminId: v.string(),
  },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) throw new Error("Submission not found");

    // Update submission status
    await ctx.db.patch(args.submissionId, {
      status: args.approved ? "accepted" : "rejected",
      reviewedAt: Date.now(),
      reviewedBy: args.adminId,
    });

    // If approved, update team progress
    if (args.approved) {
      const team = await ctx.db.get(submission.teamId);
      if (!team) throw new Error("Team not found");

      const gameSettings = await ctx.db.query("gameSettings").first();
      const pointsPerNode = gameSettings?.pointsPerNode || 100;

      await ctx.db.patch(team._id, {
        currentStage: team.currentStage + 1,
        score: team.score + pointsPerNode,
      });
    }

    return { success: true };
  },
});

// Get submissions by team
export const getTeamSubmissions = query({
  args: {
    teamId: v.id("teams"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("submissions")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();
  },
});

// Get all submissions for admin dashboard
export const getAllSubmissions = query({
  handler: async (ctx) => {
    const submissions = await ctx.db.query("submissions").collect();
    
    const submissionsWithTeams = await Promise.all(
      submissions.map(async (submission) => {
        const team = await ctx.db.get(submission.teamId);
        return {
          ...submission,
          team,
        };
      })
    );

    return submissionsWithTeams.sort((a, b) => b.submittedAt - a.submittedAt);
  },
});