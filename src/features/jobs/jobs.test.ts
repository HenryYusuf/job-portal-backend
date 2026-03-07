import { expect, test, describe, mock } from "bun:test";
import app from "../../index";
import { db } from "../../db";

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
    })
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
});
