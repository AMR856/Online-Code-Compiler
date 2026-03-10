import CustomError from "../types/customError";
import { HttpStatusText } from "../types/HTTPStatusText";

const MAX_CODE_LENGTH = 100_000;
const MAX_INPUT_LENGTH = 20_000;

function ensureString(value: unknown, name: string): string {
  if (typeof value !== "string") {
    throw new CustomError(`${name} must be a string`, 400, HttpStatusText.FAIL);
  }
  return value;
}

function removeNullBytes(value: string): string {
  return value.replace(/\u0000/g, "");
}

function trimToMax(value: string, maxLen: number): string {
  if (value.length <= maxLen) return value;
  return value.slice(0, maxLen);
}

export function sanitizeCode(code: unknown): string {
  const clean = ensureString(code, "code");

  const normalized = removeNullBytes(clean);

  if (normalized.trim().length === 0) {
    throw new CustomError("code cannot be empty", 400, HttpStatusText.FAIL);
  }

  return trimToMax(normalized, MAX_CODE_LENGTH);
}

export function sanitizeInput(input: unknown): string | undefined {
  if (input === undefined || input === null) return undefined;

  const clean = ensureString(input, "input");
  const normalized = removeNullBytes(clean);
  return trimToMax(normalized, MAX_INPUT_LENGTH);
}

export function validateLanguage(language: unknown): string {
  const allowed = ["python", "javascript"];
  const lang = ensureString(language, "language").toLowerCase().trim();

  if (!allowed.includes(lang)) {
    throw new CustomError(
      `language must be one of: ${allowed.join(", ")}`,
      400,
      HttpStatusText.FAIL,
    );
  }

  return lang;
}
