const baseUrl = "https://www.reduzww.com"

//搜索
const search = (key) => {
  let response = GET(`${baseUrl}/searchList?keyword=${encodeURI(key)}`)
  let array = []
  let $ = HTML.parse(response)
  $('div.left > section.block').forEach((child) => {
    let $ = HTML.parse(child)
    array.push({
      name: $('h4').text(),
      author: $('p.author').text(),
      cover: $('img').attr('data-src'),
      detail: `${baseUrl}${$('.bookCard > a').attr('href')}`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let book = {
    summary: $('.content').attr('title'),
    status: $('.icons-item:nth-child(3) > span').text(),
    category: $('.icons-item:nth-child(2) > span').text() + " " + $('div.des > div.tags').text(),
    words: $('.tags-item:nth-child(2)').attr('title').replace("字",""),
    update: $('.footer > div.tag').text().replace('·',''),
    lastChapter: $('.footer > a').text(),
    catalog: `${baseUrl}${$('.tabs > a:nth-child(2)').attr('href')}`
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let array = []
  $('.catalog > div').forEach((booklet) => {
    let $ = HTML.parse(booklet)
    array.push({ name: $('h2.title').text() })
    $('.tag').forEach((chapter) => {
      let $ = HTML.parse(chapter)
      array.push({
        name: $('a').text(),
        url: `${baseUrl}${$('a').attr('href')}`
      })
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let $ = HTML.parse(GET(url))
  return $('.content-chapter')
}

var bookSource = JSON.stringify({
  name: "热读小说",
  url: "reduzww.com",
  version: 100
})
