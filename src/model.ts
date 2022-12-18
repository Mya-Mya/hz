import DummyStoriesManager from "./storyapi/DummyStoriesManager";
import StoriesManager from "./storyapi/StoriesManager";

export const storiesmanager: StoriesManager = new DummyStoriesManager()
export let choosing_index: number