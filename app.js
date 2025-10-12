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

//Signup Api for Normal Users
app.post('/api/auth/signup', async (request, response) => {
  const {name, password, address, email, role} = request.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const selectUserQuery = `SELECT * FROM users WHERE email = '${email}'`
  const dbUser = await db.get(selectUserQuery)
  if (!dbUser || (Array.isArray(dbUser) && dbUser.length === 0)) {
    const createUserQuery = `
      INSERT INTO 
        users (name, password, address, email, role) 
      VALUES 
        ( 
          '${name}',
          '${hashedPassword}',
          '${address}',
          '${email}',
          '${role}'
        )`
    const dbResponse = await db.run(createUserQuery)
    const newUserId = dbResponse.lastID
    response.send(`Created new user with ${newUserId}`)
  } else {
    response.status = 400
    response.send('User already exists')
  }
})

//POST Api only for Admin to add new user
app.post('/api/admin/users', async (request, response) => {
  const {name, password, address, email, role} = request.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const selectUserQuery = `SELECT * FROM users WHERE email = '${email}'`
  const dbUser = await db.get(selectUserQuery)
  if (!dbUser || (Array.isArray(dbUser) && dbUser.length === 0)) {
    const createUserQuery = `
      INSERT INTO 
        users (name, password, address, email, role) 
      VALUES 
        ( 
          '${name}',
          '${hashedPassword}',
          '${address}',
          '${email}',
          '${role}'
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

// Put api to updated password
app.put(
  '/api/auth/update-password',
  authenticateToken,
  async (request, response) => {
    const {email, password} = request.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const updateQuery = `update users set password = '${hashedPassword}' where email = '${email}'`
    await db.run(updateQuery)
    response.send('Password Updated')
  },
)

// GET Api to display all Users
app.get('/api/adim/users', authenticateToken, async (request, response) => {
  const getQuery = `select name, email, address, role from users`
  const getResponse = await db.all(getQuery)
  response.send(getResponse)
})

// GET Api to display particular user
app.get(
  '/api/admin/users/:userId',
  authenticateToken,
  async (requset, response) => {
    const {userId} = requset.params
    const getUser = `select * from users where id = ${userId}`
    const userResponse = await db.get(getUser)
    response.send(userResponse)
  },
)

// GET Api to get count of stores, ratings and users
app.get(
  '/api/admin/dashboard',
  authenticateToken,
  async (request, response) => {
    const getStoresCount = `select count() as count from stores`
    const getUsersCount = `select count() as count from users`
    const getRatings = 'select count() as count from ratings'
    const getStoresCountResponse = await db.all(getStoresCount)
    const getUsersCountResponse = await db.all(getUsersCount)
    const getRatingCount = await db.all(getStoresCount)
    const counts = {
      stores: getStoresCountResponse[0].count,
      users: getUsersCountResponse[0].count,
      rating: getRatingCount[0].count,
    }
    response.send(counts)
  },
)

// POST Api to add store
app.post('/api/admin/stores', authenticateToken, async (request, response) => {
  const {name, email, address, owner_id} = request.body
  const addQuery = `insert into stores(name, email, address, owner_id)
  values('${name}', '${email}', '${address}', '${owner_id}')`
  await db.run(addQuery)
  response.send('Store added successfully')
})

// GET Api of Admin to dipaly all stores and their ratings
app.get('/api/admin/stores', authenticateToken, async (request, response) => {
  const getQuery = `select stores.name as storeName, stores.email, stores.address as address, avg(ratings.rating) as rating from stores inner join ratings
   on stores.id=ratings.store_id group by stores.name order by storeName`
  const getResponse = await db.all(getQuery)
  response.send(getResponse)
})

app.post('/ratings', async (request, response) => {
  const {store_id, rating} = request.body
  const addreviewQuery = `insert into ratings(store_id, rating)
  values('${store_id}', '${rating}')`
  await db.run(addreviewQuery)
  response.send('Review added Successfully')
})

module.exports = app
