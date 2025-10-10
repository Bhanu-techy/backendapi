const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const cors = require('cors')
const app = express()
const jwt = require('jsonwebtoken')
//app.use(cors())
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

app.post('/users/', async (request, response) => {
  const {name, password, address, email} = request.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const selectUserQuery = `SELECT * FROM users WHERE email = '${email}'`
  const dbUser = await db.get(selectUserQuery)
  if (!dbUser || (Array.isArray(dbUser) && dbUser.length === 0)) {
    const createUserQuery = `
      INSERT INTO 
        users (name, password, address, email) 
      VALUES 
        ( 
          '${name}',
          '${hashedPassword}',
          '${address}',
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
app.post('/login', async (request, response) => {
  const {email, password} = request.body
  const getQuery = `select * from users where email = '${email}'`
  const dbUser = await db.get(getQuery)

  if (!dbUser || (Array.isArray(dbUser) && dbUser.length === 0)) {
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

app.post('/users/details', async (request, response) => {
  const {email} = request.body
  const getQuery = `select * from users where email = '${email}'`
  const getResponse = await db.get(getQuery)
  response.send(getResponse)
  console.log(email)
})

module.exports = app
