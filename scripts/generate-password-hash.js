/**
 * Standalone CLI utility to generate a secure PBKDF2 password hash
 * for SOHAILVERSE v2.0 Cloudflare Pages Secrets (ADMIN_PASSWORD_HASH).
 *
 * Usage:
 *   node scripts/generate-password-hash.js "<your-desired-password>"
 *
 * Or interactively:
 *   node scripts/generate-password-hash.js
 */

import { webcrypto } from "node:crypto";
import readline from "node:readline";

const crypto = webcrypto;

async function hashPassword(password, iterations = 600000) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);

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
      salt: salt,
      iterations: iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256 // 32 bytes
  );

  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const hashHex = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `pbkdf2:${iterations}:${saltHex}:${hashHex}`;
}

async function main() {
  const argPassword = process.argv[2];

  if (argPassword) {
    const hash = await hashPassword(argPassword);
    console.log("\n=======================================================");
    console.log("SOHAILVERSE v2.0 — ADMIN_PASSWORD_HASH GENERATOR");
    console.log("=======================================================");
    console.log("\nGenerated ADMIN_PASSWORD_HASH:\n");
    console.log(hash);
    console.log("\nSet this value in Cloudflare Pages Secrets or .dev.vars:");
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log("=======================================================\n");
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter admin password to hash: ", async (inputPassword) => {
    if (!inputPassword || inputPassword.trim().length === 0) {
      console.error("Error: Password cannot be empty.");
      rl.close();
      process.exit(1);
    }

    const hash = await hashPassword(inputPassword.trim());
    console.log("\n=======================================================");
    console.log("SOHAILVERSE v2.0 — ADMIN_PASSWORD_HASH GENERATOR");
    console.log("=======================================================");
    console.log("\nGenerated ADMIN_PASSWORD_HASH:\n");
    console.log(hash);
    console.log("\nSet this value in Cloudflare Pages Secrets or .dev.vars:");
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log("=======================================================\n");
    rl.close();
  });
}

main().catch((err) => {
  console.error("Failed to generate hash:", err);
  process.exit(1);
});
