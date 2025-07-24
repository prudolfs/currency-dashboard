export function getUserColor(type: 'member' | 'partner') {
  const colors = {
    member: '#2AFC98',
    partner: '#119DA4',
  } as const

  return colors[type]
}
