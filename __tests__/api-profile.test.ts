import { PUT } from "@/app/api/profile/route";
import { NextResponse } from "next/server";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data) => ({
      ...data,
      json: () => Promise.resolve(data),
    })),
  },
}));

const getValidProfileData = () => ({
  username: "validuser",
  fullName: "Valid User",
  email: "valid@email.com",
  phone: "1234567890",
});

describe("API /api/profile", () => {
  beforeEach(() => {
    (NextResponse.json as jest.Mock).mockClear();
  });

  it("should return 400 if username is too short", async () => {
    const invalidData = { ...getValidProfileData(), username: "short" };
    const req = {
      json: () => Promise.resolve(invalidData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: { username: "Username must be at least 6 characters." },
      },
      { status: 400 }
    );
  });

  // test for birtdhDate in the future
  it("should return 400 if birthDate is in the future", async () => { 
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const invalidData = { ...getValidProfileData(), birthDate: futureDate.toISOString() };
    const req = {
      json: () => Promise.resolve(invalidData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: { birthDate: "Birth date cannot be in the future." },
      },
      { status: 400 }
    );
  })
    

  it("should return 400 if fullName is missing", async () => {
    const invalidData = { ...getValidProfileData(), fullName: "" };
    const req = {
      json: () => Promise.resolve(invalidData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: { fullName: "Full name is required." },
      },
      { status: 400 }
    );
  });

  it("should return 200 on valid data", async () => {
    const validData = getValidProfileData();
    const req = {
      json: () => Promise.resolve(validData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith({
      success: true,
    });
  });

  it("should return 400 if bio is longer than 160 characters", async () => {
  const longBio = "a".repeat(161);
  const invalidData = { ...getValidProfileData(), bio: longBio };
  const req = {
    json: () => Promise.resolve(invalidData),
  } as Request;
  await PUT(req);
  expect(NextResponse.json).toHaveBeenCalledWith(
    {
      message: "Validation failed",
      errors: { bio: "Bio must be 160 characters or less." },
    },
    { status: 400 }
  );
});

//test for toast if update is error
  it("should return 400 if email is invalid", async () => {
    const invalidData = { ...getValidProfileData(), email: "invalidemail" };
    const req = {
      json: () => Promise.resolve(invalidData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: { email: "Must be a valid email format." },
      },
      { status: 400 }
    );
  });

  //phone number validation must be 10-15 digits
  it("should return 400 if phone number is invalid", async () => {
    const invalidData = { ...getValidProfileData(), phone: "12345" };
    const req = {
      json: () => Promise.resolve(invalidData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: { phone: "Phone must be 10-15 digits." },
      },
      { status: 400 }
    );
  });

  it("should handle multiple validation errors", async () => {
    const invalidData = {
      username: "short",
      fullName: "",
      email: "invalid-email",
      phone: "123",
      bio: "a".repeat(161)
    };
    const req = {
      json: () => Promise.resolve(invalidData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: {
          username: "Username must be at least 6 characters.",
          fullName: "Full name is required.",
          email: "Must be a valid email format.",
          phone: "Phone must be 10-15 digits.",
          bio: "Bio must be 160 characters or less."
        },
      },
      { status: 400 }
    );
  });

  it("should return 200 when all optional fields are provided", async () => {
    const validData = {
      ...getValidProfileData(),
      birthDate: "1990-01-01",
      bio: "This is a valid bio"
    };
    const req = {
      json: () => Promise.resolve(validData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith({
      success: true,
    });
  });

});
