export interface Question {
  id: string
  productId: string
  authorId: string
  text: string
  createdAt: string
  status: 'pending' | 'approved' | 'rejected'
}

const BANNED = ['spam', 'scam', 'fake', 'stupid', 'idiot', 'viagra', 'crypto pump']

export interface ModerationResult {
  status: 'pending' | 'approved' | 'rejected'
  flags: string[]
}

export function moderate(text: string): ModerationResult {
  const flags: string[] = []
  const lc = text.toLowerCase()
  for (const word of BANNED) {
    if (lc.includes(word)) flags.push(`banned_word:${word}`)
  }
  const letters = (text.match(/[A-Za-z]/g) ?? []).length
  const upper = (text.match(/[A-Z]/g) ?? []).length
  if (letters >= 12 && upper / letters > 0.6) flags.push('excessive_caps')
  if (/https?:\/\//.test(text)) flags.push('contains_url')
  if (/(.)\1{6,}/.test(text)) flags.push('character_stutter')
  if (flags.length > 0) return { status: 'rejected', flags }
  return { status: 'approved', flags }
}

export function applyModeration(q: Question): Question {
  const r = moderate(q.text)
  return { ...q, status: r.status }
}

export function pendingQueue(questions: Question[]): Question[] {
  return questions.filter((q) => q.status === 'pending').sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}
