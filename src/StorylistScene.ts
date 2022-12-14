import P5 from "p5"
import { Scene } from "./Scene";
import { get_image } from "./images"
import { p } from "./main"
import { add_ripple, update_ripple_s, draw_ripple_s } from "./ripple"
import { Button, ButtonVariant, create_button, dispose_mouse_press_to_button_s, update_button_s, draw_button_s } from "./button"
import { LIGHTBLUE, ORANGE, brighter, CANVAS_HEIGHT, CANVAS_WIDTH } from "./uiconstants"

// Input entity
let clicking: boolean = false

// Preview entity
type Preview = {
    title: string,
}
const previews: Preview[] = [
    { title: "序章" },
    { title: "雷雨の夜に" },
    { title: "何か" }
]
// C preview_index entity
let preview_index = 0

// T preview animation entity
let preview_anim_t = 0
let preview_anim_running = true

// Bubble entity
type Bubble = {
    x: number
    y: number
    theta: number
    v: number
    rr: number
    rg: number
    rb: number
    rd: number
    lifetime: number
    filled: boolean
}
// T
let bubbles: Bubble[] = []

const draw_preview = (p: P5) => {
    p.push()
    p.textAlign(p.CENTER, p.CENTER)
    p.fill(255, 255, 255, preview_anim_t * 255)
    p.textSize(50 + 50 * p.pow(preview_anim_t, 0.2))
    p.text(previews[preview_index].title, p.width * 0.5, p.height * 0.5)
    p.textSize(18)
    p.text(`${preview_index + 1}/${previews.length}`, p.width * 0.5, p.height * 0.5 + 70)
    p.pop()
}

const update_preview_anim = (p: P5) => {
    if (preview_anim_running) {
        preview_anim_t += 0.09
        if (preview_anim_t > 1) {
            preview_anim_running = false

        }
    }
}
// E
const start_preview_anim = () => {
    if (!preview_anim_running) {
        preview_anim_running = true
        preview_anim_t = 0
    }
}
// E
const add_multiple_bubbles = (x: number, y: number) => {
    for (let i = 0; i < 15; i++) {
        bubbles.push({
            x,
            y,
            v: Math.random() * 4,
            theta: Math.random() * 2 * Math.PI,
            rr: 0.8 + Math.random() * 0.3,
            rg: 0.9 + Math.random() * 0.2,
            rb: 0.8 + Math.random() * 0.4,
            rd: 0.7 + Math.random(),
            lifetime: 0,
            filled: Math.random() < 0.4
        })
    }
}
// S
const update_bubbles = () => {
    bubbles.forEach(bubble => {
        bubble.x += bubble.v * Math.cos(bubble.theta)
        bubble.y += bubble.v * Math.sin(bubble.theta)
        bubble.lifetime += 0.01
        bubble.v += 0.01
    })
    bubbles = bubbles.filter(bubble => bubble.lifetime < 1)
}
// S
const draw_bubbles = (p: P5) => {
    p.push()
    p.blendMode(p.ADD)
    bubbles.forEach(bubble => {
        const color = p.color(108 * bubble.rr, 195 * bubble.rg, 239 * bubble.rb, 255 * p.pow(1 - bubble.lifetime, 2))
        if (bubble.filled) {
            p.fill(color)
            p.noStroke()
        } else {
            p.stroke(color)
            p.noFill()
        }
        p.circle(bubble.x, bubble.y, 20 * bubble.rd)
    })
    p.pop()
}

// Button entity
const prev_button: Button = create_button(130, CANVAS_HEIGHT - 50, "<<")
const next_button: Button = create_button(CANVAS_WIDTH - 130, CANVAS_HEIGHT - 50, ">>")
const open_button: Button = create_button(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 50, "開く")
open_button.variant = ButtonVariant.Important
open_button.onclick_handler_s.push(() => run_feedout_async().then(resolve => alert("Feed out done.")))
prev_button.onclick_handler_s.push(() => {
    preview_index = (previews.length + preview_index - 1) % previews.length
    start_preview_anim()
})
next_button.onclick_handler_s.push(() => {
    preview_index = (preview_index + 1) % previews.length
    start_preview_anim()
})
let buttons: Button[] = [prev_button, next_button, open_button]

// feedout
let feedout_t = 0
let feedout_runnning = false
let feedout_resolve = undefined
const draw_feedout = (p: P5) => {
    p.push()
    p.fill(0, 0, 0, feedout_t * 255)
    p.rect(0, 0, p.width, p.height)
    p.pop()
}
const update_feedout = () => {
    if (feedout_runnning) {
        feedout_t += 0.02
        if (feedout_t >= 1) {
            feedout_runnning = false
            feedout_resolve()
        }
    }
}
const run_feedout_async = () => {
    feedout_runnning = true
    return new Promise(resolve => feedout_resolve = resolve)
}
export class StorylistScene implements Scene {
    on_enter(): void {

    }
    tick(): void {
        p.image(get_image("bg0.png"), 0, 0)

        update_bubbles()
        draw_bubbles(p)

        update_preview_anim(p)
        draw_preview(p)

        update_button_s(buttons, p.mouseX, p.mouseY)
        draw_button_s(buttons)

        update_feedout()
        draw_feedout(p)

        update_ripple_s()
        draw_ripple_s()

        clicking = false
    }
    mouse_pressed(e: any): void {
        clicking = true
        add_ripple(p.mouseX, p.mouseY)
        dispose_mouse_press_to_button_s(buttons)
    }
}