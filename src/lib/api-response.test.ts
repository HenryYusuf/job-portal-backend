import { expect, test, describe } from "bun:test";
import { sendSuccess, sendError } from "./api-response";

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

  describe("sendError", () => {
    test("should format a standard error response", () => {
      const message = "Something went wrong";
      const response = sendError(message);
      
      expect(response).toEqual({
        success: false,
        error: {
          message: message,
        },
      });
    });

    test("should include error code when provided", () => {
      const message = "Invalid input";
      const code = "VALIDATION_ERROR";
      const response = sendError(message, code);
      
      expect(response).toEqual({
        success: false,
        error: {
          message: message,
          code: code,
        },
      });
    });
  });
});
