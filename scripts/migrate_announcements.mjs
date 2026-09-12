import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config({ path: ".env" });

const sql = postgres(process.env.DIRECT_URL, { max: 1 });

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS announcements (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      message TEXT NOT NULL,
      active BOOLEAN NOT NULL DEFAULT true,
      starts_at TIMESTAMPTZ NULL,
      ends_at TIMESTAMPTZ NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  const rows = await sql`SELECT COUNT(*)::int AS n FROM announcements`;
  console.log("announcements table ready, rows:", rows[0].n);
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
