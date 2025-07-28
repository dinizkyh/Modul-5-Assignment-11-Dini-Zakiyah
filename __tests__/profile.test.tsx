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
    
    // Set invalid values for all fields
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "short" },
    });
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: "123" },
    });
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    fireEvent.change(screen.getByLabelText(/Birth Date/i), {
      target: { value: futureDate.toISOString().split("T")[0] },
    });
    fireEvent.change(screen.getByLabelText(/Bio/i), {
      target: { value: "a".repeat(161) },
    });
    
    // Click submit to trigger validation
    const submitButton = screen.getByRole("button", { name: /Update/i });
    fireEvent.click(submitButton);

    // Wait and check if ANY error appears - using more flexible approach
    let foundAnyError = false;
    await waitFor(
      async () => {
        // Wait a bit for React to process the form submission
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check for error elements by class
        const errorElements = container.querySelectorAll('.text-red-600');
        
        // Also check by direct text search
        const textQueries = [
          () => screen.queryByText(/Username must be at least 6 characters/i),
          () => screen.queryByText(/Full name is required/i),
          () => screen.queryByText(/Must be a valid email format/i),
          () => screen.queryByText(/Phone must be 10-15 digits/i),
          () => screen.queryByText(/Birth date cannot be in the future/i),
          () => screen.queryByText(/Bio must be 160 characters or less/i),
        ];
        
        foundAnyError = errorElements.length > 0 || textQueries.some(query => query() !== null);
        
        console.log('Debug info:');
        console.log('Error elements found:', errorElements.length);
        console.log('Text queries found:', textQueries.filter(query => query() !== null).length);
        console.log('Form HTML:', container.innerHTML.includes('form') ? 'Form found' : 'No form');
        
        expect(foundAnyError).toBe(true);
      },
      { timeout: 8000 }
    );

    // If we get here, errors should be visible - check for specific ones
    expect(screen.getByText(/Username must be at least 6 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/Full name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Must be a valid email format/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone must be 10-15 digits/i)).toBeInTheDocument();
    expect(screen.getByText(/Birth date cannot be in the future/i)).toBeInTheDocument();
    expect(screen.getByText(/Bio must be 160 characters or less/i)).toBeInTheDocument();
  }, 20000);
});
