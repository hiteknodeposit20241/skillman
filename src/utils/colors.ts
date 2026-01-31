const enabled = process.stdout.isTTY !== false;

function code(n: number): string {
  return enabled ? `\x1B[${n}m` : "";
}

export const c = {
  reset: code(0),
  bold: code(1),
  dim: code(2),
  red: code(31),
  green: code(32),
  yellow: code(33),
  blue: code(34),
  magenta: code(35),
  cyan: code(36),
};
