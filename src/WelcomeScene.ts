import P5 from "p5"
import { Scene } from "./Scene";
import { get_image } from "./images"
import { change_scene,p } from "./main"

// starttext entity
let starttext_anim = 0//component
const update_starttext_brightness = () => {//system
    starttext_anim += 0.01
    if (starttext_anim > 1) starttext_anim = 0
}
const draw_starttext = (p: P5) => {
    p.push()
    p.textAlign(p.CENTER)
    p.fill(108, 195, 239, starttext_anim * 255)
    p.textSize(24)
    p.text("Start", p.width / 2, p.height - 100)
    p.pop()
}

// ripple entities
let ripples: Ripple[] = []
type Ripple = {
    x: number,
    y: number,
    lifetime: number,
    rr: number,
    gr: number,
    br: number
}
const add_ripple = (x: number, y: number) => ripples.push({
    x, y, lifetime: 0,
    rr: 0.7 + Math.random() * 0.6,
    gr: 0.7 + Math.random() * 0.6,
    br: 0.7 + Math.random() * 0.6
})
const draw_ripples = (p: P5) => {
    p.push()
    p.noFill()
    p.strokeWeight(4)
    p.blendMode(p.ADD)
    ripples.forEach(ripple => {
        p.stroke(108 * ripple.rr, 195 * ripple.gr, 239 * ripple.br, 255 * p.pow(1 - ripple.lifetime, 2))
        p.circle(ripple.x, ripple.y, 300 * p.sqrt(ripple.lifetime))
    })
    p.pop()
}
const update_ripples = () => {
    ripples.forEach(ripple => {
        ripple.lifetime += 0.02
    })
    ripples = ripples.filter(ripple => ripple.lifetime < 1)
}

//feedout entity
let feedout_running = false
let feedout_t = 0
let feedout_resolve: () => void = undefined
let feedout_promise: Promise<void> = undefined
const start_feedout_async = (): Promise<void> => {
    if (!feedout_running) {
        feedout_running = true
        feedout_promise = new Promise(resolve => feedout_resolve = resolve)
    }
    return feedout_promise
}
const update_feedout = () => {
    if (feedout_running) {
        feedout_t += 0.03
        if (feedout_t >= 1) {
            feedout_running = false
            feedout_t = 0
            feedout_resolve()
        }
    }
}
const draw_feetout = (p: P5) => {
    if (feedout_running) {
        p.push()
        p.fill(0, 0, 0, 255 * feedout_t)
        p.rect(0, 0, p.width, p.height)
        p.pop()
    }
}

export class WelcomeScene implements Scene {
    on_enter(): void {

    }
    tick(): void {
        p.background(240)
        p.image(get_image("bg0.png"), 0, 0)
        p.push()
        p.fill("white")
        p.textSize(18)
        p.textAlign(p.RIGHT)
        p.text("黒歴史の先に...", 500, 300)
        p.textSize(50)
        p.text("Houlex続営機関", 500, 360)
        p.pop()
        update_starttext_brightness()
        draw_starttext(p)

        update_feedout()
        draw_feetout(p)

        update_ripples()
        draw_ripples(p)
    }
    mouse_pressed(e: object): void {
        add_ripple(p.mouseX, p.mouseY)
        this.change()
    }
    async change() {
        await start_feedout_async()
        change_scene("Storylist")
    }

}