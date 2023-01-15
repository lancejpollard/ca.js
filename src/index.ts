export * from './2d/automaton'
export * from './2d/renderer'
export * from './builder'
export * from './types'

export async function wait(ms: number) {
  return new Promise(res => setTimeout(res, ms))
}
