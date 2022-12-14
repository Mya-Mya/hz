import { p } from "./main"
import { LIGHTBLUE } from "./uiconstants"

export type Ripple = {
    x: number,
    y: number,
    lifetime: number
}
let ripples: Ripple[] = []
export const add_ripple = (x: number, y: number) => ripples.push({ x, y, lifetime: 0 })
export const draw_ripple_s = () => {
    p.push()
    p.noFill()
    p.strokeWeight(4)
    p.blendMode(p.ADD)
    ripples.forEach(ripple => {
        const color = LIGHTBLUE()
        color.setAlpha(255 * p.pow(1 - ripple.lifetime, 2))
        p.stroke(color)
        p.circle(ripple.x, ripple.y, 300 * p.sqrt(ripple.lifetime))
    })
    p.pop()
}
export const update_ripple_s = () => {
    ripples.forEach(ripple => ripple.lifetime += p.deltaTime / 1000)
    ripples = ripples.filter(ripple => ripple.lifetime < 1)
}