import { any, CA2D, CA2DRenderer, eq, wait } from './src/index.js'
import CanvasGifEncoder from '@pencil.js/canvas-gif-encoder'
import GIFEncoder from 'gif-encoder-2'
import fs from 'fs'
import { createCanvas } from 'canvas'
import { writeFile } from 'fs'
import _ from 'lodash'

const COLOR = {
  black: 'rgba(40, 40, 40, 0)',
  blue: 'rgba(56, 201, 247)',
  green: 'hsl(165, 92%, 44%)',
  greenLight: 'hsl(165, 92%, 79%)',
  purple: 'rgba(121, 85, 243, 0.8)',
  purpleLight: 'hsl(254, 87%, 70%)',
  red: 'rgba(238, 56, 96)',
  white: 'rgba(255, 255, 255)',
  white2: 'rgba(244, 244, 244)',
  white3: 'rgba(222, 222, 222)',
  yellow: 'rgba(246, 223, 104)',
}

export const caProps = {
  h: 60,
  max: 1,
  move: [
    (n: Uint8ClampedArray) => {
      const sum = _.sum(n)
      const isLive = n[4] === 1
      if (isLive && sum >= 3 && sum <= 4) {
        return 1
      } else {
        return -1
      }
    },
    (n: Uint8ClampedArray) => {
      const sum = _.sum(n)
      const isDead = n[4] === 0
      if (isDead && sum === 3) {
        return 1
      } else {
        return -1
      }
    },
    (n: Uint8ClampedArray) => {
      const isLive = n[4] === 1
      return isLive ? 0 : -1
    },
  ],
  w: 60,
}

const ca = new CA2D(caProps)

ca.seed()

// const saveByteArray = (function () {
//   var a = document.createElement('a')
//   document.body.appendChild(a)
//   a.style.display = 'none'
//   return function (data: Array<BlobPart>, name: string) {
//     var blob = new Blob(data, { type: 'octet/stream' }),
//       url = window.URL.createObjectURL(blob)
//     a.href = url
//     a.download = name
//     a.click()
//     window.URL.revokeObjectURL(url)
//   }
// })()

start()

async function start() {
  const canvas = createCanvas(500, 500)
  const renderer = new CA2DRenderer(canvas)
  renderer.setDimensions({
    gap: 1,
    width: 500,
    rowSize: ca.h,
    columnSize: ca.w,
  })

  const encoder = new GIFEncoder(500, 500)
  encoder.setDelay(100)
  encoder.start()

  // document.body.appendChild(renderer.canvas)

  const colors = [COLOR.white2, COLOR.green, COLOR.purple, COLOR.red]

  renderer.draw(ca, colors)
  if (renderer.context) encoder.addFrame(renderer.context)

  let i = 0
  while (i < 100) {
    console.log(i)
    await wait(20)
    ca.update()
    renderer.draw(ca, colors)
    if (renderer.context) encoder.addFrame(renderer.context)
    i++
  }
  encoder.finish()

  const buffer = encoder.out.getData()

  fs.writeFileSync('example.gif', buffer)

  // saveByteArray([buffer], 'example.gif')
}
