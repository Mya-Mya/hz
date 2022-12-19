import { View } from "../../View";
import { p } from "../../main";
import { CANVAS_HEIGHT, CANVAS_WIDTH, LIGHTBLUE, NORMAL_TEXTSIZE, WHITE } from "../../uiconstants";
import { choosing_index, set_choosing_index, storiesmanager } from "../../model"
import { get_image } from "../../images";
import { fade_service, scene_manage_service } from "../../services"
import { StorylistScene } from "../../StorylistScene";
import IStoryScene from "./IStoryScene";
import StoryPresenter from "./StoryPresenter";
import GotoNextPageArrow from "./GotoNextPageArrow";
import { Button } from "../../button";
import LogDialog from "./LogDialog";
import LogPresenter from "./LogPresenter";

export default class StoryScene extends View implements IStoryScene {
    private presenter = new StoryPresenter(this)
    private gotonextpagearrow = new GotoNextPageArrow(this.presenter)
    private log_button = new Button(CANVAS_WIDTH - 100, 100, "ログ")
    private exit_button = new Button(100, 100, "中断")
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

        this.log_button.tick()
        this.exit_button.tick()

        this.gotonextpagearrow.tick()
    }
    mouse_pressed(e: any) {
        if (this.log_button.mouse_pressed(e)) {
            new LogDialog(new LogPresenter(this.presenter)).on_enter()
        } else if (this.exit_button.mouse_pressed(e)) {
            this.back_to_storylist_scene()
        } else {
            this.presenter.click()
        }
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