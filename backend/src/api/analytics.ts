import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { Project } from "../types";
import { Pool } from "pg";

// Initialize Postgres pool if DATABASE_URL provided (Railway)
const DATABASE_URL = process.env.DATABASE_URL;
let pgPool: Pool | null = null;
if (DATABASE_URL) {
  pgPool = new Pool({ connectionString: DATABASE_URL });
}

export const analyticsRoutes = new Hono();

// Logging utility
function log(
  level: "info" | "error" | "warn",
  message: string,
  meta?: Record<string, unknown>
) {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
  console.log(
    `[${timestamp}] [${level.toUpperCase()}] [Analytics] ${message}${metaStr}`
  );
}

// Schema for analytics data
const analyticsDataSchema = z.object({
  totalCommands: z.number(),
  totalEvents: z.number(),
  totalModules: z.number(),
  dailyActivity: z.array(
    z.object({
      date: z.string(),
      executions: z.number(),
      errors: z.number(),
    })
  ),
  commandUsage: z.array(
    z.object({
      name: z.string(),
      executions: z.number(),
      errors: z.number(),
      avgResponseTime: z.number(),
      lastUsed: z.string(),
    })
  ),
  errorLogs: z.array(
    z.object({
      id: z.string(),
      timestamp: z.string(),
      message: z.string(),
      severity: z.enum(["high", "medium", "low"]),
      command: z.string(),
      stackTrace: z.string().optional(),
    })
  ),
  performanceMetrics: z.object({
    avgResponseTime: z.number(),
    uptimePercentage: z.number(),
    errorRate: z.number(),
    throughput: z.number(),
    peakLoad: z.number(),
  }),
  userEngagement: z.object({
    totalUsers: z.number(),
    activeUsers: z.number(),
    newUsers: z.number(),
    returningUsers: z.number(),
    sessionDuration: z.number(),
  }),
  resourceUsage: z.object({
    cpuUsage: z.number(),
    memoryUsage: z.number(),
    networkTraffic: z.number(),
  }),
  growthMetrics: z.object({
    weeklyGrowth: z.number(),
    monthlyGrowth: z.number(),
    retentionRate: z.number(),
  }),
});

// GET /api/analytics - Get analytics data for a user's projects
analyticsRoutes.get("/", async (c) => {
  const userId = c.req.header("X-User-ID") || "default";

  try {
    // For now, return mock analytics data
    // In a real implementation, this would aggregate data from various sources
    const mockAnalytics = {
      totalCommands: 24,
      totalEvents: 8,
      totalModules: 3,
      dailyActivity: [
        { date: "Mon", executions: 45, errors: 2 },
        { date: "Tue", executions: 52, errors: 1 },
        { date: "Wed", executions: 48, errors: 3 },
        { date: "Thu", executions: 78, errors: 0 },
        { date: "Fri", executions: 65, errors: 2 },
        { date: "Sat", executions: 90, errors: 5 },
        { date: "Sun", executions: 82, errors: 1 },
      ],
      commandUsage: [
        {
          name: "ping",
          executions: 120,
          errors: 2,
          avgResponseTime: 120,
          lastUsed: "2023-05-15 14:30",
        },
        {
          name: "help",
          executions: 85,
          errors: 0,
          avgResponseTime: 95,
          lastUsed: "2023-05-15 12:15",
        },
        {
          name: "ban",
          executions: 12,
          errors: 1,
          avgResponseTime: 320,
          lastUsed: "2023-05-15 10:45",
        },
        {
          name: "kick",
          executions: 8,
          errors: 0,
          avgResponseTime: 280,
          lastUsed: "2023-05-15 09:30",
        },
        {
          name: "mute",
          executions: 15,
          errors: 3,
          avgResponseTime: 250,
          lastUsed: "2023-05-15 16:20",
        },
      ],
      errorLogs: [
        {
          id: "1",
          timestamp: "2023-05-15 14:30",
          message: "Permission denied for command ban",
          severity: "medium",
          command: "ban",
          stackTrace:
            "at PermissionHandler.checkPermission(...)\nat CommandExecutor.execute(...)",
        },
        {
          id: "2",
          timestamp: "2023-05-15 10:15",
          message: "Database connection failed",
          severity: "high",
          command: "kick",
          stackTrace:
            "at DatabaseClient.connect(...)\nat UserManager.updateUser(...)",
        },
        {
          id: "3",
          timestamp: "2023-05-14 16:45",
          message: "Invalid user ID provided",
          severity: "low",
          command: "mute",
        },
        {
          id: "4",
          timestamp: "2023-05-14 11:20",
          message: "Rate limit exceeded",
          severity: "medium",
          command: "ping",
        },
        {
          id: "5",
          timestamp: "2023-05-13 20:10",
          message: "Missing required permissions",
          severity: "high",
          command: "ban",
        },
      ],
      performanceMetrics: {
        avgResponseTime: 245,
        uptimePercentage: 99.8,
        errorRate: 0.8,
        throughput: 45,
        peakLoad: 120,
      },
      userEngagement: {
        totalUsers: 1240,
        activeUsers: 342,
        newUsers: 24,
        returningUsers: 287,
        sessionDuration: 24,
      },
      resourceUsage: {
        cpuUsage: 45,
        memoryUsage: 62,
        networkTraffic: 1.2,
      },
      growthMetrics: {
        weeklyGrowth: 3.2,
        monthlyGrowth: 12.5,
        retentionRate: 87.3,
      },
    };

    log("info", "Analytics data retrieved", { userId });
    return c.json({ analytics: mockAnalytics });
  } catch (error) {
    log("error", "Failed to get analytics data", {
      userId,
      error: String(error),
    });
    return c.json(
      { error: "Failed to get analytics data. Please try again." },
      500
    );
  }
});

