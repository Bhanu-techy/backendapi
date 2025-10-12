# Covid-19 India

Given two files `app.js` and a database file `database.db` consisting of four tables `colleges`, `users`, `favorite_colleges` and `reviews`.

Write APIs to perform CRUD operations on the tables `colleges`, `reviews` containing the following columns,

**users Table**

| Columns    | Type       |
| ---------- | ---------- |
| user_id    | INTEGER    |
| name       | VARCHAR(60)|
| password   | TEXT       |
| address    | TEXT       |
| role       | VARCHAR(20)|

**stores Table**

| Columns       | Type    |
| ------------- | ------- |
|  id           | INTEGER |
|  name         | VARCHAR |
|  email        | VARCHAR |
|  address      | VARCHAR |
|  owner_id     | INTEGER |

**ratings Table**

| Columns       | Type    |
| ------------- | ------- |
| id            | INTEGER |
| owner_id      | INTEGER |
| rating        | INTEGER |
| created_at    | TEXT    |


### API 1

#### Path: `/api/auth/signup

#### Method: `POST`

#### Description:

Signup Api for Normal Users

#### Request

```
[
  {
    "name" : "Bhanu Prakash",
    "password" : "bhanu@2025",
    "address" : "1-22/A-6, Kukatpally, Hyderabad",
    "email" : "bhanuprakashdevari@gmail.com",
    "role" : "admin"
}
]
```

### API 2

#### Path: `/api/admin/user

#### Method: `POST`

#### Description:

POST Api to add user only for Admins

#### Request

```
[
  {
    "name" : "Bhanu Prakash",
    "password" : "bhanu@2025",
    "address" : "1-22/A-6, Kukatpally, Hyderabad",
    "email" : "bhanuprakashdevari@gmail.com",
    "role" : "admin"
}
]
```

### API 3

#### Path: `/api/auth/login`

#### Method: `POST`

#### Description: 

Login api for authencate users

#### Request

```
{
    "email" : "bhanuprakashdevari@gmail",
    "password : "bhanu@2025"
}
```

#### Response 

```
jwt_token

```

### API 4

#### Path: `//api/auth/update-password`

#### Method: `PUT`

#### Description:

PUT Api to change password for authencate users

#### Response

Password Updated

### API 5

#### Path: `/api/adim/users`

#### Method: `GET`

#### Description:

GET API to display all users
#### Response

```
[
    {
        "name": "Vara Prasad Madivala",
        "email": "varaprasad@gmail.com",
        "address": "5-33/e-33, Aziz Nagar, Hyderabad",
        "role": "owner"
    }
    ...
]
```

### API 6

#### Path: `/api/admin/users/:userId`

#### Method: `GET`

#### Description:

GET Api to get a single user details

#### Response

```
{
    "name": "Vara Prasad Madivala",
    "email": "varaprasad@gmail.com",
    "address": "5-33/e-33, Aziz Nagar, Hyderabad",
    "role": "owner"
}

```

#### API 7

#### PATH : `/api/admin/dashboard`

#### Method: `GET`

#### Description:

GET Api to display all table count

#### Response

```
{
    "stores": 4,
    "users": 3,
    "rating": 4
}

```

#### API 8

#### PATH : `/api/admin/stores`

#### Method: `POST`

#### Description:

POST API to add store to store table

#### Request

```
{
    "name" : "Techworld Electonics",
    "email" : "techworld@gmail.com",
    "address" : "KPHB, Kukatpally, Hyderabd",
    "owner_id" : 3
}

```
#### Response

"Store added successfully"

#### API 9

#### PATH : `/api/admin/stores`

#### Method: `GET`

#### Description:

GET Api to display all stores and their average ratings

#### Response

```
[
    {
        "storeName": "Book store",
        "email": "bookstore@gmail.com",
        "address": "Vivek Nagar, Kukatpally, Hyderabd",
        "rating": 3.75
    },
    ...
]

```

<br/>

Use `npm install` to install the packages.

**Export the express instance using the default export syntax.**

**Use Common JS module syntax.**
