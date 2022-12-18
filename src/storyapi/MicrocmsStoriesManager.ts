import { createClient, MicroCMSClient } from "microcms-js-sdk";
import Page from "./Page";
import StoriesManager from "./StoriesManager";
import MicrocmsManagerAPIKey from "./../../MicrocmsStoriesManagerAPIKey.json"
import Story from "./Story";
import StoryInfo from "./StoryInfo";

export const build_pages_from_raw = (text: string) => {
    let speaker: string = undefined
    let content: string = undefined
    let before_space = true
    let page_s: Page[] = []
    text.split("\n").forEach(row => {
        if (row == "") {
            before_space = true
            page_s.push({ speaker, content })
            speaker = undefined
            content = undefined
        } else {
            if (before_space) {
                before_space = false
                speaker = row
            }
            else {
                content = content == undefined ? row : `${content}\n${row}`
            }
        }
    })
    if (speaker != undefined) {
        page_s.push({ speaker, content })
    }
    return page_s
}

export default class MicrocmsStoriesManager implements StoriesManager {
    private story_s_buffer: Story[] = undefined;
    constructor() {
    }
    async get_story_s(): Promise<Story[]> {
        if (!this.story_s_buffer) {
            this.story_s_buffer = []
            const client = createClient({ serviceDomain: "houlexzokueikikan", apiKey: MicrocmsManagerAPIKey })
            const response = await client.get({ endpoint: "story", queries: { orders: "index" } })
            const { contents } = response
            contents.forEach(item => {
                const { index, title, content } = item
                const info: StoryInfo = { index, title }
                const pages: Page[] = build_pages_from_raw(content)
                const story: Story = { info, pages }
                this.story_s_buffer.push(story)
            })
        }
        return this.story_s_buffer
    }
    async get_info_s(): Promise<StoryInfo[]> {
        const story_s: Story[] = await this.get_story_s()
        const info_s = story_s.map(story => story.info)
        return info_s
    }
    async get_story_by_index(index: number): Promise<Story> {
        const story_s: Story[] = await this.get_story_s()
        const story: Story = story_s.find(s => s.info.index == index)
        return story
    }

}