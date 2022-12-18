import { View } from "./View";
import { p } from "./main";
import { CANVAS_HEIGHT, CANVAS_WIDTH, LIGHTBLUE, NORMAL_TEXTSIZE, WHITE } from "./uiconstants";
import { choosing_index, set_choosing_index, storiesmanager } from "./model"
import { get_image } from "./images";
import { fade_service, scene_manage_service } from "./services"
import Story from "./storyapi/Story";
import { StorylistScene } from "./StorylistScene";
import Page from "./storyapi/Page";

interface IStoryScene {
    ask_story_index: (() => number),
    back_to_storylist_scene: (() => void)
}

class GotoNextPageArrow extends View {
    private dy: number = 0
    constructor(private presenter: StoryPresenter) { super() }
    tick(): void {
        if (this.presenter.is_content_animation_done()) {
            this.dy = 6 * p.sin(p.frameCount / 7)
            p.push()
            p.translate(920, 550 + this.dy)
            p.noStroke()
            p.fill(WHITE())
            p.triangle(-10, 0, 10, 0, 0, 20)
            p.pop()
        }
    }
}

class StoryPresenter {
    private story: Story
    private index: number = 0
    private content_animation_frame: number = 0
    private content_animation_running: boolean = false
    constructor(private view: IStoryScene) { }

    async load_story(): Promise<void> {
        if (choosing_index == undefined) set_choosing_index(this.view.ask_story_index())
        try {
            this.story = await storiesmanager.get_story_by_index(choosing_index)
        } catch {
            set_choosing_index(this.view.ask_story_index())
            this.load_story()
        }
    }
    is_last_page(): boolean {
        if (this.story && this.index < this.story.pages.length) {
            return this.story.pages.length - 1 == this.index
        }
        return false
    }
    click(): void {
        if (this.content_animation_running) {
            this.content_animation_running = false
            this.content_animation_frame = 0
        } else {
            this.go_to_next_page()
        }
    }
    go_to_next_page(): void {
        if (this.is_last_page()) this.view.back_to_storylist_scene()
        this.index++
        this.content_animation_frame = 0
        this.content_animation_running = true
    }
    update_content_animation(): void {
        if (this.content_animation_running) {
            this.content_animation_frame++
            this.content_animation_running = this.get_animated_content() != this.get_full_content()
        }
    }
    get_page(): Page {
        if (this.story && this.index < this.story.pages.length) return this.story.pages[this.index]
        return undefined
    }
    get_full_content(): string {
        const page = this.get_page()
        return page ? page.content : ""
    }
    get_animated_content(): string {
        return this.content_animation_running ?
            this.get_full_content().substring(0, Math.ceil(this.content_animation_frame / 5)) :
            this.get_full_content()
    }
    get_speaker(): string {
        const page = this.get_page()
        return page ? page.speaker : ""
    }
    is_content_animation_done(): boolean {
        return !this.content_animation_running
    }
}
export class StoryScene extends View implements IStoryScene {
    private presenter = new StoryPresenter(this)
    private gotonextpagearrow = new GotoNextPageArrow(this.presenter)
    on_enter(): void {
        fade_service.start_stable()
        this.presenter.load_story().then(value => fade_service.start_in(() => { }))
    }
    tick(): void {
        p.image(get_image("bg0.png"), 0, 0)
        this.presenter.update_content_animation()

        p.push()
        p.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 150)
        p.rectMode(p.CENTER)
        p.noStroke()
        p.fill(LIGHTBLUE())
        p.rect(0, 0, 800, 200, 10, 10, 10)
        p.textAlign(p.LEFT, p.TOP)
        p.textSize(NORMAL_TEXTSIZE)
        p.fill(WHITE())
        p.text(this.presenter.get_speaker(), -370, -80)
        p.text(this.presenter.get_animated_content(), -370, -40)
        p.noFill()
        p.stroke(WHITE())
        p.line(-370, -50, 370, -50)
        p.pop()

        this.gotonextpagearrow.tick()
    }
    mouse_pressed(e: any) {
        this.presenter.click()
        return false
    }
    ask_story_index(): number {
        return parseInt(prompt("ストーリインデックスは?"))
    }
    back_to_storylist_scene(): void {
        fade_service.start_out(() => {
            scene_manage_service.set_scene(new StorylistScene())
        })
    }
}