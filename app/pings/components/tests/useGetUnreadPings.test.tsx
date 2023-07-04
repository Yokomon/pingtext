import { renderHook } from "@testing-library/react";
import { useGetUnreadPings } from "../hooks/useGetUnreadPings";
import { mock_currentUser, mock_newPings2, mock_pings } from "./__mocks__";

describe("useGetUnreadPings specs", () => {
  it("should calculate the correct number of unread pings", () => {
    const {
      result: { current },
    } = renderHook(() => useGetUnreadPings(mock_pings, mock_currentUser));

    expect(current.unreadPings).toBe(1);
  });

  it("should calculate the correct number of unread pings: tests for 0 count", () => {
    const newPings = mock_pings.slice(mock_pings.length);

    const {
      result: { current },
    } = renderHook(() => useGetUnreadPings(newPings, mock_currentUser));

    expect(current.unreadPings).toBe(0);
  });

  it("should calculate the correct number of unread pings: tests for 3 counts", () => {
    const {
      result: { current },
    } = renderHook(() =>
      useGetUnreadPings(mock_pings.concat(mock_newPings2), mock_currentUser)
    );

    expect(current.unreadPings).toBe(3);
  });
});
