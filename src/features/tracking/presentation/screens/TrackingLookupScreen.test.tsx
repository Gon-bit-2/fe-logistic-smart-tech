import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import viMessages from "@/messages/vi.json";
const trackingLookupCopy = viMessages.tracking.lookup;
import { renderWithProviders } from "@/test/render";
import TrackingLookupScreen from "./TrackingLookupScreen";

describe("TrackingLookupScreen", () => {
  it("navigates to the detail page when a tracking code is entered", () => {
    const { router } = renderWithProviders(<TrackingLookupScreen />);

    fireEvent.change(screen.getByPlaceholderText(trackingLookupCopy.inputPlaceholder), {
      target: { value: " ELG-2026-0001 " },
    });
    fireEvent.click(
      screen.getByRole("button", { name: trackingLookupCopy.trackButton }),
    );

    expect(router.push).toHaveBeenCalledWith("/tracking/ELG-2026-0001");
  });

  it("does not navigate for blank input", () => {
    const { router } = renderWithProviders(<TrackingLookupScreen />);

    fireEvent.click(
      screen.getByRole("button", { name: trackingLookupCopy.trackButton }),
    );

    expect(router.push).not.toHaveBeenCalled();
  });
});
