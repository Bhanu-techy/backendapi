# Users Post Dashboard

Given two files `app.js` and a database file `database.db` consisting of four tables `users`, `posts` .

Write APIs to perform CRUD operations on the tables `users`, `posts` containing the following columns,

**users Table**

| Columns    | Type       |
| ---------- | ---------- |
| id         | INTEGER    |
| name       | TEXT|
| password   | TEXT       |
| email      | TEXT       |

**stores Table**

| Columns       | Type    |
| ------------- | ------- |
|  post_id      | INTEGER |
|  user_id      | INTEGER |
|  caption      | TEXT    |
|  img          | TEXT    | 


### API 1

#### Path: `/login

#### Method: `POST`

#### Description:

Login Api for Normal Users

#### Request

```
[
  {
    "email" : "bhanu@gmail.com",
    "password" : "bhanu@1234"
},
{
    "email"  :   "rahul@gmail.com",
    "password" : "rahul@1234
}
]
```
#### Response 

```
jwt_token

```

### API 2

#### Path: `/users/:id

#### Method: `GET`

#### Description:

GET Api to retrive a user details

#### Response

```
[
  {
    "name" : "bhanu",
    "email" : "bhanu@gmail.com",
}
]
```

### API 3

#### Path: `/posts`

#### Method: `GET`

#### Description:

GET Api returns all post details

#### Response

```
[
  {
    "name" : "bhanu",
    "caption : "Peacfull Evenings",
    "img"  : " "https://res.cloudinary.com/dsqphsoxb/image/upload/v1760428105/mountain-landscape_nnviov.jpg"
},
...
]
```
#### API 4

#### PATH : `/posts/:id`

#### Method: `PUT`

#### Description:

PUT API to Edit caption

#### Request

```
{
    "caption" : "Peacfull Evenings"
}

```
#### Response

"caption updated successfully"

#### API 5

#### PATH : `/posts?:id`

#### Method: `DELETE`

#### Description:

DELETE Api to delete a post

#### Response

```
Post Removed

```

<br/>

Use `npm install` to install the packages.

**Export the express instance using the default export syntax.**

**Use Common JS module syntax.**
