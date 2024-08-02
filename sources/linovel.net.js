const baseUrl = "https://www.linovel.net"

//搜索
const search = (key) => {
  let response = GET(`${baseUrl}/search/index?kw=${encodeURI(key)}`)
  let array = []
  let $ = HTML.parse(response)
  $('.rank-book-list > a').forEach((child) => {
    let $ = HTML.parse(child)
    array.push({
      name: $('.book-name').text(),
      author: $('.book-extra').text().match('(.+)(?= 丨)')[0].trim(),
      cover: $('.book-cover > img').attr('src'),
      detail: `${baseUrl}${$('a').attr('href')}`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let book = {
    summary: $('.about-text').text(),
    status: $('.book-data > span:nth-child(7)').text(),
    category: $('.book-cats').text().replace('/', ' '),
    words: $('.book-data > span:nth-child(1)').text(),
    update: $('.book-last-update').text().match('(?<=更新于)(.+)')[0],
    lastChapter: $('.chapter-item.new > a').text(),
    catalog: `${url}#catalog`
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let array = []
  $('.section-list > div').forEach((booklet) => {
    let $ = HTML.parse(booklet)
    array.push({ name: $('.volume-title').text() })
    $('.chapter').forEach((chapter) => {
      let $ = HTML.parse(chapter)
      array.push({
        name: $('a').text(),
        url: `${baseUrl}${$('a').attr('href')}`,
        vip: chapter.sS == 0
      })
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  return $('.article-text')
}

//个人中心
const profile = () => {
  let response = GET(`${baseUrl}/my/profile`)
  let $ = HTML.parse(response)
  if ($('div.dialog').length != 0) throw JSON.stringify({
    code: 401
  })

  let response1 = GET('https://www.linovel.net')
  let $1 = HTML.parse(response1)
  return JSON.stringify({
    basic: [
      {
        name: '账号',
        value: $('form > div:nth-child(3) > div > p').text(),
        url: 'https://www.linovel.net/my/profile'
      },
      {
        name: '轻币',
        value: $1('div.coin > span').text(),
        url: 'https://www.linovel.net/pay/'
      },
      {
        name: '墨水',
        value: $1('div.integral > span').text(),
        url: 'https://www.linovel.net/pay/'
      },
    ],
  })
}

//排行榜
const rank = (title, category, page) => {
  let response = GET(`https://www.linovel.net/hub/getTopBooks?unit=${title}&time=${category}&page=${page + 1}`)
  let $ = JSON.parse(response)
  let books = []
  $.data.books.forEach((child) => {
    books.push({
      name: child.name,
      author: child.author,
      cover: child.coverUrl,
      detail: `https://www.linovel.net/book/${child.id}.html`,
    })
  })
  return JSON.stringify({
    end: $.data.books.length == 0,
    books: books
  })
}

const catagoryAll = [
  { "key": "week", "value": "周排行" },
  { "key": "month", "value": "月排行" },
  { "key": "new", "value": "新书排行" }
]

const ranks = [
  {
    title: {
      key: 'zt',
      value: '重推榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'ticket',
      value: '月票榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'jz',
      value: '佳作榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'coin',
      value: '轻币榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'ink',
      value: '墨水榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'supp',
      value: '应援榜'
    },
    categories: catagoryAll
  }
]

var bookSource = JSON.stringify({
  name: "轻之文库",
  url: "linovel.net",
  version: 105,
  authorization: "https://www.linovel.net/auth/login",
  cookies: ["linovel.net", "www.linovel.net"],
  ranks: ranks
})