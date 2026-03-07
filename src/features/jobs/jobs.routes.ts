import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { and, eq, ilike, or } from "drizzle-orm";
import {
  CreateJobSchema,
  JobResponseSchema,
  JobsResponseSchema,
  UpdateJobSchema,
} from "./jobs.schema";
import { db } from "../../db";
import { jobs } from "../../db/schema";

const jobsRouter = new OpenAPIHono();

const createJobRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateJobSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: JobResponseSchema,
        },
      },
      description: "Created the job",
    },
  },
});

const listJobsRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: JobsResponseSchema,
        },
      },
      description: "List of jobs",
    },
  },
});

const searchJobsRoute = createRoute({
  method: "get",
  path: "/search",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: JobsResponseSchema,
        },
      },
      description: "Search results",
    },
  },
});

const getJobRoute = createRoute({
  method: "get",
  path: "/{id}",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: JobResponseSchema,
        },
      },
      description: "Get a single job",
    },
    404: {
      description: "Job not found",
    },
  },
});

const updateJobRoute = createRoute({
  method: "patch",
  path: "/{id}",
  request: {
    body: {
      content: {
        "application/json": {
          schema: UpdateJobSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: JobResponseSchema,
        },
      },
      description: "Updated the job",
    },
    404: {
      description: "Job not found",
    },
  },
});

const deleteJobRoute = createRoute({
  method: "delete",
  path: "/{id}",
  responses: {
    200: {
      description: "Deleted the job",
    },
    404: {
      description: "Job not found",
    },
  },
});

jobsRouter.openapi(createJobRoute, async (c) => {
  const data = c.req.valid("json");
  try {
    const [newJob] = await db.insert(jobs).values(data).returning();
    // Convert Date to ISO string for schema compliance
    const responseData = { ...newJob, createdAt: newJob.createdAt.toISOString() };
    return c.json({ success: true, data: responseData }, 201);
  } catch (error) {
    console.error("Error creating job:", error);
    return c.json({ success: false, error: "Failed to create job" } as any, 500);
  }
});

jobsRouter.openapi(listJobsRoute, async (c) => {
  const page = Number(c.req.query("page")) || 1;
  const limit = Number(c.req.query("limit")) || 10;
  const offset = (page - 1) * limit;

  try {
    const rawData = await db.select().from(jobs).limit(limit).offset(offset);
    const total = await db.$count(jobs);

    const data = rawData.map(j => ({ ...j, createdAt: j.createdAt.toISOString() }));

    return c.json({
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }, 200);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return c.json({ success: false, error: "Failed to fetch jobs" } as any, 500);
  }
});

jobsRouter.openapi(searchJobsRoute, async (c) => {
  const keyword = c.req.query("q");
  const location = c.req.query("location");
  const category = c.req.query("category");

  const filters = [];

  if (keyword) {
    filters.push(
      or(
        ilike(jobs.title, `%${keyword}%`),
        ilike(jobs.description, `%${keyword}%`)
      )
    );
  }

  if (location) {
    filters.push(ilike(jobs.location, `%${location}%`));
  }

  if (category) {
    filters.push(eq(jobs.category, category));
  }

  try {
    const rawData = await db
      .select()
      .from(jobs)
      .where(and(...filters));

    const data = rawData.map(j => ({ ...j, createdAt: j.createdAt.toISOString() }));

    return c.json({ success: true, data }, 200);
  } catch (error) {
    console.error("Error searching jobs:", error);
    return c.json({ success: false, error: "Failed to search jobs" } as any, 500);
  }
});

jobsRouter.openapi(getJobRoute, async (c) => {
  const id = Number(c.req.param("id"));
  try {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    if (!job) return c.json({ success: false, error: "Job not found" } as any, 404);
    const responseData = { ...job, createdAt: job.createdAt.toISOString() };
    return c.json({ success: true, data: responseData }, 200);
  } catch (error) {
    console.error("Error fetching job:", error);
    return c.json({ success: false, error: "Failed to fetch job" } as any, 500);
  }
});

jobsRouter.openapi(updateJobRoute, async (c) => {
  const id = Number(c.req.param("id"));
  const data = c.req.valid("json");
  try {
    const [updatedJob] = await db
      .update(jobs)
      .set(data)
      .where(eq(jobs.id, id))
      .returning();

    if (!updatedJob) return c.json({ success: false, error: "Job not found" } as any, 404);
    const responseData = { ...updatedJob, createdAt: updatedJob.createdAt.toISOString() };
    return c.json({ success: true, data: responseData }, 200);
  } catch (error) {
    console.error("Error updating job:", error);
    return c.json({ success: false, error: "Failed to update job" } as any, 500);
  }
});

jobsRouter.openapi(deleteJobRoute, async (c) => {
  const id = Number(c.req.param("id"));
  try {
    const [deletedJob] = await db.delete(jobs).where(eq(jobs.id, id)).returning();
    if (!deletedJob) return c.json({ success: false, error: "Job not found" } as any, 404);
    return c.json({ success: true, data: { id } } as any, 200);
  } catch (error) {
    console.error("Error deleting job:", error);
    return c.json({ success: false, error: "Failed to delete job" } as any, 500);
  }
});

export default jobsRouter;
