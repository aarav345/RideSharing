# API Documentation

## Endpoint: `/user/register`

### Description
This endpoint is used to register a new user. It validates the input data, hashes the password, creates a new user in the database, and returns an authentication token along with the user details.

### Method
`POST`

### Request Body
The request body should be in JSON format and must include the following fields:

| Field              | Type   | Required | Description                                      |
|--------------------|--------|----------|--------------------------------------------------|
| `fullname.firstname` | String | Yes      | The first name of the user (minimum 3 characters). |
| `fullname.lastname`  | String | No       | The last name of the user (minimum 3 characters).  |
| `email`             | String | Yes      | The email address of the user (must be valid).    |
| `password`          | String | Yes      | The password of the user (minimum 6 characters).  |

### Example Request
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

### Success Response
**Status Code: 201 Created**  
**Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f1c2e8f1d3c2a1b2c3d4e5",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

### Validation Error
**Status Code: 400 Bad Request**  
**Body:**
```json
{
  "errors": [
    {
      "msg": "Invalid email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "First name must be at least 3 characters long",
      "param": "fullname.firstname",
      "location": "body"
    },
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

### Missing Fields Error
**Status Code: 500 Internal Server Error**  
**Body:**
```json
{
  "error": "All fields are required"
}
```

### Notes
- Ensure the Content-Type header is set to application/json.
- The password is hashed before being stored in the database.
- The token is a JSON Web Token (JWT) used for authentication.

### Route Definition
The route is defined in `user.route.js` as follows:
```js
router.post('user/register', user.controller.js:registerUser);
```




## Endpoint: `/user/login`

### Description
This endpoint allows an existing user to log in by validating the input credentials, verifying the password, and returning a JWT token along with user details.

### Method
`POST`

### Request Body
The request body should be in JSON format and must include the following fields:

| Field     | Type   | Required | Description                                      |
|-----------|--------|----------|--------------------------------------------------|
| `email`   | String | Yes      | The email address of the user (must be valid).   |
| `password`| String | Yes      | The user's password (minimum 6 characters).      |

### Example Request
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

### Success Response
**Status Code:** `200 OK`  
**Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f1c2e8f1d3c2a1b2c3d4e5",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

### Validation Error Response
**Status Code:** `400 Bad Request`  
**Body:**
```json
{
  "errors": [
    {
      "msg": "Invalid email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

### Authentication Error Response
**Status Code:** `401 Unauthorized`  
**Body:**
```json
{
  "message": "Invalid email or password"
}
```

### Notes
- Ensure the `Content-Type` header is set to `application/json`.
- Password is securely verified using bcrypt.
- Token returned is a JSON Web Token (JWT) used for authenticating future requests.

### Route Definition
The route is defined in `user.route.js` as:
```js
router.post('user/login', user.controller.js:loginUser);
```



## Endpoint: `/user/logout`

### Description
This endpoint is used to log out an authenticated user. It clears the token from cookies and blacklists the token to prevent its reuse.

### Method
`GET`

### Authentication
This endpoint requires a valid JWT token. The token should be sent either in the `Authorization` header as a Bearer token or as a cookie named `token`.

### Headers (if using Authorization header)
| Key            | Value                        |
|----------------|------------------------------|
| Authorization  | Bearer `<JWT Token>`         |

### Success Response

**Status Code:** `200 OK`

**Body:**
```json
{
  "message": "Logged out successfully"
}
```

### Error Responses

#### Unauthorized Access (Missing or Invalid Token)
**Status Code:** `401 Unauthorized`

**Body:**
```json
{
  "message": "Unauthorized"
}
```

### Notes
- The token is stored in a blacklist (MongoDB) to invalidate it for future use even if it's still not expired.
- The token is cleared from the client's cookies using `res.clearCookie('token')`.
- Blacklisted tokens automatically expire after 24 hours.

### Route Definition
This route is protected using authentication middleware and defined in `user.route.js` as follows:

```js
router.get('/logout', authMiddleware.authUser, user.controller.js:logoutUser);
```


## Endpoint: `/user/profile`

### Description
This endpoint retrieves the profile information of the currently authenticated user. It requires a valid authentication token (JWT) to be sent in the `Authorization` header or as a cookie.

### Method
`GET`

### Authentication
- Required: Yes (JWT)
- Header: `Authorization: Bearer <token>` or Cookie: `token=<JWT>`

### Success Response

**Status Code:** `200 OK`

**Body:**
```json
{
  "_id": "64f1c2e8f1d3c2a1b2c3d4e5",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com"
}
```

### Error Response

**Status Code:** `401 Unauthorized`

**Body:**
```json
{
  "message": "Unauthorized"
}
```

### Notes
- This endpoint is protected and requires the `authUser` middleware to validate the JWT.
- Ensure the token has not been blacklisted (e.g., after logout).

### Route Definition
Defined in `user.route.js` as:
```js
router.get('/profile', authMiddleware.authUser, user.controller.js:getUserProfile);
```



## Endpoint: `/captain/register`

### Description
This endpoint is used to register a new captain. It validates the input data, hashes the password, stores the vehicle information, creates a new captain in the database, and returns an authentication token along with the captain details.

### Method
`POST`



### Request Body
The request body should be in JSON format and must include the following fields:

| Field                   | Type   | Required | Description                                           |
|-------------------------|--------|----------|-------------------------------------------------------|
| `fullname.firstname`    | String | Yes      | The first name of the captain (minimum 3 characters). |
| `fullname.lastname`     | String | No       | The last name of the captain (minimum 3 characters).  |
| `email`                 | String | Yes      | The email address of the captain (must be valid).     |
| `password`              | String | Yes      | The password (minimum 6 characters).                  |
| `vehicle.color`         | String | Yes      | Vehicle color.                                        |
| `vehicle.plate`         | String | Yes      | Vehicle plate number.                                 |
| `vehicle.capacity`      | Number | Yes      | Vehicle capacity (number of seats).                   |
| `vehicle.vehicleType`   | String | Yes      | Type of vehicle (e.g., "car", "motorcycle", "auto" etc.).          |

### Example Request
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password",
  "vehicle": {
    "color": "Black",
    "plate": "XYZ1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Success Response
**Status Code: 201 Created**  
**Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODE5YjhhZGMxOGE5Y2E2MGRlZmRlN2EiLCJpYXQiOjE3NDY1MTYxNDEsImV4cCI6MTc0NjYwMjU0MX0.p9AqZLgXTBUUsOUdKKQKS_SmcYOjKIJ7e5haT8KAjkE",
  "captain": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "$2b$10$BPas44jdEtAhP0Ns5b9X9eygyKTGyxv97tK3VtB6kKSoUIv9uwuTy",
    "status": "inactive",
    "vehicle": {
      "color": "Black",
      "plate": "XYZ1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "_id": "6819b8adc18a9ca60defde7a",
    "__v": 0
  }
}
```

### Validation Error
**Status Code:** `400 Bad Request`
```json
{
  "errors": [
    {
      "msg": "Invalid email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "First name must be at least 3 characters long",
      "param": "fullname.firstname",
      "location": "body"
    },
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

### Missing Fields Error
**Status Code:** `500 Internal Server Error`
```json
{
  "error": "All fields are required"
}
```


### Notes
- Ensure the `Content-Type` header is set to `application/json`.
- Password is hashed using bcrypt before being stored.
- The token returned is a JSON Web Token (JWT) for authentication.


### Route Definition
```js
router.post('/captain/register', userController.registerUser);
```



## Endpoint: `/captain/login`

### Description
This endpoint allows an existing captain to log in by validating the input credentials, verifying the password, and returning a JWT token along with captain details.

### Method
`POST`

### Request Body
The request body should be in JSON format and must include the following fields:

| Field     | Type   | Required | Description                                      |
|-----------|--------|----------|--------------------------------------------------|
| `email`   | String | Yes      | The email address of the captain (must be valid).   |
| `password`| String | Yes      | The captain's password (minimum 6 characters).      |

### Example Request
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

### Success Response
**Status Code:** `200 OK`  
**Body:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODE5YjhhZGMxOGE5Y2E2MGRlZmRlN2EiLCJpYXQiOjE3NDY1MTkzNDksImV4cCI6MTc0NjYwNTc0OX0.extBmssl0LTPx0AxsBnw07yFd2zBAp2F8BZ0WXy5tLM",
    "captain": {
        "fullname": {
            "firstname": "John",
            "lastname": "Doe"
        },
        "vehicle": {
            "color": "Black",
            "plate": "XYZ1234",
            "capacity": 4,
            "vehicleType": "car"
        },
        "_id": "6819b8adc18a9ca60defde7a",
        "email": "john.doe@example.com",
        "password": "$2b$10$BPas44jdEtAhP0Ns5b9X9eygyKTGyxv97tK3VtB6kKSoUIv9uwuTy",
        "status": "inactive",
        "__v": 0
    }
}
```

### Validation Error Response
**Status Code:** `400 Bad Request`  
**Body:**
```json
{
  "errors": [
    {
      "msg": "Invalid email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

### Authentication Error Response
**Status Code:** `401 Unauthorized`  
**Body:**
```json
{
  "message": "Invalid email or password"
}
```

### Notes
- Ensure the `Content-Type` header is set to `application/json`.
- Password is securely verified using bcrypt.
- Token returned is a JSON Web Token (JWT) used for authenticating future requests.

### Route Definition
The route is defined in `captain.route.js` as:
```js
router.post('captain/login', captain.controller.js:loginCaptain);
```




## Endpoint: `/captain/profile`

### Description
This endpoint retrieves the profile information of the currently authenticated captain. It requires a valid authentication token (JWT) to be sent in the `Authorization` header or as a cookie.

### Method
`GET`

### Authentication
- Required: Yes (JWT)
- Header: `Authorization: Bearer <token>` or Cookie: `token=<JWT>`

### Success Response

**Status Code:** `200 OK`

**Body:**
```json
{
    "captain": {
        "fullname": {
            "firstname": "John",
            "lastname": "Doe"
        },
        "vehicle": {
            "color": "Black",
            "plate": "XYZ1234",
            "capacity": 4,
            "vehicleType": "car"
        },
        "_id": "6819b8adc18a9ca60defde7a",
        "email": "john.doe@example.com",
        "status": "inactive",
        "__v": 0
    }
}
```

### Error Response

**Status Code:** `401 Unauthorized`

**Body:**
```json
{
  "message": "Unauthorized"
}
```

### Notes
- This endpoint is protected and requires the `authCaptain` middleware to validate the JWT.
- Ensure the token has not been blacklisted (e.g., after logout).

### Route Definition
Defined in `captain.route.js` as:
```js
router.get('/profile', authMiddleware.authcaptain, captain.controller.js:getCaptainProfile);
```




## Endpoint: `/captain/logout`

### Description
This endpoint is used to log out an authenticated captain. It clears the token from cookies and blacklists the token to prevent its reuse.

### Method
`GET`

### Authentication
This endpoint requires a valid JWT token. The token should be sent either in the `Authorization` header as a Bearer token or as a cookie named `token`.

### Headers (if using Authorization header)
| Key            | Value                        |
|----------------|------------------------------|
| Authorization  | Bearer `<JWT Token>`         |

### Success Response

**Status Code:** `200 OK`

**Body:**
```json
{
  "message": "Logged out successfully"
}
```

### Error Responses

#### Unauthorized Access (Missing or Invalid Token)
**Status Code:** `401 Unauthorized`

**Body:**
```json
{
  "message": "Unauthorized"
}
```

### Notes
- The token is stored in a blacklist (MongoDB) to invalidate it for future use even if it's still not expired.
- The token is cleared from the client's cookies using `res.clearCookie('token')`.
- Blacklisted tokens automatically expire after 24 hours.

### Route Definition
This route is protected using authentication middleware and defined in `captain.route.js` as follows:

```js
router.get('/logout', authMiddleware.authCaptain, captain.controller.js:logoutCaptain);
```
