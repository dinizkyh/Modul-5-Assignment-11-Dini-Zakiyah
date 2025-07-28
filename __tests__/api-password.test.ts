/**
 * @jest-environment node
 */
import { POST } from "@/app/api/password/route";

describe("POST /api/password", () => {
  it("should return 501 Not Implemented", async () => {
    const response = await POST();
    expect(response.status).toBe(501);
    
    const data = await response.json();
    expect(data.message).toBe("Not implemented");
  });
});

function expect(actual: any) {
  return {
    toBe: (expected: any) => {
      if (actual !== expected) {
        throw new Error(`Expected ${actual} to be ${expected}`);
      }
    },
    toHaveBeenCalled: () => {
      if (typeof actual !== 'function' || !actual.mock || actual.mock.calls.length === 0) {
        throw new Error('Expected function to have been called');
      }
    },
    toHaveBeenCalledWith: (...args: any[]) => {
      if (typeof actual !== 'function' || !actual.mock) {
        throw new Error('Expected function to have been called');
      }
      const lastCall = actual.mock.calls[actual.mock.calls.length - 1];
      if (JSON.stringify(lastCall) !== JSON.stringify(args)) {
        throw new Error(`Expected function to have been called with ${JSON.stringify(args)}, but was called with ${JSON.stringify(lastCall)}`);
      }
    }
  };
}
