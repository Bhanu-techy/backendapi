const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const cors = require('cors')
const app = express()
const jwt = require('jsonwebtoken')
app.use(cors())
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

// Login api
app.post('/login', async (request, response) => {
  const {email, password} = request.body
  const getQuery = `select * from users where email = '${email}'`
  const dbUser = await db.get(getQuery)

  if (dbUser === undefined) {
    response.status(400)
    response.send('Invalid User')
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password)

    if (isPasswordMatched === true) {
      const payload = {id: dbUser.id, email: dbUser.email}
      const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN')
      response.status(200)
      response.send({jwt_token: jwtToken})
    } else {
      response.status(400)
      response.send({error_msg: 'Invalid Password'})
    }
  }
})

app.post('/posts', async (req, res) => {
  const {user_id, caption, img} = req.body
  const addQuery = `insert into posts(user_id, caption, img)
  values(${user_id}, '${caption}', '${img}')`
  const response = await db.run(addQuery)
  const newId = response.lastID
  res.send(`added post ${newId}`)
})

app.get('/users/:userId', async (req, res) => {
  const {userId} = req.params
  const getquery = `select * from users where id = ${userId}`
  const response = await db.get(getquery)
  res.send(response)
})

app.get('/posts/:userId', async (req, res) => {
  const {userId} = req.params
  const getquery = `select * from posts where user_id = ${userId}`
  const response = await db.all(getquery)
  res.send(response)
})

app.delete('/posts/:postId', async (req, res) => {
  const {postId} = req.params
  const deleteQuery = `delete from posts where post_id = ${postId}`
  await db.run(deleteQuery)
  res.send('Post removed')
})

app.get('/posts', async (req, res) => {
  const getquery = `select u.name, p.post_id, p.user_id, p.caption, p.img from posts p inner join users u on
  p.user_id= u.id order by caption`
  const response = await db.all(getquery)
  res.send(response)
})

app.put('/posts/:postId', async (req, res) => {
  const {postId} = req.params
  const {caption} = req.body
  const updateQuery = `update posts set caption = '${caption}'
  where post_id = ${postId}`
  await db.run(updateQuery)
  res.send('caption updated successfully')
})

module.exports = app
