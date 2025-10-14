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

app.post('/api/auth/signup', async (request, response) => {
  const {name, password, email} = request.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const selectUserQuery = `SELECT * FROM users WHERE email = '${email}'`
  const dbUser = await db.get(selectUserQuery)
  if (!dbUser || (Array.isArray(dbUser) && dbUser.length === 0)) {
    const createUserQuery = `
      INSERT INTO 
        users (name, password, email) 
      VALUES 
        ( 
          '${name}',
          '${hashedPassword}',
          '${email}'
          
        )`
    const dbResponse = await db.run(createUserQuery)
    const newUserId = dbResponse.lastID
    response.send(`Created new user with ${newUserId}`)
  } else {
    response.status = 400
    response.send('User already exists')
  }
})

// Login api
app.post('/api/auth/login', async (request, response) => {
  const {email, password} = request.body
  const getQuery = `select * from users where email = '${email}'`
  const dbUser = await db.get(getQuery)
  const {id} = dbUser

  if (!dbUser || (Array.isArray(dbUser) && dbUser.length === 0)) {
    response.status(400)
    response.send('Invalid User')
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password)

    if (isPasswordMatched === true) {
      const payload = {id: dbUser.id, email: dbUser.email}
      const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN')
      response.status(200)
      response.send({jwt_token: jwtToken, id})
    } else {
      response.status(400)
      response.send({error_msg: 'Invalid Password'})
    }
  }
})

const authenticateToken = (request, response, next) => {
  let jwtToken
  const authHeader = request.headers['authorization']
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]
  }
  if (jwtToken === undefined) {
    response.status(401)
    response.send('Invalid JWT Token')
  } else {
    jwt.verify(jwtToken, 'MY_SECRET_TOKEN', async (error, payload) => {
      if (error) {
        response.status(401)
        response.send('Invalid JWT Token')
      } else {
        next()
      }
    })
  }
}

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

app.delete('/posts/:postId', async (req, res) => {
  const {postId} = req.params
  const deleteQuery = `delete from posts where post_id = ${postId}`
  await db.run(deleteQuery)
  res.send('Post removed')
})

app.get('/posts', async (req, res) => {
  const getquery = `select * from posts`
  const response = await db.all(getquery)
  res.send(response)
})

module.exports = app
