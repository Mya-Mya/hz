import P5 from "p5"
import { Scene } from "./Scene";
import { get_image } from "./images"
import { change_scene, p } from "./main"
import {add_ripple,draw_ripple_s,update_ripple_s} from "./ripple"
import { BLACK, CANVAS_HEIGHT, CANVAS_WIDTH, LARGE_TEXTSIZE, LIGHTBLUE, NORMAL_TEXTSIZE, WHITE } from "./uiconstants";

// starttext entity
let starttext_anim = 0//component
const update_starttext_brightness = () => {//system
    starttext_anim += 0.01
    if (starttext_anim > 1) starttext_anim = 0
}
const draw_starttext = () => {
    p.push()
    p.textAlign(p.CENTER)
    const color = LIGHTBLUE()
    color.setAlpha(starttext_anim * 255)
    p.fill(color)
    p.textSize(NORMAL_TEXTSIZE)
    p.text("Start", CANVAS_WIDTH/2,CANVAS_HEIGHT-50)
    p.pop()
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
const draw_feetout = () => {
    if (feedout_running) {
        p.push()
        const color = BLACK()
        color.setAlpha(255 * feedout_t)
        p.fill(color)
        p.rect(0, 0, p.width, p.height)
        p.pop()
    }
}

export class WelcomeScene implements Scene {
    on_enter(): void {

    }
    tick(): void {
        p.image(get_image("bg0.png"), 0, 0)
        p.push()
        p.fill(WHITE())
        p.textSize(NORMAL_TEXTSIZE)
        p.textAlign(p.RIGHT)
        p.text("黒歴史の先に...", 500, 300)
        p.textSize(LARGE_TEXTSIZE)
        p.text("Houlex続営機関", 500, 360)
        p.pop()
        update_starttext_brightness()
        draw_starttext()

        update_feedout()
        draw_feetout()

        update_ripple_s()
        draw_ripple_s()
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