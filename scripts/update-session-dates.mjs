/**
 * Script to bump all classSession startTimes from Dec 2025 → Aug 2026+
 * so they appear as "upcoming" in the app.
 *
 * Run with: node scripts/update-session-dates.mjs
 */

import { createClient } from "@sanity/client";
import * as fs from "fs";


// Load .env.local manually
const envContent = fs.readFileSync(".env.local", "utf8");
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const val = match[2].trim().replace(/^"|"$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
  useCdn: false,
});

// Shift all dates by this many milliseconds (7 months = Dec 2025 → Jul 2026+)
// We'll shift to Aug 2026 to give some future buffer
const OLD_BASE = new Date("2025-12-18T00:00:00.000Z").getTime();
const NEW_BASE = new Date("2026-08-01T00:00:00.000Z").getTime();
const SHIFT_MS = NEW_BASE - OLD_BASE;

async function main() {
  console.log("Fetching all classSession documents...");

  const sessions = await client.fetch(
    `*[_type == "classSession"]{ _id, startTime }`
  );

  console.log(`Found ${sessions.length} sessions. Updating dates...\n`);

  const transaction = client.transaction();

  for (const session of sessions) {
    if (!session.startTime) continue;

    const oldDate = new Date(session.startTime);
    const newDate = new Date(oldDate.getTime() + SHIFT_MS);
    const newStartTime = newDate.toISOString();

    console.log(`  ${session._id}: ${session.startTime} → ${newStartTime}`);

    transaction.patch(session._id, {
      set: { startTime: newStartTime },
    });
  }

  console.log("\nCommitting transaction...");
  await transaction.commit();
  console.log("✅ All session dates updated successfully!");
  console.log(`\nSessions now start from: 2026-08-01 onwards`);
  console.log(`Change location to Dubai, UAE to see classes.`);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
