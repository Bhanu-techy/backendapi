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

app.put('/users', async (request, response) => {
  const {email, password} = request.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const updateQuery = `update users set password = '${hashedPassword}' where email = '${email}'`
  await db.run(updateQuery)
  response.send('Password Updated')
})

app.get('/store/details', async (request, response) => {
  const getQuery = `select stores.name as storeName, stores.address as address, avg(reviews.rating) as rating from stores inner join reviews
   on stores.id=reviews.store_id group by stores.name order by storeName`
  const getResponse = await db.all(getQuery)
  response.send(getResponse)
})

app.post('/reviews', async (request, response) => {
  const {store_id, rating} = request.body
  const addreviewQuery = `insert into reviews(store_id, rating)
  values('${store_id}', '${rating}')`
  await db.run(addreviewQuery)
  response.send('Review added Successfully')
})

module.exports = app
