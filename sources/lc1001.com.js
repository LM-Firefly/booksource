require("crypto-js")
const Secret = "XKrqBSeeEwgDy2pT"

function getsign(url, method, data) {
    var str = data.split("&").sort(function(a, b) {
        return a.localeCompare(b)
    }).join("")
    console.log(data)
    str = method + url + str + Secret
    sign = CryptoJS.MD5(encodeURIComponent(str)).toString()
    console.log(sign)
    return sign

}

//搜索
const search = (key) => {
    let url = "http://a.lc1001.com/app/query/keybooks"
    let method = "POST"
    let data = `consumerKey=LCREAD_ANDROID&timestamp=${new Date().getTime()}&uID=0&pn=0`
    let sign = getsign(url, method, data)
    let response = POST(url + "?kw=" + encodeURI(key) + "&" + data + "&sign=" + sign, {
        data: "."
    })
    let $ = JSON.parse(response)
    let books = $.DATA.KEYLIST.map(book => ({
        name: book.KEYNAME,
        author: book.AUTHORNAME,
        cover: book.COVERURL,
        detail: JSON.stringify({
            url: "http://a.lc1001.com/app/info/bookindex",
            data: `consumerKey=LCREAD_ANDROID&timestamp=${new Date().getTime()}&bID=${book.KEYID}&lmID=1000&uID=0`
        })
    }))


    return JSON.stringify(books)
}


//详情
const detail = (url) => {
    let args = JSON.parse(url)
    let sign = getsign(args.url, "GET", args.data)
    let data = args.data + "&sign=" + sign
    let response = POST(args.url, {
        data
    })
    let $ = JSON.parse(response).DATA
    let book = {
        summary: $.CONTENT,
        status: $.STATE == 1 ? "完结" : "连载",
        category: $.BTNAME,
        words: $.WORDNUM,
        update: formatDate($.INTUPTIME),
        lastChapter: $.NEWCHAPTER,
        catalog: JSON.stringify({
            url: "http://a.lc1001.com/app/info/bookcata",
            bid: $.BID,
            data: `consumerKey=LCREAD_ANDROID&timestamp=${new Date().getTime()}&bID=${$.BID}&isUpdate=0&uID=0`
        })
    }
    return JSON.stringify(book)
}

//转换更新时间 时间戳
function formatDate(timeStamp) {
    let diff = (new Date().getTime() - timeStamp) / 1000
    //   diff = Math.floor(diff)
    if (diff < 60) {
        return '刚刚'
    } else if (diff < 3600) {
        return `${parseInt(diff / 60)}分钟前`
    } else if (diff < 86400) {
        return `${parseInt(diff / 3600)}小时前`
    } else {
        let date = new Date(timeStamp * 1000 / 1000)
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }
}

//目录
const catalog = (url) => {
    let args = JSON.parse(url)
    let sign = getsign(args.url, "GET", args.data)
    let data = args.data + "&sign=" + sign
    let response = POST(args.url, {
        data
    })
    let $ = JSON.parse(response)
    let array = []
    $.DATA.BOOKCATA.forEach((booklet) => {
        array.push({
            name: booklet.VNAME
        })
        booklet.CHAPTERS.forEach((chapter) => {
            array.push({
                name: chapter.CNAME,
                url: chapter.ISVC == 0 ? `http://www.lcread.com/bookpage/${args.bid}/${chapter.CID}rc.html` : `http://my.lc1001.com/vipchapters/read?book=${args.bid}&chapter=${chapter.CID}`,
                vip: chapter.ISVC != 0
            })
        })
    })
    return JSON.stringify(array)
}

// 正文
const chapter = (url) => {
    let response = GET(url)
    let $ = HTML.parse(response.replace("../vipchapters", "http://my.lc1001.com/vipchapters"))
    if ((/订阅已选章节/).test(response)) throw JSON.stringify({
        code: 403,
        message: url
    })
    return $("#ccon,p.ccon_vip")

}

//个人中心
const profile = () => {
    let response = GET(`http://my.lc1001.com/epay/account?u=`)
    let $ = HTML.parse(response)
    return JSON.stringify({
        basic: [{
                name: "账号",
                value: $("strong").text().match(/，(.+?)！/)[1],
                url: "http://my.lc1001.com/book/bookhouse?u=&pn=0&from=null"
            },
            {
                name: '铜板',
                value: response.match(/(\d+) 铜板/)[1],
                url: 'http://www.lcread.com/epay/cashin_interface_index.html'

            },
            {
                name: '福利币',
                value: response.match(/(\d+) 福利币/)[1],
                url: 'http://www.lcread.com/epay/cashin_interface_index.html'
            }
        ]
    })
}
const ranks = [{
        title: {
            key: 20,
            value: "女生"
        }
    }

    ,
    {
        title: {
            key: 10,
            value: "男生"
        }
    },
    {
        title: {
            key: 50,
            value: "耽美同人"
        }
    }

]

let categories = [{
        "key": "fsb-0",
        "value": "封神榜"
    },
    {
        "key": "zsb-1",
        "value": "钻石榜"
    },
    {
        "key": "qgb-2",
        "value": "勤更榜"
    },
    {
        "key": "tjb-3",
        "value": "推荐榜"
    },
    {
        "key": "rqb-4",
        "value": "人气榜"
    },
    {
        "key": "scb-5",
        "value": "收藏榜"
    },
    {
        "key": "wdb-6",
        "value": "字数榜"
    },
    {
        "key": "xsb-7",
        "value": "新书榜"
    }
]
for (var i = 0; i < ranks.length; i++) {
    ranks[i].categories = categories;
}

//排行
const rank = (title, category, page) => {
    let cate = category.split("-")
    let data = `prefer=${title}&rank=${cate[0]}&pn=${page+1}0&aType=50&from=`
    let response = POST("http://h5.lc1001.com/top/s", {
        data
    })
    let $ = JSON.parse(response)
    let books = []
    $.TOPLIST[cate[1]].BOOKS.forEach((item) => {
        books.push({
            name: item.BOOKNAME,
            author: item.AUTHORNAME,
            cover: `http://pic.lc1001.com/pic/cover/${item.BOOKID.substring(0, item.BOOKID.length - 3)}/${item.BOOKID}_120.gif`,
            detail: JSON.stringify({
                url: "http://a.lc1001.com/app/info/bookindex",
                data: `consumerKey=LCREAD_ANDROID&timestamp=${new Date().getTime()}&bID=${item.BOOKID}&lmID=1000&uID=0`
            })
        })
    })
    return JSON.stringify({
        end: page + 1 == 5,
        books
    })
}


var bookSource = JSON.stringify({
    name: "连城读书",
    url: "lc1001.com",
    version: 101,
    authorization: "http://my.lc1001.com/user/login",
    cookies: [".lc1001.com", ".lcread.com"],
    ranks: ranks
})