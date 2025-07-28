import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page";

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  toast: {
    loading: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("LoginPage", () => {
  it("should render the login form", () => {
    render(<LoginPage />);
    
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });
  
    // Unit test for <LoginForm />
    // should show error if email is empty
  it("should show error if email is empty", async () => {
    render(<LoginPage />);
    
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Login" });
    
    // Fill password but leave email empty
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Fill password but less than 6 characters
    fireEvent.change(passwordInput, { target: { value: "pass" } });
    
    // Submit the form
    fireEvent.click(submitButton);
    
    // Wait for validation error to appear
    await waitFor(() => {
      expect(screen.getByText("Email is required.")).toBeInTheDocument();
    });
  });

  //unit test for <LoginForm />
  //should show toast loading when logi
  it("should show toast success on successful login", async () => {
  // Mock fetch to return ok: true
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  ) as jest.Mock;

  render(<LoginPage />);
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  const { toast } = require("react-hot-toast");
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith("Login successful!", expect.any(Object));
  });
});

it("should show toast error on failed login", async () => {
  // Mock fetch to return ok: false
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ message: "An error occurred." }),
    })
  ) as jest.Mock;

  render(<LoginPage />);
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  const { toast } = require("react-hot-toast");
  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith("An error occurred.", expect.any(Object));
  });
});

it("should toggle password visibility when eye icon is clicked", () => {
  render(<LoginPage />);
  
  const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
  const toggleButton = screen.getByRole("button", { name: "Show password" });
  
  // Initially password should be hidden
  expect(passwordInput.type).toBe("password");
  
  // Click to show password
  fireEvent.click(toggleButton);
  expect(passwordInput.type).toBe("text");
  
  // Click again to hide password
  const hideButton = screen.getByRole("button", { name: "Hide password" });
  fireEvent.click(hideButton);
  expect(passwordInput.type).toBe("password");
});

it("should show correct error message for API response without message", async () => {
  // Mock fetch to return ok: false without message
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({}),
    })
  ) as jest.Mock;

  render(<LoginPage />);
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  const { toast } = require("react-hot-toast");
  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith("An error occurred.", expect.any(Object));
  });
});

it("should show password validation error for short password", async () => {
  render(<LoginPage />);
  
  const emailInput = screen.getByLabelText("Email");
  const passwordInput = screen.getByLabelText("Password");
  const submitButton = screen.getByRole("button", { name: "Login" });
  
  // Fill email and short password
  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "pass" } });
  
  // Submit the form
  fireEvent.click(submitButton);
  
  // Wait for validation error to appear
  await waitFor(() => {
    expect(screen.getByText("Password must be at least 6 characters.")).toBeInTheDocument();
  });
});

it("should handle fetch error gracefully", async () => {
  // Mock fetch to throw an error
  global.fetch = jest.fn(() => Promise.reject(new Error("Network error"))) as jest.Mock;

  // Mock console.error to prevent error output in tests
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

  render(<LoginPage />);
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  const { toast } = require("react-hot-toast");
  await waitFor(() => {
    expect(toast.error).toHaveBeenCalled();
  });

  consoleSpy.mockRestore();
});

});
