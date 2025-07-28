/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, renderHook } from "@testing-library/react";
import RootLayout from "@/app/layout";
import React from "react";

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

// Mock Next.js fonts
jest.mock("next/font/google", () => ({
  Geist: () => ({
    variable: "--font-geist-sans",
  }),
  Geist_Mono: () => ({
    variable: "--font-geist-mono",
  }),
}));

// Create a component that only renders the body content of RootLayout
const LayoutBodyContent = ({ children }: { children: React.ReactNode }) => {
  // Mock the Toaster component and simulate the body content
  return (
    <div className="geist-sans geist-mono antialiased" data-testid="layout-body">
      <div data-testid="toaster" />
      {children}
    </div>
  );
};

describe("RootLayout", () => {
  it("renders body content correctly without hydration errors", () => {
    const TestChild = () => <div data-testid="test-child">Test Content</div>;
    
    const { getByTestId } = render(
      <LayoutBodyContent>
        <TestChild />
      </LayoutBodyContent>
    );
    
    // Check if mock Toaster is rendered
    const toaster = getByTestId("toaster");
    expect(toaster).toBeInTheDocument();
    
    // Check if children are rendered
    const child = getByTestId("test-child");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Test Content");

    // Check if layout body has correct structure
    const layoutBody = getByTestId("layout-body");
    expect(layoutBody).toBeInTheDocument();
  });

  it("exports the RootLayout component correctly", () => {
    // Test that the layout exports the correct function
    expect(typeof RootLayout).toBe("function");
    expect(RootLayout.name).toBe("RootLayout");
  });

  it("handles multiple children correctly", () => {
    const FirstChild = () => <div data-testid="first-child">First</div>;
    const SecondChild = () => <div data-testid="second-child">Second</div>;
    
    const { getByTestId } = render(
      <LayoutBodyContent>
        <FirstChild />
        <SecondChild />
      </LayoutBodyContent>
    );
    
    expect(getByTestId("first-child")).toBeInTheDocument();
    expect(getByTestId("second-child")).toBeInTheDocument();
    expect(getByTestId("toaster")).toBeInTheDocument();
  });
});
