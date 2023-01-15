import { ZeroChan } from "./src"

let ZC = new ZeroChan("Bot", "username")
async function search(keyword: string, page: number = 1) {
    try {
        let res = await ZC.getImage(keyword, page);
        console.log(res)
        let detail = await ZC.getDetail('3568619')
        console.log(detail)
        let list = await ZC.getTags('ayaka')
        console.log(list)
        console.log(res.length)
    } catch (e) {
        console.log(e)
    }
}
search("ninym ralei", 1)