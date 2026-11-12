// Pure windowing: the parent owns the selection index, this only decides which
// slice is on screen so the selected row stays visible in a long list.
export const windowRows = <T>(
  items: T[],
  selected: number,
  rows: number,
): { items: T[]; offset: number } => {
  const r = Math.max(1, rows)
  if (items.length <= r) return { items, offset: 0 }
  const offset = Math.max(
    0,
    Math.min(selected - Math.floor(r / 2), items.length - r),
  )
  return { items: items.slice(offset, offset + r), offset }
}
