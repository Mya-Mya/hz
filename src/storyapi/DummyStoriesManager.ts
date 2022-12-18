import StoriesManager from "./StoriesManager";
import Story from "./Story";
import StoryInfo from "./StoryInfo";

const wait = (): Promise<void> => new Promise(
    resolve => setTimeout(resolve, 1000)
)

export default class DummyStoriesManager implements StoriesManager {
    async get_info_s(): Promise<StoryInfo[]> {
        await wait()
        return [
            { index: 1, title: "序章" },
            { index: 2, title: "生田ミナの到来" }
        ]
    }
    async get_story_by_index(index: number): Promise<Story> {
        await wait()
        if (index == 1) {
            return {
                info: { index, title: "序章" },
                pages: [
                    { speaker: '???', content: '(…あれ、、あれれ？？)' },
                    { speaker: '???', content: '(ガチャガチャ)' },
                    { speaker: '???', content: '(おかしいな、なんで開かないんだ？)' },
                    {
                        speaker: '???',
                        content: 'ねえ、母さーん！\n私の部屋のドアが開かなくなっちゃったんだけど、\nドアの外に何かあるの？'
                    },
                    { speaker: '母', content: '…' },
                    {
                        speaker: '???',
                        content: '母さんってばー！\nそこにいるのは分かってるんだけどー\n緊急事態だよ、エマージェンシー！！'
                    },
                    { speaker: '母', content: '…ね…' },
                    { speaker: '???', content: 'なにー？\n聞こえなーい！' },
                    { speaker: '母', content: '…ごめんね' },
                    {
                        speaker: '???',
                        content: 'ごめん…？よく分からないけど、\n何か話があるなら、このドアを開けてからにしてよ'
                    },
                    { speaker: '母', content: '…' },
                    { speaker: '???', content: '…待って、もしかして、外から鍵をかけているの？' },
                    { speaker: '母', content: '…ごめん\n…母さんが？私の部屋に？\n外から？鍵をかけた…！？' },
                    { speaker: '母', content: '…ごめんね' },
                    {
                        speaker: '???',
                        content: 'そんな申し訳なく思うのなら、とりあえずドアを開けてよ。\nというか、なんで私を部屋に閉じ込めたのよ。'
                    },
                    { speaker: '母', content: '…' },
                    { speaker: '???', content: 'ねえ、そろそろ文章を喋ってもいいんじゃないの！？' },
                    { speaker: '母', content: '…仕方がなかったの。' },
                    { speaker: '???', content: 'やっと喋った。\n何が仕方なかったの？' },
                    { speaker: '母', content: '私たちはこの文明をもってしてでも、\nあの暴走を止めることはできなかった。' },
                    {
                        speaker: '???',
                        content: 'あーはいはいまた仕事の話ですね\n仕事の愚痴は私を解放してからにしなさい‼︎'
                    },
                    { speaker: '母', content: '…' },
                    {
                        speaker: '???',
                        content: 'ねえ母さん、教えてよ。\n何があったの？嫌な予感しかしないけど…\n教えてほしい。'
                    },
                    { speaker: '母', content: '…Earth(アース)を守るためには、こうするしかなかったの。' },
                    { speaker: '???', content: '…どういうこと？\nなんで今あの星の話が出てくるのよ。' },
                    { speaker: '母', content: 'おかげでEarthは助かるんだわ。\nうん。そう。これでよかったの。' },
                    {
                        speaker: '???',
                        content: 'いいからさ、これから何が起こるのか、\n単刀直入に言ってくれない？\nそれで、言ったら私をこの部屋から出して。'
                    },
                    { speaker: '母', content: '…ちょっとびっくりするかもしれないんだけどね。' },
                    { speaker: '???', content: 'うん。' },
                    { speaker: '母', content: '…私たちは、数分後に、この世を去る。' },
                    { speaker: '???', content: '….！？' },
                    {
                        speaker: '母',
                        content: '死ぬのは私とあなただけじゃない。\n…この星の全員よ。\nこの星が、滅亡するの。'
                    }
                ]
            }
        }
        return { info: { index, title: "null" }, pages: [{ speaker: "null", content: "null" }] }
    }
}