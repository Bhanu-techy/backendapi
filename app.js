const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const cors = require('cors')
const app = express()

app.use(cors());
app.use(express.json())

const bcrypt = require('bcrypt')

const dbPath = path.join(__dirname, 'database.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()


app.get('/colleges', async (request, response) => {
  const {order} = request.query
  const getQuery = `select * from colleges order by fee ${order}`
  const getResponse = await db.all(getQuery)
  response.send(getResponse)
})

app.get('/reviews', async (request, response) => {
  const getQuery = `select * from reviews`
  const getResponse = await db.all(getQuery)
  response.send(getResponse)
})

app.post('/reviews', async (request, response) => {
  const {college_id, comment, rating} = request.body

  const addReview = `insert into reviews(college_id, comment, rating)
  values('${college_id}', '${comment}', '${rating}');`

  const dbResponse = await db.run(addReview)
  const id = dbResponse.lastID
  response.send({id: id})
})

app.get('/favorites', async (request, response) => {
  const getReviews = `SELECT u.id AS user_id, u.name AS user_name,
             GROUP_CONCAT(c.name, ', ') AS favorite_colleges
      FROM users u
      JOIN favorite_colleges f ON u.id = f.user_id
      JOIN colleges c ON c.id = f.college_id
      GROUP BY u.id, u.name`

  const getResponse = await db.all(getReviews)
  response.send(getResponse)
})

app.post('/favorites', async (request, response) => {
  const {user_id, college_id} = request.body
  const addFavorite = `insert into favorite_colleges(user_id, college_id)
  values('${user_id}', '${college_id}')`
  await db.run(addFavorite)
  response.send('Marked as favorite')
})

app.delete('/favorites/:id', async (request, response) => {
  const {id} = request.params
  const {userId} = request.body

  console.log(id)
  const deleteQuery = `delete from favorite_colleges where user_id = ${userId} and college_id = ${id} `

  await db.run(deleteQuery)
  response.send('Removed from favorites')
})

module.exports = app
