import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config({ path: ".env" });

const sql = postgres(process.env.DIRECT_URL, { max: 1 });

async function main() {
  // 1. Seller tax / VAT ID for compliant invoices.
  await sql`ALTER TABLE sellers ADD COLUMN IF NOT EXISTS tax_id TEXT NOT NULL DEFAULT ''`;

  // 2. Sequential, gapless invoice numbers persisted per order.
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_number TEXT`;
  await sql`CREATE SEQUENCE IF NOT EXISTS invoice_seq`;

  // 3. Backfill existing orders oldest-first, then move the sequence past them.
  const existing = await sql`SELECT id FROM orders ORDER BY created_at ASC`;
  let n = 0;
  for (const row of existing) {
    const current = await sql`SELECT invoice_number FROM orders WHERE id = ${row.id}`;
    if (!current[0]?.invoice_number) {
      const next = await sql`SELECT nextval('invoice_seq') AS v`;
      const num = `INV-${String(next[0].v).padStart(6, "0")}`;
      await sql`UPDATE orders SET invoice_number = ${num} WHERE id = ${row.id}`;
      n += 1;
    }
  }
  const maxRow = await sql`
    SELECT COALESCE(MAX(NULLIF(regexp_replace(invoice_number, '\\D', '', 'g'), '')::int), 0) AS m
    FROM orders WHERE invoice_number IS NOT NULL
  `;
  await sql`SELECT setval('invoice_seq', ${maxRow[0].m} + 1, false)`;

  const sellers = await sql`SELECT COUNT(*)::int AS n FROM sellers`;
  const orders = await sql`SELECT COUNT(*)::int AS n FROM orders WHERE invoice_number IS NOT NULL`;
  console.log("sellers.tax_id ready, sellers:", sellers[0].n);
  console.log("orders with invoice numbers:", orders[0].n, `(backfilled ${n})`);
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
