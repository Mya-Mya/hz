import StoryInfo from "./StoryInfo";
import Story from "./Story";

interface StoriesManager {
    get_info_s: (() => Promise<StoryInfo[]>),
    get_story_by_index: ((index: number) => Promise<Story>)
}

export default StoriesManager