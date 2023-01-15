export interface CA {
  i: Uint8ClampedArray
  load: Uint8ClampedArray
  max: number
  move: Array<RuleType> | Array<(n: Uint8ClampedArray) => number>
  n: Uint8ClampedArray
  save: Uint8ClampedArray
  size: number
}

export type RuleType = {
  make: number
  test: Array<(r: number) => boolean>
}
