export interface HubRecord {
  readonly id: number | string;
  readonly code: string;
  readonly name: string;
  readonly address: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly isActive?: boolean;
}
