import { Button, Card, CardContent, Typography } from "@mui/material";
import { toCsv } from "@lib/csv";

export function templateCsv(): string {
  return toCsv([{ id: "", name: "Example Sneaker", price: 59.99, category: "Shoes", stock: 10, brand: "AIMS" }]);
}

export function downloadText(filename: string, text: string, mime = "text/csv"): void {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Bulk template: one click downloads the CSV shape the importer
 * expects, with an example row.
 */
export function CsvTemplateCard() {
  return (
    <Card data-testid="csv-template" variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">Bulk upload template</Typography>
        <Typography variant="body2" color="text.secondary">
          Fill it in, send it back. Columns: id, name, price, category, stock, brand.
        </Typography>
        <Button
          data-testid="csv-template-download"
          variant="outlined"
          size="small"
          sx={{ mt: 1 }}
          onClick={() => downloadText("aims-products-template.csv", templateCsv())}
        >
          Download template
        </Button>
      </CardContent>
    </Card>
  );
}
