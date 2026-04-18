import { hasApiBaseUrl } from "@/lib/api/env";
import { listHubsRequest } from "@/features/fleet/infrastructure/api/hubs.api";

export async function listHubsUseCase() {
  if (!hasApiBaseUrl) {
    throw new Error("API chưa được cấu hình.");
  }
  return listHubsRequest();
}
