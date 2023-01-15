export function any() {
  return true
}

export function eq(n: number) {
  return (i: number) => i === n
}

export function ignore() {
  return true
}
