# ZeroChan Scraper

Get Image from ZeroChan.net

## Installation

```
npm i zerochan-scraper-ts
```

### Get Image by Keyword

```js
const { ZeroChan } = require('zerochan-scraper-ts')
let ZC = new ZeroChan("Project Name", "Username")

async function getImage(keyword, page) {
    try {
        let res = await ZC.getImage(keyword, page);
        console.log(res)
    } catch (e) {
        console.log(e)
    }
}

getImage("Katou Megumi", 2)
```

### Get Image Detail by ID

```js
const { ZeroChan } = require('zerochan-scraper-ts')
let ZC = new ZeroChan("Project Name", "Username")

async function getDetail(id) {
    try {
        let detail = await ZC.getDetail(id)
        console.log(detail)
    } catch (e) {
        console.log(e)
    }
}

getDetail("2791848")
```

### Get Tag List

```js
const { ZeroChan } = require('zerochan-scraper-ts')
let ZC = new ZeroChan("Project Name", "Username")

async function getTag(keyword) {
    try {
        let list = await ZC.getTags(keyword)
        console.log(list)
    } catch (e) {
        console.log(e)
    }
}

getTag("faruzan")
```

## Contributions

Software contributions are welcome. If you are not a dev, testing and reproting bugs can also be very helpful!

## Questions?

Please open an issue if you have questions, wish to request a feature, etc.