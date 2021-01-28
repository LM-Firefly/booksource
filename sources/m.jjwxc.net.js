  const baseUrl = "https://m.jjwxc.net"
  const baseurlapp = "http://app.jjwxc.net/androidapi"
  //搜索
  const search = (key) => {
      let response = GET(`${baseurlapp}/search?keyword=${encodeURI(key)}&type=1&page=1&token=null&searchType=1&sortMode=DESC&versionCode=133`)
      let array = []
      let $ = JSON.parse(response)
      $.items.forEach((item) => {
          array.push({
              name: item.novelname,
              author: item.authorname,
              cover: item.cover,
              detail: `${baseurlapp}/novelbasicinfo?novelId=${item.novelid}`,
          })
      })
      return JSON.stringify(array)
  }

  //详情
  const detail = (url) => {
      let response = GET(url)
      let $ = JSON.parse(response)
      let book = {
          summary: `${$.novelIntroShort}\n标签: ${$.novelTags}\n${$.protagonist}\n${$.costar}\n${$.other}\n风格: ${$.novelStyle}\n视角: ${$.mainview}\n${$.novelIntro.replace(/(&lt;br\/&gt;)+/g,"\n")}`,
          status: $.novelStep == 1 ? "连载" : "完结",
          category: $.novelClass.replace(/--/, " "),
          words: $.novelSize,
          update: $.renewDate,
          lastChapter: $.renewChapterName,
          catalog: `https://app-cdn.jjwxc.net/androidapi/chapterList?novelId=${$.novelId}&more=0&whole=1`
      }
      return JSON.stringify(book)
  }

  //目录
  const catalog = (url) => {
      let response = GET(url)
      let $ = JSON.parse(response)
      let array = []
      $.chapterlist.forEach((chapter) => {
          array.push({
              name: chapter.chaptername + "  " + chapter.chapterintro,
              url: chapter.isvip == 0 ? `https://app-cdn.jjwxc.net/androidapi/chapterContent?novelId=${chapter.novelid}&chapterId=${chapter.chapterid}&token=${COOKIE("sid")}` : `https://m.jjwxc.net/vip/${chapter.novelid}/${chapter.chapterid}?ctime=`,
              vip: chapter.isvip == 2
          })
      })
      return JSON.stringify(array)
  }

  //章节
  const chapter = (url) => {

      let response = GET(url)
      if (url.match(/app-cdn/)) return JSON.parse(response).content.replace(/(\&lt;br\&gt;)+/g, "\n")
      let $ = HTML.parse(response)
      //VIP章节      
      //未购买返回403和自动订阅地址
      if ((/购买VIP文章/).test(response)) throw JSON.stringify({
          code: 403,
          message: url
      })
      return  $('ul > li:has(br)')
  }

  //个人中心
  const profile = () => {
      let response = GET(`${baseurlapp}/getUserCenter?versionCode=194&token=${COOKIE('sid')}`)
      let $ = JSON.parse(response)
      return JSON.stringify({
          basic: [{
                  name: "账号",
                  value: decodeURI(decodeURI(COOKIE("nickname"))),
                  url: 'https://m.jjwxc.net//my'
              },
              {
                  name: '月石',
                  value: $.coinstotal
              },
              {
                  name: '晋江币',
                  value: $.balance,
                  url: 'https://m.jjwxc.net/pay',
              },
              {
                  name: '营养液',
                  value: $.nutrition
              }
          ],
          extra: [{
              name: '自动签到',
              type: 'permission',
              method: 'sign',
              times: 'day'
          }, {
              name: '书架',
              type: 'books',
              method: 'bookshelf'
          }]
      })
  }
  const sign = () => {
      let res = GET('https://m.jjwxc.net/my/signIn')
      let $ = JSON.parse(res)
      return $.status == 70003
  }

  const bookshelf = () => {
      let response = POST("https://app.jjwxc.org/androidapi/incrementFavorite", {
          data: `versionCode=194&token=${COOKIE("sid")}&classId=&order=0&offset=0&limit=1000`
      })
      let books = JSON.parse(response).addData.map(book => ({
          name: book.novelName,
          author: book.authorName,
          cover: book.novelCover,
          detail: `http://app-cdn.jjwxc.net:80/androidapi/novelbasicinfo?novelId=${book.novelId}`
      }))
      return JSON.stringify({
          books
      })
  }
  const rank = (title, category, page) => {
      url = !category ? `http://app.jjwxc.org/${title}` : `http://app.robook.com:80/bookstore/getTop?channel=${title}${category}&offset=0&limit=100&versionCode=133`
      let response = GET(url)
      let $ = JSON.parse(response)
      let books = []
      $.forEach((item) => {
          books.push({
              name: item.novelName,
              author: item.authorName,
              cover: item.cover,
              detail: `http://app-cdn.jjwxc.net:80/androidapi/novelbasicinfo?novelId=${item.novelId}`,
          })
      })
      return JSON.stringify({
          end: page != 0,
          books
      })
  }
  const ranks = [{
      "title": {
          "key": "androidapi/newDayList",
          "value": "新书"
      }
  }, {
      "title": {
          "key": 70000,
          "value": "月榜"
      },
      "categories": [{
          "key": "1",
          "value": "言情"
      }, {
          "key": "2",
          "value": "纯爱"
      }, {
          "key": "3",
          "value": "原创"
      }, {
          "key": "4",
          "value": "衍生"
      }]
  }, {
      "title": {
          "key": 70000,
          "value": "季榜"
      },
      "categories": [{
          "key": "6",
          "value": "言情"
      }, {
          "key": "7",
          "value": "纯爱"
      }, {
          "key": "8",
          "value": "原创"
      }, {
          "key": "9",
          "value": "衍生"
      }]
  }, {
      "title": {
          "key": 7000,
          "value": "半年榜"
      },
      "categories": [{
          "key": "11",
          "value": "言情"
      }, {
          "key": "12",
          "value": "纯爱"
      }, {
          "key": "13",
          "value": "原创"
      }, {
          "key": "14",
          "value": "衍生"
      }]
  }, {
      "title": {
          "key": 7000,
          "value": "总分榜"
      },
      "categories": [{
          "key": "21",
          "value": "言情"
      }, {
          "key": "22",
          "value": "纯爱"
      }, {
          "key": "23",
          "value": "原创"
      }, {
          "key": "24",
          "value": "衍生"
      }]
  }, {
      "title": {
          "key": 7000,
          "value": "长生殿"
      },
      "categories": [{
          "key": "16",
          "value": "言情"
      }, {
          "key": "17",
          "value": "纯爱"
      }, {
          "key": "18",
          "value": "原创"
      }, {
          "key": "19",
          "value": "衍生"
      }]
  }, {
      "title": {
          "key": 6,
          "value": "今日限免"
      }
  }, {
      "title": {
          "key": 10000,
          "value": "完结金榜"
      },
      "categories": [{
          "key": "6",
          "value": "言情"
      }, {
          "key": "7",
          "value": "纯爱"
      }, {
          "key": "8",
          "value": "原创"
      }, {
          "key": "9",
          "value": "衍生"
      }]
  }, {
      "title": {
          "key": 80000,
          "value": "霸王票榜"
      },
      "categories": [{
          "key": "1",
          "value": "言情"
      }, {
          "key": "2",
          "value": "纯爱"
      }, {
          "key": "3",
          "value": "原创"
      }, {
          "key": "4",
          "value": "衍生"
      }]
  }, {
      "title": {
          "key": 60000,
          "value": "勤奋指数榜"
      },
      "categories": [{
          "key": "6",
          "value": "言情"
      }, {
          "key": "7",
          "value": "纯爱"
      }, {
          "key": "8",
          "value": "原创"
      }, {
          "key": "9",
          "value": "衍生"
      }]
  }]

  var bookSource = JSON.stringify({
      name: "晋江文学城",
      url: "m.jjwxc.net",
      version: 103,
      authorization: "https://m.jjwxc.net/my/login?login_mode=jjwxc",
      cookies: [".jjwxc.net"],
      ranks: ranks
  })
