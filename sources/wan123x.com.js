const baseUrl = "https://api.wan123x.com"

//搜索
const search = (key) => {
  let response = GET(`${baseUrl}/search/getList?keyword=${encodeURI(key)}`)
  let array = []
  let $ = JSON.parse(response)
  $.data.forEach((child) => {
    array.push({
      name: child.book_name,
      author: child.author_name,
      cover: child.cover_url,
      detail: `${baseUrl}/read/getBookDetail?book_id=${child.book_id}`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let $ = JSON.parse(response).data
  let book = {
    summary: $.intro,
    words: $.words,
    catalog: $.book_id
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(`${baseUrl}/read/getCatalog?book_id=${url}&catalog_order=asc`)
  let $ = JSON.parse(response)
  let array = []
  $.data.forEach((chapter) => {
      array.push({
        name: chapter.chapter_name,
        url: `${baseUrl}/read/getChapterDetail?book_id=${url}&chapter_id=${chapter.chapter_id}`
      })
    })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let $ = JSON.parse(GET(url))
  return $.data.content.trim()
}

var bookSource = JSON.stringify({
  name: "花生小说",
  url: "wan123x.com",
  version: 100
})
