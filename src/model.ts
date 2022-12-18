import DummyStoriesManager from "./storyapi/DummyStoriesManager";
import StoriesManager from "./storyapi/StoriesManager";

export const storiesmanager: StoriesManager = new DummyStoriesManager()
export let choosing_index: number
export const set_choosing_index = (index: number): void => {
    choosing_index = index
}