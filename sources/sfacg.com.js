const baseUrl = "https://minipapi.sfacg.com"

//搜索
const search = (key) => {
  let response = GET(`https://m.sfacg.com/API/HTML5.ashx?op=search&keyword=${encodeURI(key)}`)
  let array = []
  let $ = JSON.parse(response)
  $.Novels.forEach((child) => {
    array.push({
      name: child.NovelName,
      author: child.AuthorName,
      cover: `https://rs.sfacg.com/web/novel/images/NovelCover/Big/${child.NovelCover}`,
      detail: `${baseUrl}/pas/mpapi/novels/${child.NovelID}?expand=latestchapter,chapterCount,typeName,intro,fav,ticket,pointCount,tags,sysTags,signlevel,discount,discountExpireDate,totalNeedFireMoney,originTotalNeedFireMoney`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url,{headers:
  ["content-type:application/json","sf-minip-info:minip_novel/1.0.70(android;10)/wxmp"]
  })
  let $ = JSON.parse(response)
  let book = {
    summary: $.data.expand.intro,
    status: $.data.isFinish == false ? '连载' : '完结',
    category: $.data.expand.sysTags[0].tagName,
    words: $.data.charCount,
    update: $.data.lastUpdateTime.match(/.+(?=T)/)[0],
    lastChapter: $.data.expand.latestChapter.title,
    catalog: `${baseUrl}/pas/mpapi/novels/${$.data.novelId}/dirs`
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(url,{headers:
  ["content-type:application/json","sf-minip-info:minip_novel/1.0.70(android;10)/wxmp"]
  })
  let $ = JSON.parse(response)
  let array = []
  $.data.volumeList.forEach((booklet) => {
    array.push({ name: booklet.title })
    booklet.chapterList.forEach((chapter) => {
      array.push({
        name: chapter.title,
        url: `${baseUrl}/pas/mpapi/Chaps/${chapter.chapId}?expand=content,needFireMoney,originNeedFireMoney,tsukkomi&autoOrder=false`,
        vip: chapter.isVip == true
      })
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let $ = JSON.parse(GET(url,{headers:
  ["content-type:application/json","sf-minip-info:minip_novel/1.0.70(android;10)/wxmp"]
  }))
    //未购买返回403和自动订阅地址
    if ($.status.msg == "请支持作者的辛勤写作,VIP章节必须登录后才可阅读"||$.status.msg == "请支持作者的辛勤写作,VIP章节必须购买后才可阅读") throw JSON.stringify({
        code: 403,
        message: `https://m.sfacg.com/c/${$.data.chapId}/`
    })
  return $.data.expand.content.replace(/\[img.*?\]/g, '<img src="').replace(/\[.*img\]/g, '"/>')
}

/**
 * 个人
 * @returns {[{url, nickname, recharge, balance[{name, coin}], sign}]}
 */
const profile = () => {
    let headers = ["content-type:application/json","sf-minip-info:minip_novel/1.0.70(android;10)/wxmp"]
    let $ = JSON.parse(GET(`${baseUrl}/pas/mpapi/user`,{headers}))
    if ($.status.msg === '需要登录才能访问该资源') throw JSON.stringify({
        code: 401
    })
    return JSON.stringify({
        basic: [
            {
                name: '账号',
                value: $.data.nickName,
                url: 'https://m.sfacg.com/my/'
            },
            {
                name: '火券',
                value: $.data.fireCoin,
                url: 'https://m.sfacg.com/pay/',
            }
        ],
    extra: [
      {
         name: '书架',
         type: 'books',
         method: 'bookshelf'
      }
    ]
  })
}

/**
 * 我的书架
 * @param {页码} page 
 */
const bookshelf = (page) => {
  let response = GET(`${baseUrl}/pas/mpapi/user/Pockets?expand=novels`,{headers:
  ["content-type:application/json","sf-minip-info:minip_novel/1.0.70(android;10)/wxmp"]
  })
  let $ = JSON.parse(response).data[2]
  let books = $.expand.novels.map(book => ({
    name: book.novelName,
    author: book.authorName,
    cover: book.novelCover,
    detail: `${baseUrl}/pas/mpapi/novels/${book.novelId}?expand=latestchapter,chapterCount,typeName,intro,fav,ticket,pointCount,tags,sysTags,signlevel,discount,discountExpireDate,totalNeedFireMoney,originTotalNeedFireMoney`
  }))
  return JSON.stringify({books})
}

//排行榜
const rank = (title, category, page) => {
  let response = GET(`https://api.sfacg.com/novels/${title}/sysTags/novels?sort=latest&systagids=&isfree=both&isfinish=both&updatedays=-1&charcountbegin=0&charcountend=0&page=${page}&size=20&expand=typeName,tags,discount,discountExpireDate`,{headers:
  ["authorization: Basic YW5kcm9pZHVzZXI6MWEjJDUxLXl0Njk7KkFjdkBxeHE="]
  })
  let $ = JSON.parse(response)
  let books = []
  $.data.forEach((child) => {
    books.push({
      name: child.novelName,
      author: child.authorName,
      cover: child.novelCover,
      detail: `${baseUrl}/pas/mpapi/novels/${child.novelId}?expand=latestchapter,chapterCount,typeName,intro,fav,ticket,pointCount,tags,sysTags,signlevel,discount,discountExpireDate,totalNeedFireMoney,originTotalNeedFireMoney`,
    })
  })
  return JSON.stringify({
    books: books
  })
}


const ranks = [
    {
        title: {
            key: '21',
            value: '魔幻'
        }
    },
    {
        title: {
            key: '22',
            value: '玄幻'
        }
    },
    {
        title: {
            key: '23',
            value: '古风'
        }
    },
    {
        title: {
            key: '24',
            value: '科幻'
        }
    },
    {
        title: {
            key: '25',
            value: '校园'
        }
    },
    {
        title: {
            key: '26',
            value: '都市'
        }
    },
    {
        title: {
            key: '27',
            value: '游戏'
        }
    },
    {
        title: {
            key: '28',
            value: '悬疑'
        }
    }
]

const login = (args) => {
if(!args) return "账号或者密码不能为空"
    let data =`{"username":"${args[0]}","password":"${args[1]}"}`
    let headers = ["content-type:application/json","sf-minip-info:minip_novel/1.0.70(android;10)/wxmp"]
    let response = POST(`https://minipapi.sfacg.com/pas/mpapi/sessions`,{data,headers})
    let $ = JSON.parse(response)
    if($.status.httpCode == 401) return $.status.msg
}

var bookSource = JSON.stringify({
  name: "SF轻小说",
  url: "sfacg.com",
  version: 105,
  authorization: JSON.stringify(['account','password']),
  cookies: ["sfacg.com"],
  ranks: ranks
})
