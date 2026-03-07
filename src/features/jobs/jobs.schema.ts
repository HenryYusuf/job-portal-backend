import { z } from "@hono/zod-openapi";

export const JobSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  title: z.string().openapi({ example: "Software Engineer" }),
  company: z.string().openapi({ example: "Tech Corp" }),
  location: z.string().openapi({ example: "Remote" }),
  salary: z.string().optional().openapi({ example: "$120k - $150k" }),
  category: z.string().openapi({ example: "Engineering" }),
  description: z.string().openapi({ example: "Develop amazing software." }),
  createdAt: z.string().openapi({ example: "2026-03-07T14:30:00Z" }),
}).openapi("Job");

export const CreateJobSchema = z.object({
  title: z.string().min(1).openapi({ example: "Software Engineer" }),
  company: z.string().min(1).openapi({ example: "Tech Corp" }),
  location: z.string().min(1).openapi({ example: "Remote" }),
  salary: z.string().optional().openapi({ example: "$120k - $150k" }),
  category: z.string().min(1).openapi({ example: "Engineering" }),
  description: z.string().min(1).openapi({ example: "Develop amazing software." }),
}).openapi("CreateJob");

export const UpdateJobSchema = CreateJobSchema.partial().openapi("UpdateJob");

export const JobResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  data: JobSchema,
}).openapi("JobResponse");

export const JobsResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  data: z.array(JobSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }).optional(),
}).openapi("JobsResponse");
