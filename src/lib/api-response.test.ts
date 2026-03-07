import { expect, test, describe } from "bun:test";
import { sendSuccess } from "./api-response";

describe("ApiResponse Utilities", () => {
  describe("sendSuccess", () => {
    test("should format a standard success response", () => {
      const data = { id: 1, name: "Test" };
      const response = sendSuccess(data);
      
      expect(response).toEqual({
        success: true,
        data: data,
      });
    });

    test("should include metadata when provided", () => {
      const data = [{ id: 1 }];
      const meta = { total: 1 };
      const response = sendSuccess(data, meta);
      
      expect(response).toEqual({
        success: true,
        data: data,
        meta: meta,
      });
    });
  });
});
