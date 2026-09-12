export interface InstallWindowOption {
  date: string
  windows: string[]
}

export interface InstallWindowResult {
  options: InstallWindowOption[]
}

export const INSTALL_WINDOWS = ["08-12", "12-16", "16-20"]

export function installWindow(postcode: string, daysOut: number[]): InstallWindowResult {
  void postcode
  const today = new Date()
  const options = daysOut.map((offset) => {
    const d = new Date(today)
    d.setDate(today.getDate() + offset)
    return {
      date: d.toISOString().slice(0, 10),
      windows: [...INSTALL_WINDOWS],
    }
  })
  return { options }
}
