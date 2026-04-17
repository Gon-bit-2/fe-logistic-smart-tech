export interface AdoptionRate {
  readonly label: string;
  readonly value: string;
  readonly progress: number;
  readonly tone?: "green" | "blue";
}
