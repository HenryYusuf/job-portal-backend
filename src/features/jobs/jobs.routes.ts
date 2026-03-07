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

export default jobsRouter;
