/**
 * @jest-environment node
 */
import { POST } from "@/app/api/login/route";
import { NextRequest } from "next/server";
import { it } from "node:test";

describe("POST /api/login", () => {
  it("should return 400 if email is missing", async () => {
    const request = new NextRequest("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify({ password: "password123" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.message).toBe("Email and password are required.");
  });

  // unit test untuk api login if email is missing 
  it("should return 400 if password is missing", async () => {
    const request = new NextRequest("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.message).toBe("Email and password are required.");
  });

  it("should return 400 if both email and password are missing", async () => {
    const request = new NextRequest("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.message).toBe("Email and password are required.");
  });

  it("should return 400 if password is too short", async () => {
    const request = new NextRequest("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com", password: "pass" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.message).toBe("Password must be at least 6 characters.");
  });

  it("should return 401 for invalid credentials", async () => {
    const request = new NextRequest("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify({ email: "wrong@example.com", password: "wrongpass" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(401);
    
    const data = await response.json();
    expect(data.message).toBe("Invalid credentials.");
  });

  it("should return 200 if email and password are provided", async () => {
    const request = new NextRequest("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com", password: "password123" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.message).toBe("Login successful!");
  });

 });
function expect(status: any) {
  return {
    toBe: (expected: any) => {
      if (status !== expected) {
        throw new Error(`Expected ${status} to be ${expected}`);
      }
    }
  };
}

