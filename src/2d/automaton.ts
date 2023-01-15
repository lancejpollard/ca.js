import { loadUpdate, saveUpdates, seed } from '../helpers.js'
import { CA, RuleType } from '../types.js'

type CA2DPropsType = {
  h: number
  max: number
  move: Array<RuleType> | Array<(n: Uint8ClampedArray) => number>
  w: number
}

export class CA2D implements CA {
  load: Uint8ClampedArray

  save: Uint8ClampedArray

  i: Uint8ClampedArray

  n: Uint8ClampedArray

  w: number

  h: number

  size: number

  // 0 means it doesn't care
  move: Array<RuleType> | Array<(n: Uint8ClampedArray) => number>

  max: number

  constructor({ w, h, move, max }: CA2DPropsType) {
    this.w = w
    this.h = h
    this.max = max
    this.size = w * h
    this.i = new Uint8ClampedArray(9)
    this.n = new Uint8ClampedArray(9)
    this.load = new Uint8ClampedArray(this.size)
    this.save = new Uint8ClampedArray(this.size)
    this.move = move
  }

  update() {
    update2d(this)
  }

  seed() {
    seed(this)
  }
}

function loadNeighborhood2d(ca: CA2D, x: number, y: number) {
  let x1
  let x2
  let x3
  if (x === 0) {
    x1 = ca.w - 1
    x2 = x
    x3 = x + 1
  } else if (x === ca.w - 1) {
    x1 = x - 1
    x2 = x
    x3 = 0
  } else {
    x1 = x - 1
    x2 = x
    x3 = x + 1
  }

  let y1
  let y2
  let y3
  if (y === 0) {
    y1 = ca.h - 1
    y2 = y
    y3 = y + 1
  } else if (y === ca.h - 1) {
    y1 = y - 1
    y2 = y
    y3 = 0
  } else {
    y1 = y - 1
    y2 = y
    y3 = y + 1
  }

  let i00 = y1 * ca.h + x1
  let i01 = y1 * ca.h + x2
  let i02 = y1 * ca.h + x3
  let i10 = y2 * ca.h + x1
  let i11 = y2 * ca.h + x2
  let i12 = y2 * ca.h + x3
  let i20 = y3 * ca.h + x1
  let i21 = y3 * ca.h + x2
  let i22 = y3 * ca.h + x3

  // indexes
  ca.i[0] = i00 // upper left
  ca.i[1] = i01
  ca.i[2] = i02
  ca.i[3] = i10
  ca.i[4] = i11 // middle
  ca.i[5] = i12
  ca.i[6] = i20
  ca.i[7] = i21
  ca.i[8] = i22 // lower right

  // neighborhoods
  ca.n[0] = ca.save[i00] // upper left
  ca.n[1] = ca.save[i01]
  ca.n[2] = ca.save[i02]
  ca.n[3] = ca.save[i10]
  ca.n[4] = ca.save[i11] // middle
  ca.n[5] = ca.save[i12]
  ca.n[6] = ca.save[i20]
  ca.n[7] = ca.save[i21]
  ca.n[8] = ca.save[i22] // lower right
}

export function update2d(ca: CA2D) {
  let y = 0
  while (y < ca.h) {
    let x = 0
    while (x < ca.w) {
      loadNeighborhood2d(ca, x, y)
      loadUpdate(y * ca.h + x, ca)

      x++
    }
    y++
  }

  saveUpdates(ca)
}
