const monthMap: Record<string, number> = {
  'Oca': 0, 'Şub': 1, 'Mar': 2, 'Nis': 3, 'May': 4, 'Haz': 5,
  'Tem': 6, 'Ağu': 7, 'Eyl': 8, 'Eki': 9, 'Kas': 10, 'Ara': 11
}

export function parseDate(dateStr: string): Date {
  const parts = dateStr.split(' ')
  const day = parseInt(parts[0])
  const month = monthMap[parts[1]] || 0
  const year = parseInt(parts[2])
  return new Date(year, month, day)
}

export function sortByDateDesc<T extends { meta: { date: string } }>(items: T[]): T[] {
  return [...items].sort((a, b) =>
    parseDate(b.meta.date).getTime() - parseDate(a.meta.date).getTime()
  )
}
