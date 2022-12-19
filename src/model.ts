import DummyStoriesManager from "./storyapi/DummyStoriesManager";
import MicrocmsStoriesManager from "./storyapi/MicrocmsStoriesManager";
import StoriesManager from "./storyapi/StoriesManager";

export const storiesmanager: StoriesManager = new MicrocmsStoriesManager()
export let choosing_index: number
export const set_choosing_index = (index: number): void => {
    choosing_index = index
}