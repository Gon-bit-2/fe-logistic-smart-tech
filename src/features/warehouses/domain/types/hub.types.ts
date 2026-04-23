export interface HubRecord {
  readonly id: number | string;
  readonly code: string;
  readonly name: string;
  readonly address: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly isActive?: boolean;
  readonly imageUrl?: string | null; // URL ảnh đại diện kho (Cloudinary)
}

export interface HubStaffRecord {
  readonly email: string;
  readonly fullName?: string | null;
  readonly hubId?: number | null;
  readonly id: number;
  readonly phone?: string | null;
  readonly roleId?: number | null;
}

export interface HubDetailRecord extends HubRecord {
  readonly staff: HubStaffRecord[];
  readonly vehicleCount: number;
}

export type HubUpsertInput = {
  address: string;
  code: string;
  latitude?: number;
  longitude?: number;
  name: string;
  imageUrl?: string; // URL ảnh đại diện kho (optional)
};

export type AssignHubStaffInput = {
  userId: number;
};
