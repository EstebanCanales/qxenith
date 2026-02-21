export interface BarConfig {
  color: string;
  contrast: string;
  labels: [string, string];
  speed: number;
}

export const COLORS = [
  { color: "#06D6A0", contrast: "#04805F" },
  { color: "#FF6B6B", contrast: "#A03030" },
  { color: "#845EF7", contrast: "#4A2DA0" },
  { color: "#FCC419", contrast: "#9A7500" },
  { color: "#22B8CF", contrast: "#136B78" },
];

export const SPEEDS = [0.08, 0.12, 0.05, 0.15, 0.09];
export const CIRCLE_SIZE = 18;
