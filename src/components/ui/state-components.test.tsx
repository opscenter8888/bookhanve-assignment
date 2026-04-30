import { render, screen } from "@testing-library/react";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";

test("renders loading and error states with accessible roles", () => {
  render(
    <>
      <LoadingState message="Loading catalog" />
      <ErrorState title="Catalog unavailable" message="Try again later." />
    </>
  );

  expect(screen.getByRole("status")).toHaveTextContent("Loading catalog");
  expect(screen.getByRole("alert")).toHaveTextContent("Catalog unavailable");
});
