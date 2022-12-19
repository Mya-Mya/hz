import { Button } from "../../button";
import { p } from "../../main";
import { modal_manage_service } from "../../services";
import { BLACK, CANVAS_HEIGHT, CANVAS_WIDTH, LIGHTBLUE, NORMAL_TEXTSIZE, SMALL_TEXTSIZE, WHITE } from "../../uiconstants";
import { View } from "../../View";
import LogPresenter from "./LogPresenter";

const y0 = 100
const dy = 100

export default class LogDialog extends View {
    private go_to_next_button = new Button(CANVAS_WIDTH / 2 + 100, CANVAS_HEIGHT - 150, "次")
    private go_to_prev_button = new Button(CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT - 150, "前")
    private close_button = new Button(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 80, "閉じる")
    private play_log_button_s: Button[] = []
    private phase: string = "in"
    private phase_s: number = 0

    constructor(private presenter: LogPresenter) {
        super()
        for (let i = 0; i < LogPresenter.LOGS_PER_LOGPAGE; i++) {
            const button = new Button(CANVAS_WIDTH - 200, y0 + dy * i, "再生")
            this.play_log_button_s.push(button)
        }
    }
    on_enter(): void {
        modal_manage_service.add(this)
    }
    tick(): void {
        p.push()
        if (this.phase == "in") {
            if (this.phase_s < 1) {
                p.scale(1, this.phase_s)
                this.phase_s += 0.1
            } else {
                this.phase_s = 0
                this.phase = "stable"
            }
        } else if (this.phase == "out") {
            p.scale(1, 1 - this.phase_s)
            if (this.phase_s >= 1) {
                modal_manage_service.delete(this)
                return
            }
            this.phase_s += 0.1
        }
        {
            p.push()
            p.fill(WHITE())
            p.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
            p.rectMode(p.CENTER)
            p.rect(0, 0, 1000, 600, 5, 5, 5, 5)
            p.pop()
        }
        this.close_button.tick()
        this.go_to_next_button.set_visible(this.presenter.can_go_to_next_logpage())
        this.go_to_next_button.tick()
        this.go_to_prev_button.set_visible(this.presenter.can_go_to_prev_logpage())
        this.go_to_prev_button.tick()
        {
            p.push()
            this.presenter.get_logs_of_logpage().forEach((value, index) => {
                const button = this.play_log_button_s[index]
                button.tick()
                p.push()
                p.textAlign(p.LEFT, p.BOTTOM)
                p.fill(LIGHTBLUE())
                p.textSize(NORMAL_TEXTSIZE)
                p.text(value.speaker, 150, button.y)
                p.pop()
                p.push()
                p.textAlign(p.LEFT, p.TOP)
                p.fill(BLACK())
                p.textSize(SMALL_TEXTSIZE)
                p.text(value.content, 150, button.y)
                p.pop()
            })
            p.pop()
        }
        p.pop()
    }
    mouse_pressed(e: any): boolean {
        if (this.close_button.mouse_pressed(e)) {
            this.close()
        } else if (this.go_to_next_button.mouse_pressed(e)) {
            this.presenter.go_to_next_logpage()
        } else if (this.go_to_prev_button.mouse_pressed(e)) {
            this.presenter.go_to_prev_logpage()
        } else {
            const logs_of_logpage = this.presenter.get_logs_of_logpage()
            for (let i = 0; i < LogPresenter.LOGS_PER_LOGPAGE; i++) {
                if (this.play_log_button_s[i].mouse_pressed(e)) {
                    logs_of_logpage[i].on_select()
                    this.close()
                    break
                }
            }
        }
        return true
    }
    close(): void {
        this.phase = "out"
    }
}