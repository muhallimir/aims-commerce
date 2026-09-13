import { Button } from "@mui/material";

export interface ExportOrder {
  _id: string;
  createdAt: string;
  user?: { name?: string };
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
}

function cell(v: string | number | boolean): string {
  const s = String(v ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Orders CSV: id, date, customer, total, paid, delivered. */
export function ordersToCsv(orders: ExportOrder[]): string {
  const header = "id,date,customer,total,paid,delivered";
  const rows = orders.map((o) =>
    [o._id, o.createdAt, o.user?.name ?? "", o.totalPrice, o.isPaid, o.isDelivered].map(cell).join(",")
  );
  return [header, ...rows].join("\n");
}

/** Download button for the filtered order list. */
export function OrdersCsvButton({ orders }: { orders: ExportOrder[] }) {
  function download() {
    const blob = new Blob([ordersToCsv(orders)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aims-orders.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <Button data-testid="orders-csv" size="small" variant="outlined" disabled={orders.length === 0} onClick={download} sx={{ mb: 2 }}>
      Export {orders.length} as CSV
    </Button>
  );
}
