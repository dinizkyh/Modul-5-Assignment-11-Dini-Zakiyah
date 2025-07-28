/**
 * @jest-environment node
 */
it("should return 400 if email is null", async () => {
  const req = makeRequest({ email: null, password: "password123" });
  const res = await POST(req);
  expect(res.status).toBe(400);
  const data = await res.json();
  expect(data.message).toBe("Email and password are required.");
});

it("should return 400 if password is null", async () => {
  const req = makeRequest({ email: "test@example.com", password: null });
  const res = await POST(req);
  expect(res.status).toBe(400);
  const data = await res.json();
  expect(data.message).toBe("Email and password are required.");
});

it("should return 400 if email is undefined", async () => {
  const req = makeRequest({ password: "password123" });
  req.json = () => Promise.resolve({ email: undefined, password: "password123" });
  const res = await POST(req);
  expect(res.status).toBe(400);
  const data = await res.json();
  expect(data.message).toBe("Email and password are required.");
});

it("should return 400 if password is undefined", async () => {
  const req = makeRequest({ email: "test@example.com" });
  req.json = () => Promise.resolve({ email: "test@example.com", password: undefined });
  const res = await POST(req);
  expect(res.status).toBe(400);
  const data = await res.json();
  expect(data.message).toBe("Email and password are required.");
});

it("should return 400 if email is a number", async () => {
  const req = makeRequest({ email: 12345, password: "password123" });
  const res = await POST(req);
  expect(res.status).toBe(400);
  const data = await res.json();
  expect(data.message).toBe("Email and password are required.");
});

it("should return 400 if password is a number", async () => {
  const req = makeRequest({ email: "test@example.com", password: 12345 });
  const res = await POST(req);
  expect(res.status).toBe(400);
  const data = await res.json();
  expect(data.message).toBe("Email and password are required.");
});

it("should return 400 if email is an object", async () => {
  const req = makeRequest({ email: { foo: "bar" }, password: "password123" });
  const res = await POST(req);
  expect(res.status).toBe(400);
  const data = await res.json();
  expect(data.message).toBe("Email and password are required.");
});

it("should return 400 if password is an object", async () => {
  const req = makeRequest({ email: "test@example.com", password: { foo: "bar" } });
  const res = await POST(req);
  expect(res.status).toBe(400);
  const data = await res.json();
  expect(data.message).toBe("Email and password are required.");
});
  it("should return 400 if email and password are empty strings", async () => {
    const req = makeRequest({ email: "", password: "" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toBe("Email and password are required.");
  });
import { POST } from "@/app/api/login/route";

  
  const makeRequest = (body: any) => ({
    json: () => Promise.resolve(body),
  }) as any;

  it("should return 400 if email is missing", async () => {
    const req = makeRequest({ password: "password123" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toBe("Email and password are required.");
  });

  it("should return 400 if password is missing", async () => {
    const req = makeRequest({ email: "test@example.com" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toBe("Email and password are required.");
  });

  it("should return 400 if both email and password are missing", async () => {
    const req = makeRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toBe("Email and password are required.");
  });

  it("should return 400 if password is too short", async () => {
    const req = makeRequest({ email: "test@example.com", password: "pass" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toBe("Password must be at least 6 characters.");
  });

  it("should return 401 for invalid credentials", async () => {
    const req = makeRequest({ email: "wrong@example.com", password: "wrongpass" });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.message.toLowerCase()).toMatch(/invalid/);
  });

  it("should return 200 for valid credentials", async () => {
    const req = makeRequest({ email: "test@example.com", password: "password123" });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message.toLowerCase()).toMatch(/login successful/);
  });
  it("should return 401 for valid email but wrong password", async () => {
    const req = makeRequest({ email: "test@example.com", password: "wrongpass" });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.message.toLowerCase()).toMatch(/invalid/);
  });

