/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import RootLayout from "@/app/layout";

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

describe("RootLayout", () => {
  it("renders children correctly", () => {
    const TestChild = () => <div data-testid="test-child">Test Content</div>;
    
    const { getByTestId } = render(
      <RootLayout>
        <TestChild />
      </RootLayout>
    );
    
    // Check if Toaster is rendered
    const toaster = getByTestId("toaster");
    expect(toaster).toBeInTheDocument();
    
    // Check if children are rendered
    const child = getByTestId("test-child");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Test Content");
  });
});
