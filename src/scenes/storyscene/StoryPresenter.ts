import { choosing_index, set_choosing_index, storiesmanager } from "../../model"
import Page from "../../storyapi/Page"
import Story from "../../storyapi/Story"
import IStoryScene from "./IStoryScene"

export default class StoryPresenter {
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
        this.go_to_page(this.index + 1)
    }
    go_to_page(page_index: number): void {
        this.index = page_index
        this.content_animation_frame = 0
        this.content_animation_running = true
    }
    update_content_animation(): void {
        if (this.content_animation_running) {
            this.content_animation_frame++
            this.content_animation_running = this.get_animated_content() != this.get_full_content()
        }
    }
    get current_index(){return this.index}
    get_page(): Page {
        if (this.story && this.index < this.story.pages.length) return this.story.pages[this.index]
        return undefined
    }
    get_full_content(): string {
        const page = this.get_page()
        return page ? page.content : ""
    }
    get_page_by_index(page_index:number): Page {
        return this.story.pages[page_index]
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