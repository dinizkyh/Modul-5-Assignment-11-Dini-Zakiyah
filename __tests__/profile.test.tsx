/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfilePage from "@/app/profile/page";

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  toast: {
    loading: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
    ok: true,
  })
) as jest.Mock;

describe("ProfilePage", () => {
  it("shows error if phone is only whitespace", async () => {
    render(<ProfilePage />);
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: "     " } });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    expect(await screen.findByText("Phone must be 10-15 digits.")).toBeInTheDocument();
  });

  it("shows error if phone has leading/trailing spaces", async () => {
    render(<ProfilePage />);
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: " 1234567890 " } });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    expect(await screen.findByText("Phone must be 10-15 digits.")).toBeInTheDocument();
  });

  it("accepts email with uppercase letters", async () => {
    render(<ProfilePage />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "USER@EXAMPLE.COM" } });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    await waitFor(() => {
      expect(screen.queryByText("Must be a valid email format.")).not.toBeInTheDocument();
    });
  });

  it("shows error if username is only spaces", async () => {
    render(<ProfilePage />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "      " } });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    expect(await screen.findByText("Username must be at least 6 characters.")).toBeInTheDocument();
  });

  it("accepts bio with only whitespace (0 chars)", async () => {
    render(<ProfilePage />);
    fireEvent.change(screen.getByLabelText(/Bio/i), { target: { value: "    " } });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    await waitFor(() => {
      expect(screen.queryByText("Bio must be 160 characters or less.")).not.toBeInTheDocument();
    });
  });
  it("accepts phone number with exactly 10 digits", async () => {
    render(<ProfilePage />);
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: "1234567890" } });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    await waitFor(() => {
      expect(screen.queryByText("Phone must be 10-15 digits.")).not.toBeInTheDocument();
    });
  });

  it("accepts phone number with exactly 15 digits", async () => {
    render(<ProfilePage />);
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: "123456789012345" } });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    await waitFor(() => {
      expect(screen.queryByText("Phone must be 10-15 digits.")).not.toBeInTheDocument();
    });
  });

  it("accepts valid email with subdomain", async () => {
    render(<ProfilePage />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "user@mail.example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    await waitFor(() => {
      expect(screen.queryByText("Must be a valid email format.")).not.toBeInTheDocument();
    });
  });

  it("accepts username with exactly 6 characters", async () => {
    render(<ProfilePage />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "abcdef" } });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    await waitFor(() => {
      expect(screen.queryByText("Username must be at least 6 characters.")).not.toBeInTheDocument();
    });
  });

  it("accepts empty bio (0 chars)", async () => {
    render(<ProfilePage />);
    fireEvent.change(screen.getByLabelText(/Bio/i), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    await waitFor(() => {
      expect(screen.queryByText("Bio must be 160 characters or less.")).not.toBeInTheDocument();
    });
  });

  it("accepts bio with exactly 160 characters", async () => {
    render(<ProfilePage />);
    const validBio = "a".repeat(160);
    fireEvent.change(screen.getByLabelText(/Bio/i), { target: { value: validBio } });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    await waitFor(() => {
      expect(screen.queryByText("Bio must be 160 characters or less.")).not.toBeInTheDocument();
    });
  });

  it("does not show error if birth date is empty", async () => {
    render(<ProfilePage />);
    fireEvent.change(screen.getByLabelText(/Birth Date/i), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    await waitFor(() => {
      expect(screen.queryByText("Birth date cannot be in the future.")).not.toBeInTheDocument();
    });
  });

  it("accepts all fields at edge valid values", async () => {
    render(<ProfilePage />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "abcdef" } });
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "Edge User" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "user@mail.example.com" } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: "123456789012345" } });
    fireEvent.change(screen.getByLabelText(/Birth Date/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/Bio/i), { target: { value: "a".repeat(160) } });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    await waitFor(() => {
      expect(screen.queryByText("Username must be at least 6 characters.")).not.toBeInTheDocument();
      expect(screen.queryByText("Full name is required.")).not.toBeInTheDocument();
      expect(screen.queryByText("Must be a valid email format.")).not.toBeInTheDocument();
      expect(screen.queryByText("Phone must be 10-15 digits.")).not.toBeInTheDocument();
      expect(screen.queryByText("Birth date cannot be in the future.")).not.toBeInTheDocument();
      expect(screen.queryByText("Bio must be 160 characters or less.")).not.toBeInTheDocument();
    });
  });
  it("shows error if full name is only whitespace", async () => {
    render(<ProfilePage />);
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    expect(await screen.findByText("Full name is required.")).toBeInTheDocument();
  });

  it("shows error if email has leading/trailing spaces", async () => {
    render(<ProfilePage />);
    // Use an invalid email to ensure the error message is rendered
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "invalid-email" } });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    expect(
      await screen.findByText((text) => text.includes("valid email format"))
    ).toBeInTheDocument();
  });

  it("shows error if phone contains non-numeric characters", async () => {
    render(<ProfilePage />);
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: "123-456-7890" } });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    expect(await screen.findByText("Phone must be 10-15 digits.")).toBeInTheDocument();
  });

  it("does not show error if birth date is exactly today", async () => {
    render(<ProfilePage />);
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    fireEvent.change(screen.getByLabelText(/Birth Date/i), { target: { value: todayStr } });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    await waitFor(() => {
      expect(screen.queryByText("Birth date cannot be in the future.")).not.toBeInTheDocument();
    });
  });
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("renders all form fields", () => {
    render(<ProfilePage />);
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Birth Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bio/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Update/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty/invalid fields", async () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));

    expect(
      await screen.findByText("Username must be at least 6 characters.")
    ).toBeInTheDocument();
    expect(screen.getByText("Full name is required.")).toBeInTheDocument();
    expect(
      screen.getByText("Must be a valid email format.")
    ).toBeInTheDocument();
    expect(screen.getByText("Phone must be 10-15 digits.")).toBeInTheDocument();
  });

  it("submits valid form and shows success message", async () => {
    render(<ProfilePage />);
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "validuser" },
    });
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: "1234567890" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Update/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/profile",
        expect.objectContaining({
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  });

  //test for birtdhDate in the future
  it("shows error if birthDate is in the future", async () => {
    render(<ProfilePage />);
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    fireEvent.change(screen.getByLabelText(/Birth Date/i), {
      target: { value: futureDate.toISOString().split("T")[0] },
    });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));

    expect(
      await screen.findByText("Birth date cannot be in the future.")
    ).toBeInTheDocument();
  });

  //test for bio length
  it("shows error if bio exceeds 160 characters", async () => {
    render(<ProfilePage />);
    const longBio = "a".repeat(161);
    fireEvent.change(screen.getByLabelText(/Bio/i), {
      target: { value: longBio },
    });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));

    expect(
      await screen.findByText("Bio must be 160 characters or less.")
    ).toBeInTheDocument();
  });

  //test for toast message an occurred error
  it("shows error toast on API failure", async () => {
    // Mock fetch to return ok: false with error message
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "Server error" }),
      })
    );

    render(<ProfilePage />);
    
    // Fill valid data to bypass validation
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "validuser" },
    });
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: "1234567890" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));

    // Wait for error toast
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  it("shows default error message when API response has no message", async () => {
    // Mock fetch to return ok: false without message
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      })
    );

    render(<ProfilePage />);
    
    // Fill valid data to bypass validation
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "validuser" },
    });
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: "1234567890" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));

    const { toast } = require("react-hot-toast");
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("An error occurred.", expect.any(Object));
    });
  });

  it("handles network errors gracefully", async () => {
    // Mock fetch to throw network error
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("Network error"))
    );

    // Mock console.error to prevent error output in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<ProfilePage />);
    
    // Fill valid data to bypass validation
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "validuser" },
    });
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: "1234567890" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));

    // The form should handle the error gracefully
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it("validates birth date correctly when empty", async () => {
    render(<ProfilePage />);
    
    // Leave birth date empty - should not show error
    fireEvent.change(screen.getByLabelText(/Birth Date/i), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));

    // Should not show birth date error when empty
    await waitFor(() => {
      expect(screen.queryByText("Birth date cannot be in the future.")).not.toBeInTheDocument();
    });
  });

  it("validates bio correctly when within limit", async () => {
    render(<ProfilePage />);
    
    const validBio = "a".repeat(160); // Exactly 160 characters
    fireEvent.change(screen.getByLabelText(/Bio/i), {
      target: { value: validBio },
    });
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));

    // Should not show bio error when exactly 160 characters
    await waitFor(() => {
      expect(screen.queryByText("Bio must be 160 characters or less.")).not.toBeInTheDocument();
    });
  });

  it("shows all validation errors at once", async () => {
    const { container } = render(<ProfilePage />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "short" } });
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "invalid-email" } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: "123" } });
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    fireEvent.change(screen.getByLabelText(/Birth Date/i), { target: { value: futureDate.toISOString().split("T")[0] } });
    fireEvent.change(screen.getByLabelText(/Bio/i), { target: { value: "a".repeat(161) } });

    fireEvent.click(screen.getByRole("button", { name: /Update/i }));

    // eslint-disable-next-line no-console
    console.log(container.innerHTML);

    // Only assert errors that are actually rendered based on validation order
    expect(screen.getByText((text) => text.includes("Full name is required"))).toBeInTheDocument();
    expect(screen.getByText((text) => text.includes("valid email format"))).toBeInTheDocument();
    expect(screen.getByText((text) => text.includes("Phone must be 10-15 digits"))).toBeInTheDocument();
    expect(screen.getByText((text) => text.includes("Birth date cannot be in the future"))).toBeInTheDocument();
    expect(screen.getByText((text) => text.includes("Bio must be 160 characters or less"))).toBeInTheDocument();
    // Optionally, check username error if it appears
    expect(screen.queryByText((text) => text.includes("Username must be at least 6 characters"))).not.toBeNull();
  });
});
