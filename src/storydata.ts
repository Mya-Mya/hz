export type Story = {
    title: string
    pages: Page[]
}
export type Page = {
    speaker: string
    content: string
}
export const stories: Story[] = [
    {
        title: "はじめに",
        pages: [
            {
                speaker: "ナレーター",
                content: "これは私が中学2年生の時に著した小説をリメイクしたものである。"
            },
            {
                speaker:"ナレーター",
                content:"リメイクといっても、個人情報が含まれるような内容を匿名化する、程度の手入れである。"
            },
            {
                speaker:"ナレーター",
                content:"そう、あろうことか、私は現実世界を舞台に小説を作ってしまったのである。しかも主人公は私をモデル化したもの。"
            },
            {
                speaker:"ナレーター",
                content:"なんとも痛い小説なのである。"
            },
            {
                speaker:"ナレーター",
                content:"では、どうぞ！"
            }
        ]
    }
]