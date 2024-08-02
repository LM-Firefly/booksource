const baseUrl = "https://w.linovelib.com"

const header_mobile = [ "User-Agent: Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Mobile Safari/537.36"]

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = GET(`${baseUrl}/s/?searchkey=${encodeURI(key)}&searchtype=all`, {headers: header_mobile})
  let array = []
  let $ = HTML.parse(response)

  if ($('#header > h1.header-back-title').text() == "搜索结果") {
    $('li.book-li').forEach((child) => {
      let $ = HTML.parse(child)
      array.push({
        name: $('h4.book-title').text(),
        author: $('span.book-author').text().replace('作者','').trim(),
        cover: $('a > img').attr('data-original'),
        detail: `${baseUrl}${$('a.book-layout').attr('href')}`,
      })
    })
  } else {
    // 搜索挑战主页问题
    array.push({
      name: $('meta[property=og:title]').attr('content'),
      author: $('meta[property=og:novel:author]').attr('content'),
      cover: $('meta[property=og:image]').attr('content'),
      detail: $('head > link[rel=canonical]').attr('href'),
    })
  }

  return JSON.stringify(array)
}

/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
  let response = GET(url, {headers: header_mobile})
  let $ = HTML.parse(response)
  let book = {
    summary: $('meta[property=og:description]').attr('content'),
    status: $('meta[property=og:novel:status]').attr('content'),
    category: $('meta[property=og:novel:category]').attr('content'),
    words: $('#bookDetailWrapper > div > div.book-layout > div > p:nth-child(4)')[0].match('(?<=\>)(.+?)(?=字)')[0],
    update: $('meta[property=og:novel:update_time]').attr('content'),
    lastChapter: $('meta[property=og:novel:latest_chapter_name]').attr('content'),
    catalog: url.replace('.html', '/catalog')
  }
  return JSON.stringify(book)
}

/**
 * 目录
 * @params {string} url
 * @returns {[{name, url, vip}]}
 */
const catalog = (url) => {
  let response = GET(url, {headers: header_mobile})
  let $ = HTML.parse(response)
  let array = []
  $('#volumes > li').forEach((chapter) => {
    let $ = HTML.parse(chapter)
    if ($('.chapter-bar').text().length != 0) {
      array.push({ name: $('li').text() })
    } else {
      array.push({
        name: $('a').text(),
        url: `${baseUrl}${$('a').attr('href')}`,
        vip: false
      })
    }
  })
  return JSON.stringify(array)
}

/**
 * 章节
 * @params {string} url
 * @returns {string}
 */
const chapter = (url) => {
  let content = ""
  let condition = true
  while (condition) {
    let response = GET(url, {headers: header_mobile})
    let $ = HTML.parse(response)
    content += $('#acontent')
    condition = $('#footlink > a:nth-child(4)').attr('href').match('.+_.+\.html')
    url = baseUrl + $('#footlink > a:nth-child(4)').attr('href')
  }
  return content
}

/**
 * 排行榜
 */
const rank = (title, category, page) => {
  let response = GET(`https://www.linovelib.com/modules/article/toplist.php?order=${title}&sortid=${category}&page=${page + 1}`)
  let $ = HTML.parse(response)
  let books = []
  $('div.rank_d_list').forEach((child) => {
    let $ = HTML.parse(child)
    books.push({
      name: $('.rank_d_b_name').attr('title'),
      author: $('.rank_d_b_cate').attr('title'),
      cover: $('.rank_d_book_img > a > img').attr('data-original'),
      detail: `${baseUrl}${$('.rank_d_b_name > a').attr('href')}`.replace('www.', 'w.'),
    })
  })
  return JSON.stringify({
    end: $('a.ngroup').attr('href').indexOf(`/${page + 1}.html`) != -1,
    books: books
  })
}

const catagoryAll = [
  { key: "0", value: "全部" },
  { key: "1", value: "点击文库" },
  { key: '2', value: '富士见文库' },
  { key: '3', value: '角川文库' },
  { key: '4', value: 'MF文库J' },
  { key: '5', value: 'Fami通文库' },
  { key: '6', value: 'GA文库' },
  { key: '7', value: 'HJ文库' },
  { key: '8', value: '一迅社' },
  { key: '9', value: '集英社' },
  { key: '10', value: '小学馆' },
  { key: '11', value: '讲谈社' },
  { key: '12', value: '少女文库' },
  { key: '13', value: '其他文库' },
  { key: '14', value: '华文轻小说' },
  { key: '15', value: '轻改漫画' },
]

const ranks = [
  {
    title: {
      key: 'allvisit',
      value: '总点击榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'monthvisit',
      value: '月点击榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'allvote',
      value: '总推荐榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'monthvote',
      value: '月推荐榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'allflower',
      value: '总鲜花榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'monthflower',
      value: '月鲜花榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'lastupdate',
      value: '最近更新'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'postdate',
      value: '最新入库'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'signtime',
      value: '最新上架'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'goodnum',
      value: '收藏榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'words',
      value: '字数榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'newhot',
      value: '新书榜'
    },
    categories: catagoryAll
  }
]

var bookSource = JSON.stringify({
  name: "哔哩轻小说",
  url: "linovelib.com",
  version: 104,
  ranks: ranks
})