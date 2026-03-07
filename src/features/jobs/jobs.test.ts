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
      }),
      where: (condition: any) => ({
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
          // In some versions/styles, where might be at the end
          where: async (c: any) => [{
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
        // For simple select().where()
        async execute() {
          return [{
            id: 1,
            title: "Software Engineer",
            company: "Tech Corp",
            location: "Remote",
            salary: "$120k - $150k",
            category: "Engineering",
            description: "Develop amazing software.",
            createdAt: new Date()
          }];
        }
      })
    }),
    update: (table: any) => ({
      set: (values: any) => ({
        where: (condition: any) => ({
          returning: async () => {
            return global.lastRequestedId === 1 ? [{
              id: 1,
              title: values.title || "Software Engineer",
              company: "Tech Corp",
              location: "Remote",
              salary: "$120k - $150k",
              category: "Engineering",
              description: "Develop amazing software.",
              createdAt: new Date()
            }] : [];
          }
        })
      })
    }),
    delete: (table: any) => ({
      where: (condition: any) => ({
        returning: async () => {
          return global.lastRequestedId === 1 ? [{ id: 1 }] : [];
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

  describe("PATCH /jobs/:id", () => {
    test("should update an existing job", async () => {
      global.lastRequestedId = 1;
      const updateData = { title: "Senior Software Engineer" };
      const res = await app.request("/jobs/1", {
        method: "PATCH",
        body: JSON.stringify(updateData),
        headers: { "Content-Type": "application/json" },
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.title).toBe(updateData.title);
    });

    test("should return 404 if job not found for update", async () => {
      global.lastRequestedId = 999;
      const res = await app.request("/jobs/999", {
        method: "PATCH",
        body: JSON.stringify({ title: "New Title" }),
        headers: { "Content-Type": "application/json" },
      });
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /jobs/:id", () => {
    test("should delete an existing job", async () => {
      global.lastRequestedId = 1;
      const res = await app.request("/jobs/1", { method: "DELETE" });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
    });

    test("should return 404 if job not found for deletion", async () => {
      global.lastRequestedId = 999;
      const res = await app.request("/jobs/999", { method: "DELETE" });
      expect(res.status).toBe(404);
    });
  });

  describe("GET /jobs/search", () => {
    test("should search jobs by location", async () => {
      const res = await app.request("/jobs/search?location=Remote");
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
    });

    test("should search jobs by category", async () => {
      const res = await app.request("/jobs/search?category=Engineering");
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
    });
  });
});
