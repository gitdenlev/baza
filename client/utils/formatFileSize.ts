export function formatFileSize(bytes?: number | bigint | null) {
  if (bytes === null || bytes === undefined) return "—";

  const num = typeof bytes === "bigint" ? Number(bytes) : bytes;

  if (!Number.isFinite(num) || num <= 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(num) / Math.log(k));
  const value = num / Math.pow(k, i);

  return `${value.toFixed(1)} ${sizes[i]}`;
}