// GET /api/analytics/:projectId - Get analytics for a specific project
analyticsRoutes.get("/:projectId", async (c) => {
  const projectId = c.req.param("projectId");
  const userId = c.req.header("X-User-ID") || "default";

  try {
    // Validate project ID
    if (!projectId || projectId.length < 1) {
      return c.json({ error: "Invalid project ID" }, 400);
    }

    // For now, return mock analytics data for the specific project
    // In a real implementation, this would aggregate data for the specific project
    const mockProjectAnalytics = {
      projectId,
      totalCommands: 12,
      totalEvents: 4,
      totalModules: 2,
      dailyActivity: [
        { date: "Mon", executions: 20, errors: 1 },
        { date: "Tue", executions: 25, errors: 0 },
        { date: "Wed", executions: 18, errors: 2 },
        { date: "Thu", executions: 35, errors: 0 },
        { date: "Fri", executions: 30, errors: 1 },
        { date: "Sat", executions: 42, errors: 3 },
        { date: "Sun", executions: 38, errors: 0 },
      ],
      commandUsage: [
        {
          name: "ping",
          executions: 60,
          errors: 1,
          avgResponseTime: 115,
          lastUsed: "2023-05-15 14:30",
        },
        {
          name: "help",
          executions: 40,
          errors: 0,
          avgResponseTime: 90,
          lastUsed: "2023-05-15 12:15",
        },
      ],
      errorLogs: [
        {
          id: "1",
          timestamp: "2023-05-15 14:30",
          message: "Permission denied for command ban",
          severity: "medium",
          command: "ban",
        },
        {
          id: "2",
          timestamp: "2023-05-15 10:15",
          message: "Database connection failed",
          severity: "high",
          command: "kick",
        },
      ],
      performanceMetrics: {
        avgResponseTime: 250,
        uptimePercentage: 99.5,
        errorRate: 1.2,
        throughput: 30,
        peakLoad: 85,
      },
      userEngagement: {
        totalUsers: 620,
        activeUsers: 175,
        newUsers: 12,
        returningUsers: 145,
        sessionDuration: 22,
      },
      resourceUsage: {
        cpuUsage: 38,
        memoryUsage: 55,
        networkTraffic: 0.8,
      },
      growthMetrics: {
        weeklyGrowth: 2.8,
        monthlyGrowth: 10.2,
        retentionRate: 85.7,
      },
    };

    log("info", "Project analytics retrieved", { userId, projectId });
    return c.json({ analytics: mockProjectAnalytics });
  } catch (error) {
    log("error", "Failed to get project analytics", {
      userId,
      projectId,
      error: String(error),
    });
    return c.json(
      { error: "Failed to get project analytics. Please try again." },
      500
    );
  }
});

