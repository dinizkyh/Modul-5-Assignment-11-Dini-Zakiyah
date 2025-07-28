/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home Page", () => {
  it("renders the main content", () => {
    render(<Home />);
    
    // Check for the Next.js logo
    const logo = screen.getByAltText("Next.js logo");
    expect(logo).toBeInTheDocument();
    
    // Check for instructional text
    expect(screen.getByText(/Get started by editing/)).toBeInTheDocument();
    expect(screen.getByText(/Save and see your changes instantly/)).toBeInTheDocument();
    
    // Check for the code snippet
    expect(screen.getByText("src/app/page.tsx")).toBeInTheDocument();
  });

  it("renders external links", () => {
    render(<Home />);
    
    // Check for Deploy now link
    const deployLink = screen.getByText("Deploy now").closest("a");
    expect(deployLink).toHaveAttribute("href", expect.stringContaining("vercel.com"));
    expect(deployLink).toHaveAttribute("target", "_blank");
    expect(deployLink).toHaveAttribute("rel", "noopener noreferrer");
    
    // Check for Read our docs link
    const docsLink = screen.getByText("Read our docs").closest("a");
    expect(docsLink).toHaveAttribute("href", expect.stringContaining("nextjs.org"));
    expect(docsLink).toHaveAttribute("target", "_blank");
    expect(docsLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders Vercel logo", () => {
    render(<Home />);
    
    const vercelLogo = screen.getByAltText("Vercel logomark");
    expect(vercelLogo).toBeInTheDocument();
  });
});
