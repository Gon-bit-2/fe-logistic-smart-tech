import { describe, expect, it } from "vitest";
import { mapRoleRequestApiToViewModel } from "./role-request.mapper";

describe("role-request.mapper", () => {
  it("maps nested backend role-request payloads from the live API shape", () => {
    const viewModel = mapRoleRequestApiToViewModel({
      assignedHubId: 3,
      createdAt: "2026-04-20T13:31:53.587Z",
      id: 2,
      reason: "Warehouse e2e-mo78hpyl",
      requester: {
        email: "vanthien7029@gmail.com",
        fullName: "A",
        id: 6,
      },
      status: "PENDING",
      targetRole: {
        id: 4,
        name: "WAREHOUSE_STAFF",
      },
    });

    expect(viewModel.targetRoleName).toBe("WAREHOUSE_STAFF");
    expect(viewModel.targetRoleLabel).toBe("Warehouse Staff");
    expect(viewModel.userDisplayName).toBe("A");
    expect(viewModel.userId).toBe("6");
    expect(viewModel.hubId).toBe(3);
  });

  it("keeps supporting the flatter frontend-oriented payload shape", () => {
    const viewModel = mapRoleRequestApiToViewModel({
      hubId: 5,
      id: "88",
      reason: "Tôi muốn làm tài xế.",
      status: "APPROVED",
      targetRoleName: "DRIVER",
      user: {
        email: "driver@example.com",
        fullName: "Nguyen Van B",
        id: 9,
      },
    });

    expect(viewModel.targetRoleName).toBe("DRIVER");
    expect(viewModel.userDisplayName).toBe("Nguyen Van B");
    expect(viewModel.userId).toBe("9");
    expect(viewModel.hubId).toBe(5);
  });
});
