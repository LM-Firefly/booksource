//搜索
const search = (key) => {
  let response = GET(`https://souxs.leeyegy.com/search.aspx?key=${encodeURI(key)}&page=1&siteid=app2`)
  let array = []
  let $ = JSON.parse(response)
  $.data.forEach((child) => {
    array.push({
      name: child.Name,
      author: child.Author,
      cover: child.Img,
      detail: `https://infosxs.pysmei.com/BookFiles/Html/${parseInt(child.Id.slice(0,3)) + 1}/${child.Id}/info.html`
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let $ = JSON.parse(response).data
  let book = {
    summary: $.Desc,
    status: $.BookStatus,
    category: $.CName,
    update: $.LastTime,
    lastChapter: $.LastChapter,
    catalog: `${parseInt($.Id.toString().slice(0,3)) + 1}/${$.Id}`
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(`https://infosxs.pysmei.com/BookFiles/Html/${url}/index.html`).replaceAll("},]","}]")
  let $ = JSON.parse(response)
  let array = []
  $.data.list.forEach((booklet) => {
    array.push({ name: booklet.name })
    booklet.list.forEach((chapter) => {
      array.push({
        name: chapter.name,
        url: `https://contentxs.pysmei.com/BookFiles/Html/${url}/${chapter.id}.html`
      })
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let $ = JSON.parse(GET(url))
  return $.data.content.replaceAll("@@﻿@@","").replaceAll("@@@@","").replaceAll("正在更新中，请稍等片刻，内容更新后，重新进来即可获取最新章节！亲，如果觉得APP不错，别忘了点右上角的分享给您好友哦！","")
}

var bookSource = JSON.stringify({
  name: "笔趣阁",
  url: "pysmei.com",
  version: 100
})
