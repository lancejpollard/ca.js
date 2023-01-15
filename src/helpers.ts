import { CA } from './types.js'

export function loadUpdate(p: number, ca: CA): void {
  let k = 0
  ruleLoop: while (k < ca.move.length) {
    let rule = ca.move[k++]
    if (typeof rule === 'function') {
      const make = rule(ca.n)
      if (make >= 0) {
        ca.load[p] = make
        break ruleLoop
      }
    } else {
      let i = 0
      const { test, make } = rule

      while (i < ca.n.length) {
        const v = ca.n[i]
        const t = test[i++]
        if (!t(v)) {
          continue ruleLoop
        }
      }

      ca.load[p] = make
      break ruleLoop
    }
  }
}

export function randomIntBetween(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function saveUpdates(ca: CA) {
  let i = 0
  while (i < ca.load.length) {
    ca.save[i] = ca.load[i]
    i++
  }
}

export function seed(ca: CA) {
  let i = 0
  while (i < ca.save.length) {
    const rand = randomIntBetween(0, ca.max)
    ca.save[i++] = rand
  }
}
