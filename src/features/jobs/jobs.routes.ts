import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createJobSchema } from "./jobs.schema";
import { db } from "../../db";
import { jobs } from "../../db/schema";

const jobsRouter = new Hono();

jobsRouter.post("/", zValidator("json", createJobSchema), async (c) => {
  const data = c.req.valid("json");
  
  try {
    const [newJob] = await db.insert(jobs).values(data).returning();
    return c.json({ success: true, data: newJob }, 201);
  } catch (error) {
    console.error("Error creating job:", error);
    return c.json({ success: false, error: "Failed to create job" }, 500);
  }
});

jobsRouter.get("/", async (c) => {
  const page = Number(c.req.query("page")) || 1;
  const limit = Number(c.req.query("limit")) || 10;
  const offset = (page - 1) * limit;

  try {
    const data = await db.select().from(jobs).limit(limit).offset(offset);
    const total = await db.$count(jobs);

    return c.json({
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return c.json({ success: false, error: "Failed to fetch jobs" }, 500);
  }
});

export default jobsRouter;
