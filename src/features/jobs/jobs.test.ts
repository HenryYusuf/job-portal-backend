import { expect, test, describe, mock } from "bun:test";
import app from "../../index";
import { db } from "../../db";

declare global {
  var lastRequestedId: number;
}

mock.module("../../db", () => ({
  db: {
    insert: () => ({
      values: () => ({
        returning: async () => [{
          id: 1,
          title: "Software Engineer",
          company: "Tech Corp",
          location: "Remote",
          salary: "$120k - $150k",
          category: "Engineering",
          description: "Develop amazing software.",
          createdAt: new Date()
        }]
      })
    }),
    select: (args: any) => ({
      from: (table: any) => ({
        limit: (l: number) => ({
          offset: async (o: number) => [{
            id: 1,
            title: "Software Engineer",
            company: "Tech Corp",
            location: "Remote",
            salary: "$120k - $150k",
            category: "Engineering",
            description: "Develop amazing software.",
            createdAt: new Date()
          }]
        }),
        where: async (condition: any) => {
          // This is a hacky way to check if the ID passed was 1 or 999
          // In a real mock we'd inspect the Drizzle condition
          // For now, let's use a closure or global to track the ID requested
          return global.lastRequestedId === 1 ? [{
            id: 1,
            title: "Software Engineer",
            company: "Tech Corp",
            location: "Remote",
            salary: "$120k - $150k",
            category: "Engineering",
            description: "Develop amazing software.",
            createdAt: new Date()
          }] : [];
        }
      })
    }),
    $count: () => Promise.resolve(1)
  }
}));

describe("Jobs API", () => {
  describe("POST /jobs", () => {
    test("should create a new job listing", async () => {
      const jobData = {
        title: "Software Engineer",
        company: "Tech Corp",
        location: "Remote",
        salary: "$120k - $150k",
        category: "Engineering",
        description: "Develop amazing software.",
      };

      const res = await app.request("/jobs", {
        method: "POST",
        body: JSON.stringify(jobData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.title).toBe(jobData.title);
      expect(body.data.id).toBeDefined();
    });
  });

  describe("GET /jobs", () => {
    test("should return a paginated list of jobs", async () => {
      const res = await app.request("/jobs?page=1&limit=10");
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.meta).toBeDefined();
      expect(body.meta.page).toBe(1);
    });
  });

  describe("GET /jobs/:id", () => {
    test("should return a single job by id", async () => {
      global.lastRequestedId = 1;
      const res = await app.request("/jobs/1");
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.id).toBe(1);
    });

    test("should return 404 if job not found", async () => {
      global.lastRequestedId = 999;
      const res = await app.request("/jobs/999");
      expect(res.status).toBe(404);
    });
  });
});
