import P5 from "p5"
import { p } from "./main"
export const CANVAS_WIDTH = 1136
export const CANVAS_HEIGHT = 640
export const SMALL_TEXTSIZE = 18
export const NORMAL_TEXTSIZE = 24
export const LARGE_TEXTSIZE = 50
export const WHITE = () => p.color(255, 255, 255)
export const LIGHTBLUE = () => p.color(108, 195, 239)
export const ORANGE = () => p.color(255, 182, 97)
export const BLACK = () => p.color(0, 0, 0)
export const NAVY = () => p.color(5, 61, 89)
export const brighter = (color: P5.Color) => {
    p.colorMode(p.HSB)
    const h = p.hue(color)
    const s = p.saturation(color)
    const b = p.brightness(color)
    const new_color = p.color(h, s * 0.4, b * 1.1)
    p.colorMode(p.RGB)
    return new_color
}