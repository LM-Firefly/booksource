const baseUrl = "https://m.ruochu.com"

//搜索
const search = (key) => {
  let response = GET(`https://search.ruochu.com/m/search?queryString=${encodeURI(key)}&highlight=false&page=1&extra=false`)
  let array = []
  let $ = JSON.parse(response)
  $.data.content.forEach((child) => {
    array.push({
      name: child.name,
      author: child.authorname,
      cover: `https://b-new.heiyanimg.com/book/${child.id}.jpg`,
      detail: `${baseUrl}/book/${child.id}`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let book = {
    summary: $('.book-intro > div > .bd').text(),
    status: $('.finish').text(),
    category: $('.tags').text(),
    words: $('.info').text().match(/(?<= )(\S+?)(?=字)/)[0],
    update: $('.time').text().match(/(?<=更新于)(.+)/)[0],
    lastChapter: $('.update > a > span[style]').text(),
    catalog: $('.chapters > a').attr('href').replace('m.ruochu.com/chapter', 'a.ruochu.com/m/ajax/book').replace('?isAsc=', '/chapter')
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(`${url}?volumeIndex=0`)
  let $ = JSON.parse(response)
  let array = []
  catalogLoadPage(url, array, $)
  //得到页数读取分页
  for (var i = 1; i < $.volumeNames.pageCount; i++) {
    response = GET(`${url}?volumeIndex=${i}`)
    $ = JSON.parse(response)
    catalogLoadPage(url, array, $)
  }
  return JSON.stringify(array)
}

//目录分页
const catalogLoadPage = (url, array, $) => {
  $.rf.forEach((chapter) => {
    array.push({
      name: chapter.name,
      url: url.replace('a.ruochu.com/m/ajax', 'm.ruochu.com').replace('chapter', chapter.id),
      vip: chapter.free == false
    })
  })
}

//章节
const chapter = (url) => {
  let response = GET(`https://a.ruochu.com/m/ajax/chapter/content${url.substring(url.lastIndexOf('/'))}`)
  let $ = JSON.parse(response)
  //VIP章节未购买返回403和自动订阅地址
  if ($.nopay == true) throw JSON.stringify({
    code: 403,
    message: url
  })
  //VIP章节已购买
  if ($.chapter?.htmlContent) return $.chapter.htmlContent
  //免费章节
  response = GET(url)
  $ = HTML.parse(response)
  return $('#chapterDiv > .page-content')
}

//个人中心
const profile = () => {
  let response = GET(`https://a.ruochu.com/m/ajax/user/info`)
  let $ = JSON.parse(response)
  return JSON.stringify({
    basic: [
      {
        name: '账号',
        value: $.userVO.name,
        url: 'https://accounts.ruochu.com/m/people'
      },
      {
        name: '岩币',
        value: $.balance,
        url: 'https://pay.ruochu.com/m/accounts/pay'
      },
      {
        name: '钻石',
        value: $.coin,
        url: 'https://pay.ruochu.com/m/accounts/pay'
      }
    ],
    //拓展方法
    extra: [
      {
        name: '自动签到',
        type: 'permission',
        method: 'sign',
        times: 'day'
      }
    ]
  })
}

//签到 返回true表示签到成功
const sign = () => {
  let response = GET('https://a.ruochu.com/m/jsonp/user/get/sign')
  let $ = JSON.parse(response)
  if ($.result?.isSign) return true
  response = GET('https://a.ruochu.com/m/jsonp/user/sign')
  $ = JSON.parse(response)
  return $.code == 'sign-2'
}

//排行榜
const rank = (title, category, page) => {
  let array = []
  if (title.length == 1) {
    let response = GET(`https://m.ruochu.com/top10`)
    let $ = HTML.parse(response)
    $ = HTML.parse($('.rank-detail')[parseInt(title)])
    $('.detail-item').forEach((child) => {
      let $ = HTML.parse(child)
      array.push({
        name: $('.title-box > .cut').text(),
        author: $('.author-name').text(),
        cover: `https://b-new.heiyanimg.com${$('a').attr('href')}.jpg`,
        detail: `${baseUrl}${$('a').attr('href')}`
      })
    })
  } else {
    let response = GET(`https://vote.ruochu.com/m/top/${title}/day?pageSize=10`)
    let $ = JSON.parse(response)
    $.voteBookRankList.forEach((book) => {
      array.push({
        name: book.bookName,
        author: book.userVO.name,
        cover: `https://b-new.heiyanimg.com/book/${book.bookId}.jpg`,
        detail: `${baseUrl}/book/${book.bookId}`
      })
    })
  }
  return JSON.stringify({
    books: array
  })
}

const ranks = [
  {
    title: {
      key: '0',
      value: '新书榜'
    }
  },
  {
    title: {
      key: '1',
      value: '点击榜'
    }
  },
  {
    title: {
      key: '2',
      value: '热门榜'
    }
  },
  {
    title: {
      key: 'monthly',
      value: '钻石榜'
    }
  },
  {
    title: {
      key: '4',
      value: '订阅榜'
    }
  },
  {
    title: {
      key: '5',
      value: '收藏榜'
    }
  },
  {
    title: {
      key: 'tuijian',
      value: '推荐榜'
    }
  },
  {
    title: {
      key: '7',
      value: '捧场榜'
    }
  }
]

var bookSource = JSON.stringify({
  name: "若初文学网",
  url: "ruochu.com",
  version: 102,
  authorization: "https://m.ruochu.com/accounts/login",
  cookies: [".ruochu.com"],
  ranks: ranks
})