// GET /api/analytics/export - Export analytics data as CSV or JSON
analyticsRoutes.get("/export/:format", async (c) => {
  const format = c.req.param("format");
  const userId = c.req.header("X-User-ID") || "default";
  const type = c.req.query("type") || "all"; // all, commands, performance, etc.

  try {
    if (!["json", "csv"].includes(format)) {
      return c.json({ error: "Format must be 'json' or 'csv'" }, 400);
    }

    // Generate mock analytics data
    const mockAnalytics = {
      totalCommands: 24,
      totalEvents: 8,
      totalModules: 3,
      dailyActivity: [
        { date: "Mon", executions: 45, errors: 2 },
        { date: "Tue", executions: 52, errors: 1 },
        { date: "Wed", executions: 48, errors: 3 },
        { date: "Thu", executions: 78, errors: 0 },
        { date: "Fri", executions: 65, errors: 2 },
        { date: "Sat", executions: 90, errors: 5 },
        { date: "Sun", executions: 82, errors: 1 },
      ],
      commandUsage: [
        {
          name: "ping",
          executions: 120,
          errors: 2,
          avgResponseTime: 120,
          lastUsed: "2023-05-15 14:30",
        },
        {
          name: "help",
          executions: 85,
          errors: 0,
          avgResponseTime: 95,
          lastUsed: "2023-05-15 12:15",
        },
        {
          name: "ban",
          executions: 12,
          errors: 1,
          avgResponseTime: 320,
          lastUsed: "2023-05-15 10:45",
        },
        {
          name: "kick",
          executions: 8,
          errors: 0,
          avgResponseTime: 280,
          lastUsed: "2023-05-15 09:30",
        },
        {
          name: "mute",
          executions: 15,
          errors: 3,
          avgResponseTime: 250,
          lastUsed: "2023-05-15 16:20",
        },
      ],
      errorLogs: [
        {
          id: "1",
          timestamp: "2023-05-15 14:30",
          message: "Permission denied for command ban",
          severity: "medium",
          command: "ban",
        },
        {
          id: "2",
          timestamp: "2023-05-15 10:15",
          message: "Database connection failed",
          severity: "high",
          command: "kick",
        },
        {
          id: "3",
          timestamp: "2023-05-14 16:45",
          message: "Invalid user ID provided",
          severity: "low",
          command: "mute",
        },
      ],
      performanceMetrics: {
        avgResponseTime: 245,
        uptimePercentage: 99.8,
        errorRate: 0.8,
        throughput: 45,
        peakLoad: 120,
      },
      userEngagement: {
        totalUsers: 1240,
        activeUsers: 342,
        newUsers: 24,
        returningUsers: 287,
        sessionDuration: 24,
      },
      resourceUsage: {
        cpuUsage: 45,
        memoryUsage: 62,
        networkTraffic: 1.2,
      },
      growthMetrics: {
        weeklyGrowth: 3.2,
        monthlyGrowth: 12.5,
        retentionRate: 87.3,
      },
    };

    if (format === "json") {
      // Set headers for JSON download
      c.header("Content-Type", "application/json");
      c.header(
        "Content-Disposition",
        `attachment; filename="analytics-${
          new Date().toISOString().split("T")[0]
        }.json"`
      );

      return c.json(mockAnalytics);
    } else if (format === "csv") {
      // Convert analytics data to CSV format
      let csvContent = "Analytics Report\n\n";

      // Basic metrics
      csvContent += `Metric,Value\n`;
      csvContent += `Total Commands,${mockAnalytics.totalCommands}\n`;
      csvContent += `Total Events,${mockAnalytics.totalEvents}\n`;
      csvContent += `Total Modules,${mockAnalytics.totalModules}\n`;
      csvContent += `Avg Response Time,${mockAnalytics.performanceMetrics.avgResponseTime}ms\n`;
      csvContent += `Uptime Percentage,${mockAnalytics.performanceMetrics.uptimePercentage}%\n`;
      csvContent += `Error Rate,${mockAnalytics.performanceMetrics.errorRate}%\n\n`;

      // Daily activity
      csvContent += `Daily Activity\nDate,Executions,Errors\n`;
      mockAnalytics.dailyActivity.forEach((day) => {
        csvContent += `${day.date},${day.executions},${day.errors}\n`;
      });
      csvContent += `\n`;

      // Command usage
      csvContent += `Command Usage\nName,Executions,Errors,Avg Response Time,Last Used\n`;
      mockAnalytics.commandUsage.forEach((cmd) => {
        csvContent += `"${cmd.name}",${cmd.executions},${cmd.errors},${cmd.avgResponseTime}ms,"${cmd.lastUsed}"\n`;
      });
      csvContent += `\n`;

      // Error logs
      csvContent += `Error Logs\nID,Timestamp,Message,Severity,Command\n`;
      mockAnalytics.errorLogs.forEach((log) => {
        csvContent += `"${log.id}","${log.timestamp}","${log.message}","${log.severity}","${log.command}"\n`;
      });

      // Set headers for CSV download
      c.header("Content-Type", "text/csv");
      c.header(
        "Content-Disposition",
        `attachment; filename="analytics-${
          new Date().toISOString().split("T")[0]
        }.csv"`
      );

      return c.body(csvContent);
    }
  } catch (error) {
    log("error", "Failed to export analytics data", {
      userId,
      format,
      error: String(error),
    });
    return c.json(
      { error: "Failed to export analytics data. Please try again." },
      500
    );
  }
});
