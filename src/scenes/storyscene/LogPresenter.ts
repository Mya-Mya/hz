import StoryPresenter from "./StoryPresenter";

export default class LogPresenter {
    public static LOGS_PER_LOGPAGE = 4
    private logpage: number
    private logs_of_logpage: { speaker: string, content: string, on_select: () => void }[] = []
    constructor(private presenter: StoryPresenter) {
        this.go_to_logpage(
            Math.floor(presenter.current_index / LogPresenter.LOGS_PER_LOGPAGE)
        )
    }
    go_to_logpage(p: number) {
        this.logpage = p
        this.logs_of_logpage = []
        const offset = this.logpage * LogPresenter.LOGS_PER_LOGPAGE
        for (let i = offset; i < offset + LogPresenter.LOGS_PER_LOGPAGE; i++) {
            if (i > this.presenter.current_index) break
            const page = this.presenter.get_page_by_index(i)
            this.logs_of_logpage.push({
                content: page.content,
                speaker: page.speaker,
                on_select: () => {
                    this.presenter.go_to_page(i)
                }
            })
        }
    }
    can_go_to_next_logpage(): boolean {
        /**
         * 現在話が進んでいる先端のインデックスをiとする。
         * ログページあたりnつのログを表示できるなら
         * ログページpではnpからn(p+1)-1までのインデックスを表示できる。
         * ログページ(p+1)に表示できるログがあることはn(p+1)<=indexであることと等価である。
         */
        return (this.logpage + 1) * LogPresenter.LOGS_PER_LOGPAGE <= this.presenter.current_index
    }
    can_go_to_prev_logpage(): boolean {
        return 0 < this.logpage
    }
    go_to_next_logpage() {
        if (this.can_go_to_next_logpage()) this.go_to_logpage(this.logpage + 1)
    }
    go_to_prev_logpage() {
        if (this.can_go_to_prev_logpage()) this.go_to_logpage(this.logpage - 1)
    }
    get_logs_of_logpage(): { speaker: string, content: string, on_select: () => void }[] {
        return this.logs_of_logpage
    }

}