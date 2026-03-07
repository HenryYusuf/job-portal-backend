import { expect, test, describe } from "bun:test";
import { getTableConfig } from "drizzle-orm/pg-core";
import { jobs } from "./schema";

describe("Job Schema", () => {
  test("should have the correct table name", () => {
    const { name } = getTableConfig(jobs);
    expect(name).toBe("jobs");
  });

  test("should have the correct columns", () => {
    const columns = Object.keys(jobs);
    expect(columns).toContain("id");
    expect(columns).toContain("title");
    expect(columns).toContain("company");
    expect(columns).toContain("location");
    expect(columns).toContain("salary");
    expect(columns).toContain("category");
    expect(columns).toContain("description");
    expect(columns).toContain("createdAt");
  });
});
