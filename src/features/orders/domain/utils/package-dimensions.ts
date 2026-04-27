export type PackageDimensionsParts = {
  height: number;
  length: number;
  width: number;
};

function formatDimensionPart(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

export function parsePackageDimensions(
  value: string,
): PackageDimensionsParts | null {
  const normalizedValue = value
    .trim()
    .toLowerCase()
    .replace(/[×*]/g, "x")
    .replace(/cm|mm|m/g, " ");

  const parts = (normalizedValue.match(/(\d+(?:[.,]\d+)?)/g) ?? [])
    .map((part) => Number(part.replace(",", ".")))
    .filter((part) => Number.isFinite(part) && part > 0);

  if (parts.length !== 3) {
    return null;
  }

  const [length, width, height] = parts;

  return { height, length, width };
}

export function hasValidPackageDimensions(value: string) {
  return parsePackageDimensions(value) !== null;
}

export function normalizePackageDimensionsInput(value: string) {
  const parts = parsePackageDimensions(value);

  if (!parts) {
    return value.trim();
  }

  return [
    formatDimensionPart(parts.length),
    formatDimensionPart(parts.width),
    formatDimensionPart(parts.height),
  ].join("x");
}
