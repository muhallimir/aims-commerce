export interface ContrastSample {
  selector: string;
  fg: string;
  bg: string;
  ratio: number;
  large: boolean;
}

function parseRgb(s: string): [number, number, number, number] {
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return [0, 0, 0, 1];
  const parts = m[1].split(",").map((x) => parseFloat(x.trim()));
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0, parts[3] ?? 1];
}

function luminance(r: number, g: number, b: number): number {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrastRatio(fg: string, bg: string): number {
  const [r1, g1, b1] = parseRgb(fg);
  const [r2, g2, b2] = parseRgb(bg);
  const l1 = luminance(r1, g1, b1);
  const l2 = luminance(r2, g2, b2);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export function effectiveBackground(el: Element): string {
  let cur: Element | null = el;
  while (cur) {
    const bg = getComputedStyle(cur).backgroundColor;
    const [, , , a] = parseRgb(bg);
    if (a > 0.01) return bg;
    cur = cur.parentElement;
  }
  return "rgb(255, 255, 255)";
}
