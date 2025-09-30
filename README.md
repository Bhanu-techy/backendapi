# Covid-19 India

Given two files `app.js` and a database file `database.db` consisting of four tables `colleges`, `users`, `favorite_colleges` and `reviews`.

Write APIs to perform CRUD operations on the tables `colleges`, `reviews` containing the following columns,

**user Table**

| Columns    | Type    |
| ---------- | ------- |
| user_id    | INTEGER |
| name       | TEXT    |
| password   | TEXT    |

**colleges Table**

| Columns       | Type    |
| ------------- | ------- |
|  id           | INTEGER |
|  name         | VARCHAR |
|  location     | VARCHAR |
|  corse        | VARCHAR |
|  Fee          | INTEGER |

**reviews Table**

| Columns       | Type    |
| ------------- | ------- |
| id            | INTEGER |
| college_id    | INTEGER |
| comment       | TEXT    |
| rating        | INTEGER |

**favorite_colleges Table**

| Columns       | Type    |
| ------------- | ------- |
| id            | INTEGER |
| user_id       | INTEGER |
| college_id    | INTEGER |



### API 1

#### Path: `/colleges

#### Method: `GET`

#### Description:

Returns a list of all colleges in the colleges table

#### Response

```
[
  {
        "id": 1,
        "name": "GRIET Engineering College",
        "location": "Hyderabad",
        "course": "Computer Science",
        "fee": 100000
    }, 

  ...
]
```

### API 2

#### Path: `/reviews`

#### Method: `GET`

#### Description:

Returns a list of reviews from reviews

#### Response

[
    {
        "id": 1,
        "college_id": 1,
        "comment": "Great college with excellent faculty",
        "rating": 5
    },
    ....
]
```

### API 3

#### Path: `/reviews`

#### Method: `POST`

#### Description:

Create a review in the reviews table, `id` is auto-incremented

#### Request

```
{
    "college_id": 4,
    "comment": "Amazing campus life and clubs",
    "rating": 5
}
```

#### Response

```
{id : id}
```

### API 4

#### Path: `/favorites`

#### Method: `GET`

#### Description:

Returns a user details and their favorite colleges of each user

#### Response

```
[
    {
        "user_id": 1,
        "user_name": "Bhanu",
        "favorite_colleges": "Sunrise Business School, VJIT Engineering College"
    },
    ....
]
```

```
District Removed

```

### API 5

#### Path: `/favorites`

#### Method: `POST`

#### Description:

Marks the college as favorite college for a specific user

#### Request

```
{
    "user_id" : 1,
    "college_id" : 5
}
```

#### Response

```

Marked as favorite

```
### API 

#### Path: `/favorite/:id`

#### Method: `DELETE`

#### Description:

Removes the college as from the favorite list of a specific user based on user_id

#### Response
```

Removed from favorites

<br/>

Use `npm install` to install the packages.

**Export the express instance using the default export syntax.**

**Use Common JS module syntax.**
