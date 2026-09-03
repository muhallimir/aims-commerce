export interface CsvProduct {
  id: string
  name: string
  price: number
  category: string
  stock: number
  brand?: string
}

const COLUMNS: (keyof CsvProduct)[] = ['id', 'name', 'price', 'category', 'stock', 'brand']

function escape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function toCsv(products: CsvProduct[]): string {
  const header = COLUMNS.join(',')
  const rows = products.map((p) =>
    COLUMNS.map((col) => {
      const v = p[col]
      if (v == null) return ''
      if (typeof v === 'number') return String(v)
      return escape(String(v))
    }).join(','),
  )
  return [header, ...rows].join('\n')
}

export function fromCsv(csv: string): CsvProduct[] {
  const lines = csv.split(/\r?\n/).filter(Boolean)
  if (lines.length === 0) return []
  const header = lines[0].split(',')
  return lines.slice(1).map((line) => {
    const cells = parseLine(line)
    const row: Record<string, string> = {}
    header.forEach((h, i) => { row[h] = cells[i] ?? '' })
    return {
      id: row.id,
      name: row.name,
      price: parseFloat(row.price) || 0,
      category: row.category,
      stock: parseInt(row.stock, 10) || 0,
      brand: row.brand || undefined,
    }
  })
}

function parseLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++ } else { inQuotes = !inQuotes }
    } else if (ch === ',' && !inQuotes) {
      out.push(cur); cur = ''
    } else {
      cur += ch
    }
  }
  out.push(cur)
  return out
}
