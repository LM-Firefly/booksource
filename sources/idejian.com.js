const baseUrl = "https://www.idejian.com"

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = GET(`${baseUrl}/search?keyword=${encodeURI(key)}`)
  let array = []
  let $ = HTML.parse(response)
    $('.main > div > ul > li').forEach((child) => {
      let $ = HTML.parse(child)
      array.push({
        name: $('.rank_bkname').text(),
        author: $('.author').text(),
        cover: $('.items_l > a > img').attr('src'),
        detail: `${baseUrl}${$('.rank_bkname > a').attr('href')}`,
      })
    })
  
  return JSON.stringify(array)
}

/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let book = {
    summary: $('.brief_con').text(),
    status: $('span.light_box').text(),
    category: $('div.detail_bkgrade').text(),
    words: $('.bk_fontinfo > span:nth-child(1)').text().replace("字",""),
    update: $('.border_box.bk_detail > div > span').text(),
    lastChapter: $('.bk_detail > div > div > a').text(),
    catalog: url
  }
  return JSON.stringify(book)
}

/**
 * 目录
 * @params {string} url
 * @returns {[{name, url, vip}]}
 */
const catalog = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let array = []
    $('.catelog > ul > li').forEach((chapter) => {
      let $ = HTML.parse(chapter)
      array.push({
        name: $('a').text(),
        url: `${baseUrl}${$('a').attr('href')}`
      })
    })
  return JSON.stringify(array)
}

/**
 * 章节
 * @params {string} url
 * @returns {string}
 */
const chapter = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  return $('.read_content')
}

/**
 * 排行榜
 */
const rank = (title, category, page) => {
  let response = GET(`https://www.idejian.com/books/${title}?categoryId=${category}&page=${page + 1}`)
  let $ = HTML.parse(response)
  let books = []
  $('.v_bklist_two > ul > li').forEach((child) => {
    let $ = HTML.parse(child)
    books.push({
      name: $('.bkitem_name').text(),
      author: $('.bkitem_author').text(),
      cover: $('.v_item > a > img').attr('src'),
      detail: `${baseUrl}${$('.bkitem_name > a').attr('href')}`,
    })
  })
  return JSON.stringify({
    books: books
  })
}

const ranks = [
  {
    title: {
      key: 'nansheng',
      value: '男频'
    },
    categories: [
      { key: "1114", value: "奇幻" },
      { key: "1115", value: "玄幻" },
      { key: "1116", value: "武侠" },
      { key: "1117", value: "仙侠" },
      { key: "1118", value: "都市" },
      { key: "1119", value: "校园" },
      { key: "1120", value: "历史" },
      { key: "1121", value: "军事" },
      { key: "1122", value: "游戏" },
      { key: "1123", value: "竞技" },
      { key: "1124", value: "科幻" },
      { key: "1125", value: "灵异" }
    ]
  },
  {
    title: {
      key: 'nvsheng',
      value: '女频'
    },
    categories: [
      { key: "1126", value: "现代言情" },
      { key: "1127", value: "古代言情" },
      { key: "1128", value: "幻想言情" },
      { key: "1129", value: "青春校园" },
      { key: "1130", value: "同人作品" },
      { key: "1132", value: "惊悚恐怖" },
      { key: "1133", value: "次元专区" }
    ]
  },
  {
    title: {
      key: 'chuban',
      value: '出版'
    },
    categories: [
      { key: "1136", value: "生活" },
      { key: "1137", value: "教育" },
      { key: "1134", value: "人文社科" },
      { key: "1135", value: "经管励志" },
      { key: "1138", value: "文学艺术" }
    ]
  }
]

var bookSource = JSON.stringify({
  name: "得间小说",
  url: "idejian.com",
  version: 100,
  ranks: ranks
})
