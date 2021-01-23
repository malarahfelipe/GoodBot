import * as robot from 'robotjs'
import { imgDir, Utils } from './Utils'
import { screenCaptureToFile2 } from './Image'
import { find } from './Screen'
import { assets } from '../assets'

export class MiniMap {

  private constructor() { }

  private static instance: MiniMap

  static getInstance(): MiniMap {
    if (!this.instance) this.instance = new MiniMap().initialize()
    return this.instance
  }

  private initialize(): MiniMap {
    return this
  }

  static readonly WP_IMAGE_SIZE: number = 7

  static getMiniMapImage(): robot.Bitmap {
    const { startsAt: { x: mapX, y: mapY }, width: mapWidth, height: mapHeight } = this.getInfo()
    return robot.screen.capture(mapX, mapY, mapWidth, mapHeight)
  }


  static getInfo() {
    return {
      startsAt: {
        x: 1199,
        y: 28
      },
      width: 105,
      height: 108
    }
  }

  async goTo(position: number = 0) {
    const { startsAt: { x: miniMapX, y: miniMapY } } = MiniMap.getInfo()
    await screenCaptureToFile2(MiniMap.getMiniMapImage(), `${imgDir}\\miniMap.png`)
    const { x, y } = await find(
      `${imgDir}\\miniMap.png`,
      assets(`${Utils.getAlphabet()[position]}.png`)
    )
    robot.moveMouse(miniMapX+x, miniMapY+y)
    robot.mouseClick()
  }

}
