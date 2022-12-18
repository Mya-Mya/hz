import P5 from "p5"
import { View } from "./View";
import { get_image } from "./images"
import { p } from "./main"
import { add_ripple, update_ripple_s, draw_ripple_s } from "./ripple"
import { ButtonVariant, Button } from "./button"
import { LIGHTBLUE, ORANGE, brighter, CANVAS_HEIGHT, CANVAS_WIDTH } from "./uiconstants"
import { Dialog } from "./dialog"
import { fade_service, modal_manage_service, scene_manage_service } from "./services";
import { storiesmanager, set_choosing_index } from "./model"
import StoryInfo from "./storyapi/StoryInfo";
import StoryScene from "./scenes/storyscene/StoryScene";

let storyinfo_s: StoryInfo[] = undefined

// C preview_index entity
let storyinfo_index = 0

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
    if (storyinfo_s == undefined) return
    p.push()
    p.textAlign(p.CENTER, p.CENTER)
    p.fill(255, 255, 255, preview_anim_t * 255)
    p.textSize(50 + 50 * p.pow(preview_anim_t, 0.2))
    p.text(storyinfo_s[storyinfo_index].title, p.width * 0.5, p.height * 0.5)
    p.textSize(18)
    p.text(`${storyinfo_index + 1}/${storyinfo_s.length}`, p.width * 0.5, p.height * 0.5 + 70)
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
const prev_button: Button = new Button(130, CANVAS_HEIGHT - 50, "<<")
const next_button: Button = new Button(CANVAS_WIDTH - 130, CANVAS_HEIGHT - 50, ">>")
const open_button: Button = new Button(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 50, "開く")
open_button.set_variant(ButtonVariant.Important)
open_button.add_onclick_handler(() => {
    const dialog = new Dialog("再生しますか？")
    dialog.add_button("いいえ", ButtonVariant.Normal, () => { })
    dialog.add_button("はい", ButtonVariant.Important, () => {
        fade_service.start_out(() => {
            set_choosing_index(storyinfo_s[storyinfo_index].index)
            scene_manage_service.set_scene(new StoryScene())
        })
    })
    dialog.set_on_close_handler(() => {
        modal_manage_service.delete(dialog)
    })
    modal_manage_service.add(dialog)
})
prev_button.add_onclick_handler(() => {
    storyinfo_index = (storyinfo_s.length + storyinfo_index - 1) % storyinfo_s.length
    start_preview_anim()
    add_multiple_bubbles(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
})
next_button.add_onclick_handler(() => {
    storyinfo_index = (storyinfo_index + 1) % storyinfo_s.length
    start_preview_anim()
    add_multiple_bubbles(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
})

export class StorylistScene extends View {
    on_enter(): void {
        fade_service.start_stable()
        storiesmanager.get_info_s().then(_storyinfo_s => {
            fade_service.start_in(() => { })
            storyinfo_s = _storyinfo_s
        })
    }
    tick(): void {
        p.image(get_image("bg0.png"), 0, 0)

        update_bubbles()
        draw_bubbles(p)

        update_preview_anim(p)
        draw_preview(p)

        prev_button.tick()
        next_button.tick()
        open_button.tick()

        update_ripple_s()
        draw_ripple_s()

    }
    mouse_pressed(e: any) {
        add_ripple(p.mouseX, p.mouseY)
        prev_button.mouse_pressed(e)
        next_button.mouse_pressed(e)
        open_button.mouse_pressed(e)
        return false
    }
}