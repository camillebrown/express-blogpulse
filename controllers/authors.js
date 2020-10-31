let express = require('express')
let db = require('../models')
let router = express.Router()
let images = [
  "https://images.unsplash.com/photo-1561677843-39dee7a319ca?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60",
  "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60",
  "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60",
  "https://i.imgur.com/AcRwptu.jpeg"
]

// GET /authors - display all authors
router.get('/', (req, res) => {
  db.author.findAll()
  .then((authors) => {
    res.render('authors/index', { authors: authors, images: images })
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

// POST /authors - create a new author
router.post('/', (req, res) => {
  db.author.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    bio: req.body.bio
  })
  .then((author) => {
    res.redirect('/authors')
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

// GET /authors/new - display form for creating a new author
router.get('/new', (req, res) => {
  res.render('authors/new')
})

// GET /authors/:id - display a specific author and their posts
router.get('/:id', (req, res) => {
  db.author.findOne({
    include: [db.article],
    where: {id: req.params.id}
  }).then((author) => {
    res.render('authors/show', { author: author, images: images})
  }).catch((error) => {
    console.log(error)
    res.status(400).render('main/404')
  })
})

module.exports = router
