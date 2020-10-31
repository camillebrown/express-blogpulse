var db = require('./models')

// db.comment.create({
//   name: 'Kristy Allen',
//   content: 'This is terrible! I hate it.',
//   articleId: 1
// })
// .then(function(comment) {
//   console.log(comment.get())
// })

db.article.findOne({
    where: { id: 1 },
    include: [db.comment]
  }).then(function(article) {
    // by using eager loading, the article model should have a comments key
    console.log(article.comments)
  })