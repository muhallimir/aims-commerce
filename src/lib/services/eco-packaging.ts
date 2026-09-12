export type EcoOption = "compostable" | "recycled" | "reusable"

export interface EcoPackageResult {
  option: EcoOption
  fee: number
}

export function ecoPackage(items: number, fragile: boolean): EcoPackageResult {
  let option: EcoOption
  if (items > 5) {
    option = "reusable"
  } else if (!fragile) {
    option = "compostable"
  } else {
    option = "recycled"
  }
  const fee = Math.round((items * 0.4 + (option === "reusable" ? 2 : 0)) * 100) / 100
  return { option, fee }
}
