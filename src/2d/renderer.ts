/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CA2D } from './automaton'

type CA2DRendererDimensionPropsType = {
  columnSize: number
  gap: number
  rowSize: number
  width: number
}

export class CA2DRenderer {
  canvas: any

  context: CanvasRenderingContext2D | null

  gap: number

  blockSize: number

  constructor(canvas: any) {
    this.canvas = canvas //document.createElement('canvas')

    this.context = this.canvas.getContext('2d')

    this.gap = 0
    this.blockSize = 0
  }

  setDimensions({
    gap = 2,
    width,
    rowSize,
    columnSize,
  }: CA2DRendererDimensionPropsType) {
    const blockSize = (width - (columnSize + 1) * gap) / columnSize
    const height = (rowSize + 1) * gap + rowSize * blockSize

    this.canvas.width = width
    this.canvas.height = height
    this.blockSize = blockSize
    this.gap = gap
  }

  draw(ca: CA2D, colors: Array<string> = []) {
    const ctx = this.context
    if (!ctx) {
      return
    }

    const { gap, blockSize } = this

    const bg = colors[0] ?? '#777'

    // draw background
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.fillStyle = bg
    ctx.rect(0, 0, this.canvas.width, this.canvas.height)
    ctx.fill()

    // draw each block
    let y = 0
    while (y < ca.h) {
      const yOffset = y * blockSize + (y + 1) * gap
      let x = 0
      while (x < ca.w) {
        const i = y * ca.h + x
        const value = ca.save[i]
        const color = colors[value + 1] ?? 'red'
        const xOffset = x * blockSize + (x + 1) * gap

        ctx.fillStyle = color
        ctx.fillRect(xOffset, yOffset, blockSize, blockSize)

        x++
      }
      y++
    }
  }
}
