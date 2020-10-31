require('dotenv').config()
let express = require('express')
let ejsLayouts = require('express-ejs-layouts')
let db = require('./models')
let moment = require('moment')
let app = express()
let images = [
  "https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?ixlib=rb-1.2.1&ix",
  "https://i0.wp.com/www.capitolhillseattle.com/wp-content/uploads/2018/10/Maria-Flyer.png.jpg?fit=1200%2C726&ssl=1",
  "https://wehco.media.clients.ellingtoncms.com/img/photos/2018/05/02/resized_272427-1b-rattlesnake-ridge-0503_76-24567.JPG",
  "https://images.unsplash.com/photo-1521967906867-14ec9d64bee8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
  "https://www.hotelmilosantabarbara.com/wp-content/uploads/2018/03/GettyImages-635845698.jpg",
  "https://assets.palmspringslife.com/wp-content/uploads/2019/09/29114116/halloween-2019.png"
]

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(ejsLayouts)
app.use(express.static(__dirname + '/public/'))

// middleware that allows us to access the 'moment' library in every EJS view
app.use((req, res, next) => {
  res.locals.moment = moment
  next()
})

// bring in authors and articles controllers
app.use('/authors', require('./controllers/authors'))
app.use('/articles', require('./controllers/articles'))

// GET / - display all articles and their authors
app.get('/', (req, res) => {
  db.article.findAll({
    include: [db.author]
  }).then((articles) => {
    res.render('main/index', { articles: articles, images: images})
  }).catch((error) => {
    console.log(error)
    res.status(400).render('main/404')
  })
})

app.listen(process.env.PORT || 8000, () => {
  console.log(`You're listening to the smooth sounds of port ${process.env.PORT}`)
})