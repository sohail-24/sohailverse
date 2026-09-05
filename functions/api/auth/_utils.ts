/**
 * SOHAILVERSE v2.0 — Server-side Authentication & Crypto Utilities
 *
 * Designed for Cloudflare Pages Functions (V8 Worker runtime with Web Crypto API).
 */

export interface AuthEnv {
  ADMIN_PASSWORD?: string;
  ADMIN_PASSWORD_HASH?: string;
  SESSION_SECRET?: string;
}

export const SESSION_COOKIE_NAME = "sv_admin_session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

/**
 * Constant-time comparison between two plaintext passwords.
 */
export function verifyAdminPassword(input: string, configured: string): boolean {
  if (!input || !configured || typeof input !== "string" || typeof configured !== "string") {
    return false;
  }
  const enc = new TextEncoder();
  const inputBytes = enc.encode(input);
  const confBytes = enc.encode(configured);
  return constantTimeEqual(inputBytes, confBytes);
}

/**
 * Checks whether a hash string has valid PBKDF2 format: `pbkdf2:<iterations>:<saltHex>:<hashHex>`
 */
export function isValidHashFormat(hash: string | undefined): boolean {
  if (!hash || typeof hash !== "string") return false;
  const parts = hash.split(":");
  return parts.length === 4 && parts[0] === "pbkdf2" && !isNaN(parseInt(parts[1], 10)) && parseInt(parts[1], 10) >= 1000;
}

/**
 * Validates password strength (minimum 8 characters, must contain letters and numbers).
 */
export function validatePasswordStrength(password: string): { valid: boolean; error?: string } {
  if (!password || typeof password !== "string") {
    return { valid: false, error: "Password is required." };
  }
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long." };
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain both letters and numbers." };
  }
  return { valid: true };
}

/**
 * Constant-time comparison between two Uint8Array buffers to prevent timing attacks.
 */
export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

/**
 * Converts a hex string into a Uint8Array.
 */
export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Converts a Uint8Array buffer into a hex string.
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Encodes an ArrayBuffer or Uint8Array into a Base64Url string.
 */
export function base64UrlEncode(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Decodes a Base64Url string into a Uint8Array.
 */
export function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Verifies a plaintext password against a stored PBKDF2 hash string:
 * Format: `pbkdf2:<iterations>:<saltHex>:<hashHex>`
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  if (!password || !storedHash) {
    return false;
  }

  const parts = storedHash.split(":");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") {
    return false;
  }

  const iterations = parseInt(parts[1], 10);
  if (isNaN(iterations) || iterations < 1000) {
    return false;
  }

  const saltBytes = hexToBytes(parts[2]);
  const expectedHashBytes = hexToBytes(parts[3]);

  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes as unknown as BufferSource,
      iterations: iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256 // 32 bytes
  );

  const derivedBytes = new Uint8Array(derivedBits);
  return constantTimeEqual(derivedBytes, expectedHashBytes);
}

/**
 * Hashes a plaintext password using modern PBKDF2 with SHA-256 and a random 16-byte salt.
 * Returns formatted hash string: `pbkdf2:<iterations>:<saltHex>:<hashHex>`
 */
export async function hashPassword(
  password: string,
  iterations = 100000
): Promise<string> {
  const saltBytes = new Uint8Array(16);
  crypto.getRandomValues(saltBytes);

  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes as unknown as BufferSource,
      iterations: iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256 // 32 bytes (256 bits)
  );

  const derivedBytes = new Uint8Array(derivedBits);
  const saltHex = bytesToHex(saltBytes);
  const hashHex = bytesToHex(derivedBytes);

  return `pbkdf2:${iterations}:${saltHex}:${hashHex}`;
}

/**
 * Creates an HMAC-SHA256 signed session token.
 */
export async function createSessionToken(
  secret: string,
  maxAgeSeconds = SESSION_MAX_AGE_SECONDS
): Promise<string> {
  const encoder = new TextEncoder();
  const payload = {
    role: "admin",
    exp: Date.now() + maxAgeSeconds * 1000,
    iat: Date.now(),
  };

  const payloadJson = JSON.stringify(payload);
  const payloadBase64 = base64UrlEncode(encoder.encode(payloadJson));

  const hmacKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    hmacKey,
    encoder.encode(payloadBase64)
  );

  const signatureBase64 = base64UrlEncode(signatureBuffer);
  return `${payloadBase64}.${signatureBase64}`;
}

/**
 * Verifies an HMAC-SHA256 signed session token and its expiration.
 */
export async function verifySessionToken(
  token: string,
  secret: string
): Promise<boolean> {
  if (!token || !secret) {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return false;
  }

  const [payloadBase64, signatureBase64] = parts;
  const encoder = new TextEncoder();

  try {
    const hmacKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signatureBytes = base64UrlDecode(signatureBase64);
    const isValidSignature = await crypto.subtle.verify(
      "HMAC",
      hmacKey,
      signatureBytes as unknown as BufferSource,
      encoder.encode(payloadBase64)
    );

    if (!isValidSignature) {
      return false;
    }

    const payloadBytes = base64UrlDecode(payloadBase64);
    const payloadJson = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadJson);

    if (!payload || typeof payload.exp !== "number") {
      return false;
    }

    if (payload.exp < Date.now()) {
      return false; // Expired session
    }

    return payload.role === "admin";
  } catch {
    return false;
  }
}

/**
 * Parses all cookies from a Request header.
 */
export function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  const items = cookieHeader.split(";");
  for (const item of items) {
    const [name, ...valueParts] = item.trim().split("=");
    if (name) {
      cookies[name] = decodeURIComponent(valueParts.join("="));
    }
  }
  return cookies;
}

/**
 * Extracts the admin session token from a Request.
 */
export function getSessionTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie") || request.headers.get("cookie");
  const cookies = parseCookies(cookieHeader);
  return cookies[SESSION_COOKIE_NAME] || null;
}

/**
 * Generates the Set-Cookie string for a new session.
 */
export function createSessionCookie(token: string): string {
  return `${SESSION_COOKIE_NAME}=${token}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_MAX_AGE_SECONDS}`;
}

/**
 * Generates the Set-Cookie string to invalidate an active session.
 */
export function createClearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Validates the admin session on incoming Cloudflare Pages Function requests.
 */
export async function validateAdminRequest(
  request: Request,
  env: AuthEnv
): Promise<boolean> {
  if (!env.SESSION_SECRET) {
    return false;
  }
  const token = getSessionTokenFromRequest(request);
  if (!token) {
    return false;
  }
  return verifySessionToken(token, env.SESSION_SECRET);
}
