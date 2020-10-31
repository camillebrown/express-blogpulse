let express = require('express')
let db = require('../models')
let router = express.Router()

let images = [
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60",
  "https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60",
  "https://images.unsplash.com/photo-1584030763242-548b898376a0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60",
  "https://images.unsplash.com/photo-1489667897015-bf7a9e45c284?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"
]

let artImages = [
  "https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?ixlib=rb-1.2.1&ix",
  "https://i0.wp.com/www.capitolhillseattle.com/wp-content/uploads/2018/10/Maria-Flyer.png.jpg?fit=1200%2C726&ssl=1",
  "https://wehco.media.clients.ellingtoncms.com/img/photos/2018/05/02/resized_272427-1b-rattlesnake-ridge-0503_76-24567.JPG",
  "https://images.unsplash.com/photo-1521967906867-14ec9d64bee8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
  "https://www.hotelmilosantabarbara.com/wp-content/uploads/2018/03/GettyImages-635845698.jpg",
  "https://assets.palmspringslife.com/wp-content/uploads/2019/09/29114116/halloween-2019.png"
]

// POST /articles - create a new post
router.post('/', (req, res) => {
  db.article.create({
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId
  })
  .then((post) => {
    res.redirect('/')
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

// GET /articles/new - display form for creating new articles
router.get('/new', (req, res) => {
  db.author.findAll()
  .then((authors) => {
    res.render('articles/new', { authors: authors })
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

// GET /articles/:id - display a specific post and its author
router.get('/:id', (req, res) => {
  db.article.findOne({
    where: { id: req.params.id },
    include: [db.author, db.comment]
  })
  .then((article) => {
    if (!article) throw Error()
    // console.log(article.author.firstName)
    // article.comments.forEach(comment=>{
    //   console.log(comment)
    // })
    console.log(article.id)
    res.render('articles/show', { article: article, articleId: article.id, images: images, artImages: artImages})
  })
  .catch((error) => {
    console.log(error)
    res.status(400).render('main/404')
  })
})

// POST /articles/:id - create a new comment
router.post('/:id/comments', (req, res) => {
  db.comment.create({
    name: req.body.name,
    content: req.body.content,
    articleId: req.body.articleId
  }).then(comment => {
    db.article.findOne({
      where: {
        id: req.body.articleId,
      },
      include: [db.author, db.comment]
    }).then(article=>{
      article.addComment(comment)
      console.log(`Comment by ${comment.name} was added to article #${article.id} by ${article.author.firstName}`)
    })
    res.redirect(`/articles/${req.body.articleId}`)
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

module.exports = router
