import { View } from "./View";
import { p } from "./main";
import { CANVAS_HEIGHT, CANVAS_WIDTH, LIGHTBLUE, NORMAL_TEXTSIZE, WHITE } from "./uiconstants";
import { choosing_index, set_choosing_index, storiesmanager } from "./model"
import { get_image } from "./images";
import { fade_service, scene_manage_service } from "./services"
import Story from "./storyapi/Story";
import { StorylistScene } from "./StorylistScene";

let story: Story
let page_index: number = 0;

const on_finish = () => {
    fade_service.start_out(() => {
        scene_manage_service.set_scene(new StorylistScene())
    })
}

let prompt_showing_frame = 0
let prompt_showing_text = ""
let prompt_showing_all = false
const prompt_on_mouse_pressed = () => {
    if (prompt_showing_all) {
        if (page_index < story.pages.length - 1) {
            page_index++
            prompt_showing_frame = 0
            prompt_showing_all = false
        } else on_finish()
    } else {
        prompt_showing_all = true
        prompt_showing_text = story.pages[page_index].content
    }
}

const get_speaker = (): string => {
    if (story && page_index < story.pages.length) return story.pages[page_index].speaker
    return ""
}
const draw_prompt = () => {
    p.push()
    p.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 150)
    p.rectMode(p.CENTER)
    p.noStroke()
    p.fill(LIGHTBLUE())
    p.rect(0, 0, 800, 200, 10, 10, 10)
    p.textAlign(p.LEFT, p.TOP)
    p.textSize(NORMAL_TEXTSIZE)
    p.fill(WHITE())
    p.text(get_speaker(), -370, -80)
    p.text(prompt_showing_text, -370, -40)
    p.noFill()
    p.stroke(WHITE())
    p.line(-370, -50, 370, -50)
    p.pop()
}
const update_prompt = () => {
    if (!story) return
    if (!prompt_showing_all) {
        prompt_showing_frame += 1
        const text = story.pages[page_index].content
        prompt_showing_text = text.substring(0, Math.floor(prompt_showing_frame / 5))
        if (prompt_showing_text == text) prompt_showing_all = true
    }
}
let next_page_arrow_dy = 0
const update_next_page_arrow_dy = () => {
    if (prompt_showing_all) {
        next_page_arrow_dy = 6 * p.sin(p.frameCount / 7)
    }
}
const draw_next_page_arrow = () => {
    if (prompt_showing_all) {
        p.push()
        p.translate(920, 550 + next_page_arrow_dy)
        p.noStroke()
        p.fill(WHITE())
        p.triangle(-10, 0, 10, 0, 0, 20)
        p.pop()
    }
}

export class StoryScene extends View {
    on_enter(): void {
        fade_service.start_stable()
        if (choosing_index == undefined) this.ask_story_index()
        storiesmanager.get_story_by_index(choosing_index).then(
            _story => {
                console.log(_story);

                fade_service.start_in(() => { })
                story = _story
            }
        ).catch(this.ask_story_index)
    }
    ask_story_index(): void {
        set_choosing_index(parseInt(prompt("ストーリインデックスは?")))
        this.on_enter()
    }
    tick(): void {
        p.image(get_image("bg0.png"), 0, 0)
        update_prompt()
        draw_prompt()
        update_next_page_arrow_dy()
        draw_next_page_arrow()
    }
    mouse_pressed(e: any) {
        prompt_on_mouse_pressed()
        return false
    }
}