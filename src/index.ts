import fetch from 'node-fetch';
import https from 'https';
import cheerio from 'cheerio';

async function safeParseJSON(response: any) {
    let body: string = await response.text()
    try {
        return JSON.parse(body);
    } catch (err) {
        try {
            body = body.replaceAll(/[\\]/g, "")
            body = body.replace("next: true", '"status": "done"')
            return JSON.parse(body);
        } catch (e) {
            // console.log(body)
            if (body.includes('Some content is for members only')) return "Login First"
            // throw err;
            return false
        }
    }
}

function parseCookies(response: any) {
    const raw = response
    return raw.map((entry: string) => {
        const parts = entry.split(';');
        const cookiePart = parts[0];
        return cookiePart;
    }).join(';');
}

async function get_login(username: string, pass: string) {
    const url = `https://www.zerochan.net/login?ref=%2F&name=${username}&password=${pass}&login=Login`;
    return new Promise((resolve) => {
        https.get(url, (res) => {
            var data: any;
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                resolve(parseCookies(res.headers['set-cookie']))
            });
        });
    });
}

export class ZeroChan {
    login = async (username: string, password: string) => {
        let res = await get_login(username, password);
        this.cookie = res || undefined;
    }

    getImage = async (keyword: any, page: Number = 1, strict: string = "on") => {
        if (isNaN(Number(page))) {
            throw new Error("Invalid Page Number!")
        }
        let opts: any = {};
        if (this.cookie) {
            opts = {
                headers: {
                    cookie: this.cookie
                }
            }
        }
        let strictMode: string = '&strict'
        if (strict.toLowerCase() !== 'off') {
            strictMode = ""
        }
        let res = await fetch(`https://www.zerochan.net/${keyword}?p=${page}&l=100&json${strictMode}`, opts)
        let response = await safeParseJSON(res)
        if (response == false) throw new Error("Keyword Not Found!")
        if (response == "Login First") throw new Error("Not Found, please Use Login to Avoid this Error")
        if (!response.items) throw new Error("Page Number Too High")
        return response.items
    }

    getTags = async (keyword: string) => {
        const response = await fetch(`https://www.zerochan.net/tags?q=${keyword}&t=&m=list`);
        const body = await response.text();

        // parse the html text and extract titles
        const $ = cheerio.load(body);
        const titleList: { tag: string; maxPage: number; }[] = []

        $('#content').children('ul').each(function () {
            $(this).children('li').each(function () {
                const titleText = $(this).children('a').text()
                let count = $(this).last().text()
                count = count.replace(titleText + " ", '')
                let countX = Math.ceil(Number(count) / 100)
                if (countX > 99) countX = 99
                if (Number(count) > 10) {
                    titleList.push({
                        tag: titleText,
                        maxPage: countX
                    })
                }
            })
        })
        return titleList
    }

    getDetail = async (id: any) => {
        let opts: any = {};
        if (this.cookie) {
            opts = {
                headers: {
                    cookie: this.cookie
                }
            }
        }
        let response = await fetch(`https://www.zerochan.net/${id}?json`, opts)
        let image = await safeParseJSON(response)
        return image
    }

    cookie: any;
}